import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Channel } from './channel.entity';
import { User } from './user.entity';

@Entity({ name: 'channel_messages' })
export class ChannelMessages {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: Partial<User>;

  @ManyToOne(() => Channel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channel_id' })
  channel: Partial<Channel>;

  @Column({
    type: 'text',
  })
  message: string;
}
