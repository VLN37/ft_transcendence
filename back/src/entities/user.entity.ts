import { Entity, Column, ManyToMany, JoinTable, PrimaryColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 10,
    unique: true,
    nullable: false,
  })
  login_intra: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  tfa_enabled: boolean;

  @ManyToMany(() => User)
  @JoinTable({ name: 'blocked' })
  blocked: User[];

  @ManyToMany(() => User)
  @JoinTable({ name: 'friends_request' })
  friends_request: User[];

  @ManyToMany(() => User)
  @JoinTable({ name: 'friendships' })
  friends: User[];
}
