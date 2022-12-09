export class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): void {
    const mag = this.magnitude();
    this.x = this.x / mag;
    this.y = this.y / mag;
  }

  mult(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
  }

  static random(): Vector {
    const x = Math.random() - 0.5;
    const y = Math.random() - 0.5;
    const vec = new Vector(x, y);
    vec.normalize();
    return vec;
  }
}
