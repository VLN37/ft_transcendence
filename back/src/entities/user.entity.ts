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
    // unique: true,
    nullable: false,
  })
  login_intra: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  tfa_enabled: boolean;

  @Column({
    type: 'varchar',
    length: 128,
    // unique: true,
    nullable: true,
  })
  tfa_secret: string;

  @OneToOne(() => Profile, { cascade: true })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @ManyToMany(() => User)
  @JoinTable({ name: 'blocked' })
  blocked: User[];

  @ManyToMany(() => User)
  @JoinTable({ name: 'friend_requests' })
  friend_requests: User[];

  @ManyToMany(() => User)
  @JoinTable({ name: 'friendships' })
  friends: User[];
}
