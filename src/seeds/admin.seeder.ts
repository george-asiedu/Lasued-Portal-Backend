import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { UserRole } from 'src/model/role.enum';
import { Repository } from 'typeorm';

@Injectable()
export class AdminSeeder {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async seedAdmin(): Promise<void> {
        const existingUser = await this.userRepository.findOneBy({ email: 'admin@test.com' });

        if (!existingUser) {
            const hashedPassword = await User.hashPassword('Admin@123');
            const adminUser = this.userRepository.create({
                name: 'Admin',
                email: 'admin@test.com',
                password: hashedPassword,
                role: UserRole.Admin,
                isVerified: true,
            });

            await this.userRepository.save(adminUser);
            console.log('✅ Admin user seeded successfully.');
        } else {
            console.log('⚠️ Admin user already exists.');
        }
    }
}
