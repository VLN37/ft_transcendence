import { Entity, Column, PrimaryColumn } from 'typeorm';

export type UserStatus = 'OFFLINE' | 'ONLINE' | 'PLAYING' | 'SEARCHING';

@Entity({ name: 'profiles' })
export class Profile {
  @PrimaryColumn({
    type: 'int',
    unique: true,
    nullable: false,
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  nickname: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  avatar_path: string;

  @Column({
    type: 'enum',
    enum: ['OFFLINE', 'ONLINE', 'PLAYING'],
    default: 'OFFLINE',
  })
  status: UserStatus;

  @Column({
    default: 0,
  })
  wins: number;

  @Column({
    default: 0,
  })
  losses: number;

  @Column({
    default: 1000,
  })
  mmr: number;
}
