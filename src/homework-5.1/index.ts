abstract class GeometricShapes {
  constructor(
    private _name: string,
    private _color: string
  ) {}

  public get name(): string {
    return this._name;
  }
  public get color(): string {
    return this._color;
  }
  abstract calculateArea(): number;
}

interface IPrint {
  print(): void;
}

class Circle extends GeometricShapes {
  constructor(
    name: string,
    color: string,
    private radius: number
  ) {
    super(name, color);
  }
  calculateArea(): number {
    return Math.round(Math.PI * this.radius * this.radius);
  }
}

class Rectangle extends GeometricShapes implements IPrint {
  constructor(
    name: string,
    color: string,
    private width: number,
    private height: number
  ) {
    super(name, color);
  }
  calculateArea(): number {
    return 2 * this.width * this.height;
  }
  print(): void {
    console.log(`Area of a rectangle = length × width = ${this.width * this.height}`);
  }
}

class Square extends GeometricShapes implements IPrint {
  constructor(
    name: string,
    color: string,
    private width: number
  ) {
    super(name, color);
  }
  calculateArea(): number {
    return this.width * this.width;
  }
  print() {
    console.log(`Area of a square = Side × Side =  ${this.width * this.width}`);
  }
}

class Triangle extends GeometricShapes {
  constructor(
    name: string,
    color: string,
    private base: number,
    private height: number
  ) {
    super(name, color);
  }
  calculateArea(): number {
    return 0.5 * this.base * this.height;
  }
}
