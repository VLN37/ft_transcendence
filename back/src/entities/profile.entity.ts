import { Entity, Column, PrimaryColumn } from 'typeorm';

export type UserStatus = 'OFFLINE' | 'ONLINE' | 'PLAYING';

@Entity({ name: 'profile' })
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
    unique: true,
    type: 'varchar',
    length: 50,
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
    default: 0,
  })
  mmr: number;
}
