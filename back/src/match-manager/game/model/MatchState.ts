import { Tuple } from '../rules';

export type MatchState = {
  ball: {
    pos: Tuple;
    dir: Tuple;
    speed: number;
  };
  pl: number;
  pr: number;
};
