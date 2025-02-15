import { ApiProperty } from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @ApiProperty({
        example: 'John Doe',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        example: 'johndoe@test.com',
        required: true
    })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({
        example: 'strongPass123',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password!: string;
}