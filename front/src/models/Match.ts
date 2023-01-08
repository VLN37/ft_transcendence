import { User } from './User';

export interface Match {
  id: string;
  left_player: User;
  right_player: User;
  left_player_score: number;
  right_player_score: number;
  stage: string;
  created_at: Date;
  type: 'CLASSIC' | 'TURBO';
}
