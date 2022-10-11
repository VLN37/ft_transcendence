import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  PrimaryColumn,
  OneToOne,
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

  @OneToOne(() => Profile, (profile) => profile.user)
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
