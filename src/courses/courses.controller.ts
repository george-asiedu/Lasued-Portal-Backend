import {Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post} from '@nestjs/common';
import {BaseController} from "../utils/baseController";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import { CoursesService } from './courses.service';
import {Roles} from "../guards/roles/roles.decorator";
import {UserRole} from "../model/role.enum";
import {
    CoursesResponseExample,
    GetAllCursesResponseExample,
} from "../utils/response.model";
import {CoursesDto} from "./dto/courses.dto";
import {Courses} from "../entities/courses.entity";

@ApiTags('Courses')
@ApiBearerAuth()
@Controller('courses')
export class CoursesController extends BaseController {
    constructor(private coursesService: CoursesService) {
        super();
    }

    @Post('add-course')
    @ApiOperation({ summary: 'Creates a new course.' })
    @ApiResponse({
        status: 200,
        description: 'Success',
        example: CoursesResponseExample
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request.',
        example: { message: 'Course ID not valid' }
    })
    async addCourse(@Body() coursesDto: CoursesDto){
        return await this.coursesService.createCourse(coursesDto);
    }

    @Get('all-courses')
    @Roles(UserRole.Admin)
    @ApiOperation({ summary: 'Displays all courses in the system.' })
    @ApiResponse({
        status: 200,
        description: 'Success',
        example: GetAllCursesResponseExample
    })
    async getAllUsers() {
        return await this.coursesService.getAllCourses();
    }

    @Get(':id')
    @Roles(UserRole.Admin)
    @ApiOperation({ summary: 'Retrieves a course by id.' })
    @ApiResponse({
        status: 200,
        description: 'Success',
        example: CoursesResponseExample
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request.',
        example: { message: 'Invalid course ID format.' }
    })
    async getCourseById(@Param('id', ParseUUIDPipe) id: string) {
        return await this.coursesService.getCourseById(id);
    }

    @Patch('update-course')
    @ApiOperation({ summary: 'Updates the courses data info' })
    @ApiResponse({
        status: 200,
        description: 'Success',
        example: CoursesResponseExample
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request.',
        example: { message: 'Course ID not valid' }
    })
    async updateCourse(@Param('id') id: string, @Body() updateData: Partial<Courses>) {
        return await this.coursesService.updateCourse(id, updateData);
    }

    @Delete(':id')
    @Roles(UserRole.Admin)
    @ApiOperation({ summary: 'Deletes a course by ID' })
    @ApiResponse({ status: 200, description: 'Success' })
    @ApiResponse({ status: 400, description: 'Bad Request', example: { message: 'Invalid course ID format.' } })
    async deleteCourse(@Param('id') id: string) {
        return this.coursesService.deleteCourse(id);
    }
}