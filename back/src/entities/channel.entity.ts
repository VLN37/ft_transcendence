import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BannedUsers } from './channel.banned.entity';
import { ChannelMessages } from './channel_messages.entity';
import { ChannelType, CHANNEL_TYPES } from './types/channelTypes';
import { User } from './user.entity';

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
    enum: CHANNEL_TYPES,
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

  @OneToMany(() => BannedUsers, (element) => element.channel)
  banned_users: BannedUsers[];

  @OneToMany(() => ChannelMessages, (message) => message.channel)
  channel_messages: ChannelMessages[];
}
