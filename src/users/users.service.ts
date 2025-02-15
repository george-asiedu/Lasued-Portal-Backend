import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async getAllUsers(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async getUserById(id: number): Promise<User | null> {
        return await this.usersRepository.findOneBy({ id });
    }

    async getUserProfile(user: User): Promise<User | null> {
        const foundUser = await this.usersRepository.findOne({
            where: { id: user.id },
            select: ['id', 'name', 'email', 'role', 'isVerified'],
        });
        if (!foundUser) {
            throw new NotFoundException('User not found');
        }
        return foundUser;
    }

    async updateUser(id: number, updateData: Partial<User>): Promise<User> {
        const user = await this.usersRepository.findOneBy({ id });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        Object.assign(user, updateData);
        return await this.usersRepository.save(user);
    }

    async deleteUser(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
