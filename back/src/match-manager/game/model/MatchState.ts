import { Tuple } from './GameRules';

export type MatchState = {
  ball: {
    pos: Tuple;
    dir: Tuple;
    speed: number;
  };
  pl: number;
  pr: number;
};
