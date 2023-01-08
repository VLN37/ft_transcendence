import { PlayerState } from '../game/model/Paddle';

export class Tuple {
  x: number;
  y: number;
}

export class MatchState {
  ball: {
    pos: Tuple;
    vel: Tuple;
  };
  pl: {
    y: number;
    state: PlayerState;
    score: number;
  };
  pr: {
    y: number;
    state: PlayerState;
    score: number;
  };
}
