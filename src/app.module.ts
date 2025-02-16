import { Module, ValidationPipe, OnModuleInit  } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { pgConfig } from './config/dbConfig';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SeedsModule } from './seeds/seeds.module';
import {AdminSeeder} from "./seeds/admin.seeder";
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => pgConfig(configService)
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"Verify your account" <${configService.get<string>('MAIL_USER')}>`,
        },
      }),
    }),
    AuthModule,
    UsersModule,
    SeedsModule,
    CoursesModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    AppService
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly adminSeeder: AdminSeeder) {}

  async onModuleInit() {
    await this.adminSeeder.seedAdmin();
  }
}
