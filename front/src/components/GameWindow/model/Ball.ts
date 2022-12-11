import p5Types from 'p5';
import { Tuple } from '..';

export class Ball {
  public radius: number;
  public position: p5Types.Vector;
  public velocity: p5Types.Vector;

  constructor(radius: number, startingPosition: Tuple) {
    this.radius = radius;
    this.position = new p5Types.Vector();
    this.position.x = startingPosition.x;
    this.position.y = startingPosition.y;
    this.velocity = new p5Types.Vector();
  }

  update() {
    this.position.add(this.velocity);
  }
}
