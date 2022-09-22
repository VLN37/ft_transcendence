import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	nickName: string;

	@Column()
	firstName: string;

	@Column()
	lastName: string;
 }
