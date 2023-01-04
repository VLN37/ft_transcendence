export class Tuple {
  x: number;
  y: number;
}

export class MatchState {
  ball: {
    pos: Tuple;
    vel: Tuple;
  };
  pl: number;
  pr: number;
}
