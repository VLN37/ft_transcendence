import { Ball } from '../../game/model/Ball';
import { Paddle } from '../../game/model/Paddle';

export type PowerUpName = 'grow-player-size' | 'slow-enemy';

export interface PowerUp {
  name: PowerUpName;
  canActivate: boolean;
  x?: number;
  y?: number;
  duration: number;
  activate: (ball: Ball, lastTouch: Paddle) => void;
}
