import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/entities/users.entity';
import {RegisterDto} from "./dto/register.dto";
import { JwtPayload, SignInResponse } from 'src/model/auth.model';
import {VerifyAccountDto} from "./dto/verifyAccount.dto";
import {SigninDto} from "./dto/signin.dto";
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
        private mailerService: MailerService,
    ) {}

    async register(user: RegisterDto):  Promise<{ user: Partial<RegisterDto>; token: string }> {
        const existingUser = await this.usersRepository.findOneBy({ email: user.email.toLowerCase() });
        if (existingUser) {
            throw new ConflictException('Email is already in use');
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        user.password = await User.hashPassword(user.password);
        const newUser = this.usersRepository.create({ ...user, code });

        try {
            await this.usersRepository.save(newUser);

            const blockToken = this.jwtService.sign(
                { userId: newUser.id },
                { secret: this.configService.get<string>('JWT_SECRET'), expiresIn: '10m' }
            );

            try {
                await this.mailerService.sendMail({
                    to: newUser.email,
                    subject: 'Your Two Factor Authentication Code',
                    text: `Your 2FA code is: ${code}.`,
                });
            } catch (emailError) {
                throw new BadRequestException(`Error sending email: ${emailError.message}`);
            }

            const {password, refreshToken, code: userCode, ...userResponse} = newUser;

            return { user: userResponse, token: blockToken };
        } catch (error) {
            if (error instanceof QueryFailedError && error.driverError.code === '23505') {
                throw new ConflictException('Email is already in use');
            }
            throw error;
        }
    }

    async VerifyAccount(body: VerifyAccountDto, token: string) {
        let payload: JwtPayload;
        try {
            payload = this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });
        } catch (error) {
            throw new BadRequestException('Invalid or expired token');
        }

        if (!payload || !payload.userId) {
            throw new BadRequestException('Invalid token');
        }

        const userId = parseInt(payload.userId, 10);
        if (isNaN(userId)) {
            throw new BadRequestException('Invalid user ID');
        }

        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new BadRequestException('User not found');
        }
        if (user.code !== body.code) {
            throw new BadRequestException('Invalid 2FA code');
        }

        user.isVerified = true;
        user.code = null;
        await this.usersRepository.save(user);
    }

    async signIn(signInDto: SigninDto): Promise<SignInResponse> {
        const jwtSecret = this.configService.get<string>('JWT_SECRET');
        const jwtExpiry = this.configService.get<string>('JWT_EXPIRY');
        const jwtRefreshExpiry = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN');
        const jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

        const { email, password } = signInDto;

        const user = await this.usersRepository.findOne({
            where: { email: email.toLowerCase() },
            select: ['id', 'email', 'password', 'isVerified', 'name', 'role']
        });

        if (!user) {
            throw new BadRequestException('Invalid email or password');
        }

        if (!user.isVerified) {
            throw new BadRequestException('Account not verified. Please verify your email.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Invalid password');
        }

        const payload = {
            email: user.email,
            name: user.name,
            role: user.role,
            isVerified: user.isVerified,
            sub: user.id
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: jwtExpiry,
            secret: jwtSecret,
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: jwtRefreshSecret,
            expiresIn: jwtRefreshExpiry,
        });

        user.refreshToken = refreshToken;
        await this.usersRepository.save(user);

        return {
            accessToken,
            refreshToken,
            user: {
                email: user.email,
                name: user.name,
                role: user.role,
                isVerified: user.isVerified
            }
        };
    }

    async refreshToken(refreshToken: RefreshTokenDto) {
        try {
            const jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
            const payload = this.jwtService.verify(refreshToken.refreshToken, {
                secret: jwtRefreshSecret,
            });
            const user = await this.usersRepository.findOne({
                where: { id: payload.sub, refreshToken: refreshToken.refreshToken },
            });

            if (!user) {
                throw new BadRequestException('Invalid token');
            }

            const jwtSecret = this.configService.get<string>('JWT_SECRET');
            const accessExpiration = this.configService.get<string>('JWT_EXPIRY');
            const refreshExpiration = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN');

            const newAccessToken = this.jwtService.sign(
                { email: user.email, sub: user.id },
                {
                    secret: jwtSecret,
                    expiresIn: accessExpiration,
                },
            );

            const newRefreshToken = this.jwtService.sign(
                { email: user.email, sub: user.id },
                {
                    secret: jwtRefreshSecret,
                    expiresIn: refreshExpiration,
                },
            );

            user.refreshToken = newRefreshToken;
            await this.usersRepository.save(user);

            return { accessToken: newAccessToken, refreshToken: newRefreshToken }
        } catch (error) {
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                throw new BadRequestException('Invalid or expired refresh token');
            }
            throw new BadRequestException('Invalid refresh token');
        }
    }
}