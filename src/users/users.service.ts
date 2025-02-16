import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import {plainToInstance} from "class-transformer";

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
            select: ['id', 'name', 'email', 'role', 'isVerified'],
        });
        if (!foundUser) {
            throw new NotFoundException('User not found');
        }
        return plainToInstance(User, foundUser, { excludeExtraneousValues: true });
    }

    async deleteUser(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
