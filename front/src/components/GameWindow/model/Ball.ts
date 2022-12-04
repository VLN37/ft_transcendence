import p5Types from 'p5';

export class Ball {
  public radius: number;
  public position: p5Types.Vector;
  public velocity: p5Types.Vector;

  constructor(radius: number, x?: number, y?: number) {
    this.radius = radius;
    this.position = new p5Types.Vector();
    this.position.x = x || 0;
    this.position.y = y || 0;
    this.velocity = p5Types.Vector.random2D();
    this.velocity.mult(3);
  }

  update() {
    this.position.add(this.velocity);
  }
}
