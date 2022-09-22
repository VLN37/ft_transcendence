import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	nickname: string;

	@Column()
	first_name: string;

	@Column()
	last_name: string;
 }
