import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { Channel } from './channel.entity';
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
    length: 20,
    unique: true,
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
  blocked: Partial<User>[];

  @ManyToMany(() => User)
  @JoinTable({ name: 'friend_requests' })
  friend_requests: Partial<User>[];

  @ManyToMany(() => User)
  @JoinTable({ name: 'friendships' })
  friends: Partial<User>[];

  @ManyToMany(() => Channel)
  @JoinTable({ name: 'channel_members' })
  channels: Partial<Channel>[];
}
