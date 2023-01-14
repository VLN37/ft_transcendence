import { Ball } from '../../game/model/Ball';
import { Paddle } from '../../game/model/Paddle';

export interface PowerUp {
  x?: number;
  y?: number;
  duration: number;
  activate: (ball: Ball, lastTouch: Paddle) => void;
}
