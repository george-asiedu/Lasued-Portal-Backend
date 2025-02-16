import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Courses } from 'src/entities/courses.entity';
import { Repository } from 'typeorm';
import { CoursesDto } from './dto/courses.dto';
import {CourseRegistration} from "../entities/course-registration.entity";
import {User} from "../entities/users.entity";

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Courses)
        private readonly coursesRepository: Repository<Courses>,
        @InjectRepository(CourseRegistration)
        private readonly registrationRepository: Repository<CourseRegistration>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
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
        const course = await this.getCourseById(id);

        Object.assign(course, updateData);
        return await this.coursesRepository.save(course);
    }

    async registerCourse(userId: string, courseId: string): Promise<CourseRegistration> {
        const student = await this.userRepository.findOne(
            { where: { id: userId }, relations: ['courseRegistrations'] }
        );
        if (!student) {
            throw new NotFoundException(`Student with ID ${userId} not found`);
        }

        const course = await this.coursesRepository.findOne({ where: { id: courseId } });
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }

        const existingRegistration = await this.registrationRepository.findOne({
            where: { student, course },
        });
        if (existingRegistration) {
            throw new BadRequestException(`You are already registered for this course.`);
        }

        const registration = this.registrationRepository.create({ student, course });
        return await this.registrationRepository.save(registration);
    }

    async deleteCourse(id: string): Promise<void> {
        const deleteResult = await this.coursesRepository.delete(id);
        if (!deleteResult.affected) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }
    }
}