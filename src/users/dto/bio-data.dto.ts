import { IsOptional, IsString, Length, IsDateString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class UpdateBioDataDto {
    @ApiProperty({
        example: 'Software Engineering',
        required: true
    })
    @IsOptional()
    @IsString()
    programme!: string;

    @ApiProperty({
        example: '2 Pine Street',
        required: true
    })
    @IsOptional()
    @IsString()
    address!: string;

    @ApiProperty({
        example: '0235678569',
        required: true
    })
    @IsOptional()
    @IsString()
    @Length(10, 15)
    phone!: string;

    @ApiProperty({
        example: '25-10-2000',
        required: true
    })
    @IsOptional()
    @IsDateString()
    dob!: string;
}