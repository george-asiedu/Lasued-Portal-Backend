import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import {plainToInstance} from "class-transformer";
import { UpdateBioDataDto } from './dto/bio-data.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async getAllUsers(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async getUserById(id: string): Promise<User | null> {
        return await this.usersRepository.findOneBy({ id });
    }

    async getUserProfile(user: User): Promise<User | null> {
        const foundUser = await this.usersRepository.findOne({
            where: { id: user.id },
            relations: ['courseRegistrations'],
            select: ['id', 'name', 'email', 'role', 'isVerified', 'programme', 'dob', 'address', 'phone'],
        });
        if (!foundUser) {
            throw new NotFoundException('User not found');
        }
        return plainToInstance(User, foundUser, { excludeExtraneousValues: true });
    }

    async updateBioData(id: string, updateBioDataDto: UpdateBioDataDto): Promise<User> {
        const user = await this.usersRepository.findOneBy({ id });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.programme = updateBioDataDto.programme ?? user.programme;
        user.address = updateBioDataDto.address ?? user.address;
        user.phone = updateBioDataDto.phone ?? user.phone;
        user.dob = updateBioDataDto.dob ?? user.dob;

        await this.usersRepository.save(user);
        return user;
    }

    async deleteUser(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
