import { Tuple } from './GameRules';

export type MatchState = {
  ball: {
    pos: Tuple;
    vel: Tuple;
  };
  pl: number;
  pr: number;
};
