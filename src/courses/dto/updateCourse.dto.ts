import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CoursesDto } from './courses.dto';

export class UpdateCourseDto extends PartialType(CoursesDto) {
    @ApiProperty({ example: 'Advanced Cloud Computing', required: false })
    public course_name?: string;

    @ApiProperty({ example: 'BSC302', required: false })
    public course_code?: string;

    @ApiProperty({ example: 4, required: false })
    public credit_units?: number;
}