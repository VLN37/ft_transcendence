export class Tuple {
  x: number;
  y: number;
}

export class MatchState {
  ball: {
    pos: Tuple;
    dir: Tuple;
    speed: number;
  };
  pl: number;
  pr: number;
}
