import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'direct_messages' })
export class DirectMessages {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender: Partial<User>;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiver_id' })
  receiver: Partial<User>;

  @Column({
    type: 'text',
  })
  message: string;
}
