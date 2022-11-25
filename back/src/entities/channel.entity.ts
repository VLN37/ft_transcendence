import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChannelMessages } from './channel_messages.entity';
import { User } from './user.entity';

export type ChannelType = 'PUBLIC' | 'PRIVATE' | 'PROTECTED';

@Entity({ name: 'channels' })
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  owner_id: number;

  @Column({
    type: 'enum',
    enum: ['PUBLIC', 'PRIVATE', 'PROTECTED'],
    default: 'PUBLIC',
  })
  type: ChannelType;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  password: string;

  @ManyToMany(() => User)
  @JoinTable({ name: 'allowed_users' })
  allowed_users: Partial<User>[];

  @ManyToMany(() => User)
  @JoinTable({ name: 'channel_members' })
  users: Partial<User>[];

  @ManyToMany(() => User)
  @JoinTable({ name: 'channel_admins' })
  admins: Partial<User>[];

  @OneToMany(() => ChannelMessages, (message) => message.channel)
  channel_messages: ChannelMessages[];
}
