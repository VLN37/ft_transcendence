import { PlayerState, Tuple } from './GameRules';

export type MatchState = {
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
};
