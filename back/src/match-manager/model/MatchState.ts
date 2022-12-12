import { Vector } from 'src/utils/classes/Vector';

export class MatchState {
  ball: {
    pos: {
      x: number;
      y: number;
    };
    dir: Vector;
    speed: number;
  };
  p1: number;
  p2: number;
}
