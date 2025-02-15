import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "../entities/users.entity";
import {AdminSeeder} from "./admin.seeder";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [AdminSeeder],
    exports: [AdminSeeder],
})
export class SeedsModule {}
