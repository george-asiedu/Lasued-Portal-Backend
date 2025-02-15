import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { AdminSeeder } from "./admin.seeder";

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const adminSeeder = app.get(AdminSeeder);

    await adminSeeder.seedAdmin();
    await app.close();
}

bootstrap().catch((err) => {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
});