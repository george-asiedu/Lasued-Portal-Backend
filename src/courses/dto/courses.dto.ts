import { ApiProperty } from '@nestjs/swagger';
import {IsInt, IsNotEmpty, IsString} from 'class-validator';

export class CoursesDto {
    @ApiProperty({example: 'Cloud Computing', required: true})
    @IsString()
    @IsNotEmpty()
    public course_name!: string;

    @ApiProperty({example: 'BSC301', required: true})
    @IsString()
    @IsNotEmpty()
    public course_code!: string;

    @ApiProperty({example: 3, required: true})
    @IsInt()
    @IsNotEmpty()
    public credit_units!: number;
}