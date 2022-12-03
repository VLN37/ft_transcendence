import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from './channel.entity';

@Entity({ name: 'banned_users' })
export class BannedUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  user_id: number;

  @ManyToOne(() => Channel)
  @JoinColumn({ name: 'channel_id' })
  channel: Partial<Channel>;

  @Column({
    type: 'timestamptz',
  })
  expiration: Date;
}
