import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'matches' })
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'left_player_id' })
  left_player: User;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'right_player_id' })
  right_player: User;

  @Column({
    type: 'int',
    default: 0,
  })
  left_player_score: number;

  @Column({
    type: 'int',
    default: 0,
  })
  right_player_score: number;

  @Column({
    type: 'enum',
    enum: ['AWAITING_PLAYERS', 'PREPARATION', 'ONGOING', 'FINISHED'],
    default: 'AWAITING_PLAYERS',
  })
  stage: string;

  @CreateDateColumn()
  created_at: Date;
}
