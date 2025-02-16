import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Courses } from 'src/entities/courses.entity';
import { User } from './users.entity';

@Entity()
export class CourseRegistration {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @ManyToOne(() => User, (user) => user.courseRegistrations, { onDelete: 'CASCADE' })
    public student!: User;

    @ManyToOne(() => Courses, (course) => course.courseRegistrations, { onDelete: 'CASCADE' })
    public course!: Courses;

    @CreateDateColumn()
    public registeredAt!: Date;
}
