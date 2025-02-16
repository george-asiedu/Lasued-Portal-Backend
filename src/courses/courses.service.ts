import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Courses } from 'src/entities/courses.entity';
import { Repository } from 'typeorm';
import { CoursesDto } from './dto/courses.dto';


@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Courses)
        private readonly coursesRepository: Repository<Courses>,
    ) {}

    async createCourse(courseDto: CoursesDto): Promise<Courses> {
        const newCourse = this.coursesRepository.create(courseDto);
        return await this.coursesRepository.save(newCourse);
    }

    async getAllCourses(): Promise<Courses[]> {
        return await this.coursesRepository.find();
    }

    async getCourseById(id: string): Promise<Courses> {
        const course = await this.coursesRepository.findOne({ where: { id } });
        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }
        return course;
    }

    async updateCourse(id: string, updateData: Partial<CoursesDto>): Promise<Courses> {
        const course = await this.getCourseById(id); // Ensure course exists

        Object.assign(course, updateData); // Update the course fields
        return await this.coursesRepository.save(course);
    }

    async deleteCourse(id: string): Promise<void> {
        const deleteResult = await this.coursesRepository.delete(id);
        if (!deleteResult.affected) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }
    }

    async registerCourseForSemester(courseId: string, semester: string): Promise<Courses> {
        const course = await this.getCourseById(courseId);
        (course as any).semester = semester;
        return await this.coursesRepository.save(course);
    }
}