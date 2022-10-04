import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 10,
    // unique: true,
    nullable: false,
  })
  login_intra: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  tfa_enabled: boolean;

  @ManyToMany(() => User)
  @JoinTable()
  // users_friends_users
  friends: User[];
}
