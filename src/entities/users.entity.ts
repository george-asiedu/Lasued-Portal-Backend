import {Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/model/role.enum';
import { CourseRegistration } from './course-registration.entity';
import {Expose} from "class-transformer";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column()
    public name!: string;

    @Column({ type: 'varchar', nullable: true })
    public programme!: string;

    @Column({ type: 'varchar', nullable: true })
    public address!: string;

    @Column({ type: 'varchar', length: 15, nullable: true })
    public phone!: string;

    @Column({ type: 'date', nullable: true })
    public dob!: string;

    @Column({ unique: true })
    public email!: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.Student,
    })
    public role!: UserRole;

    @Column()
    public password!: string;

    @Column({ nullable: true })
    public refreshToken!: string;

    @Column({ type: 'varchar', nullable: true })
    code!: string | null;

    @Column({ default: false })
    isVerified!: boolean;

    @OneToMany(() => CourseRegistration, (registration) => registration.student)
    public courseRegistrations!: CourseRegistration[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt!: Date | null

    @Expose()
    get registered(): boolean {
        return this.courseRegistrations && this.courseRegistrations.length > 0;
    }

    public static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
}