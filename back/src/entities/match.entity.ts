import { MatchType } from 'src/match-making/dto/AppendToQueueDTO';
import { MatchStage, MATCH_STAGES } from 'src/match-manager/model/MemoryMatch';
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
    enum: MATCH_STAGES,
    default: 'AWAITING_PLAYERS',
  })
  stage: MatchStage;

  @Column({
    type: 'enum',
    enum: ['CLASSIC', 'TURBO'],
    nullable: false,
  })
  type: MatchType;

  @CreateDateColumn()
  created_at: Date;
}
