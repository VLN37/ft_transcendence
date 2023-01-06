import { PlayerState } from '../game/model/Player';

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
  };
  pr: {
    y: number;
    state: PlayerState;
  };
}
