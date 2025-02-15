import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/model/role.enum';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public name!: string;

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

    public static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
}