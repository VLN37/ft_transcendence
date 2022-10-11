import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn({
    type: 'int',
    unique: true,
    nullable: false,
  })
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

  @OneToOne(() => Profile, { eager: true })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

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
