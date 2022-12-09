import { Vector } from 'src/utils/functions/linearAlgebra';

export class MatchState {
  ball: {
    x: number;
    y: number;
    velocity: Vector;
  };
  p1: number;
  p2: number;
}
