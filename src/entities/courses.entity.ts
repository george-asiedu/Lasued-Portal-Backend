import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Courses {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column({ type: 'varchar', length: 255 })
    public course_name!: string;

    @Column({ type: 'varchar', length: 15, unique: true })
    public course_code!: string;

    @Column({ type: 'integer' })
    public credit_units!: number;
}