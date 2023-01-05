export class Vector {
  public x: number;
  public y: number;

  constructor(x?: number, y?: number) {
    this.x = x || 0;
    this.y = y || 0;
  }

  mult(scalar: number): Vector {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  static mult(vector: Vector, scalar: number): Vector {
    return new Vector(vector.x * scalar, vector.y * scalar);
  }

  sub(other: Vector) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  mag(): number {
    const { x, y } = this;
    return Math.sqrt(x * x + y * y);
  }

  normalize(): Vector {
    const mag = this.mag();
    this.x /= mag;
    this.y /= mag;
    return this;
  }

  heading(): number {
    return Math.atan2(this.y, this.x);
  }

  dot(other: Vector): number {
    return this.x * other.x + this.y * other.y;
  }

  // from p5js
  rotate(angle: number) {
    const newHeading = this.heading() + angle;
    const mag = this.mag();
    this.x = Math.cos(newHeading) * mag;
    this.y = Math.sin(newHeading) * mag;
    return this;
  }

  static random(): Vector {
    const x = Math.random() * 2 - 1;
    const y = Math.random() * 2 - 1;
    return new Vector(x, y).normalize();
  }
}
