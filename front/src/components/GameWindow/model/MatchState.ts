import { Tuple } from '..';

export type MatchState = {
  ball: {
    pos: Tuple;
    dir: Tuple;
    speed: number;
  };
  p1: number;
  p2: number;
};
