export class Vec2 {
  public x = 0;
  public y = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static add(a: Vec2, b: Vec2) {
    return new Vec2(a.x + b.x, a.y + b.y);
  }

  static sub(a: Vec2, b: Vec2) {
    return new Vec2(a.x - b.x, a.y - b.y);
  }

  // a + b * scale
  static scaleAndAdd(a: Vec2, b: Vec2, scale: number) {
    return new Vec2(a.x + b.x * scale, a.y + b.y * scale);
  }

  static squaredLength(v: Vec2) {
    return v.x * v.x + v.y * v.y;
  }

  static normalize(v: Vec2) {
    const l = Math.hypot(v.x, v.y) || 1;
    return new Vec2(v.x / l, v.y / l);
  }

  toArray(): Float32Array {
    return new Float32Array([this.x, this.y]);
  }
}

export class Vec3 {
  public x = 0;
  public y = 0;
  public z = 0;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static add(a: Vec3, b: Vec3) {
    return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
  }

  static sub(a: Vec3, b: Vec3) {
    return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
  }

  // a + b * scale
  static scaleAndAdd(a: Vec3, b: Vec3, scale: number) {
    return new Vec3(a.x + b.x * scale, a.y + b.y * scale, a.z + b.z * scale);
  }

  static squaredLength(v: Vec3) {
    return v.x * v.x + v.y * v.y + v.z * v.z;
  }

  static cross(a: Vec3, b: Vec3) {
    return new Vec3(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x,
    );
  }

  static normalize(v: Vec3) {
    const l = Math.hypot(v.x, v.y, v.z) || 1;
    return new Vec3(v.x / l, v.y / l, v.z / l);
  }

  toArray(): Float32Array {
    return new Float32Array([this.x, this.y, this.z]);
  }
}

export class Vec4 {
  public x = 0;
  public y = 0;
  public z = 0;
  public w = 0;

  constructor(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  static add(a: Vec4, b: Vec4) {
    return new Vec4(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
  }

  static sub(a: Vec4, b: Vec4) {
    return new Vec4(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
  }

  static scaleAndAdd(a: Vec4, b: Vec4, scale: number) {
    return new Vec4(
      a.x + b.x * scale,
      a.y + b.y * scale,
      a.z + b.z * scale,
      a.w + b.w * scale,
    );
  }

  static squaredLength(v: Vec4) {
    return v.x * v.x + v.y * v.y + v.z * v.z + v.w * v.w;
  }

  static normalize(v: Vec4) {
    const l = Math.hypot(v.x, v.y, v.z, v.w) || 1;
    return new Vec4(v.x / l, v.y / l, v.z / l, v.w / l);
  }

  toArray(): Float32Array {
    return new Float32Array([this.x, this.y, this.z, this.w]);
  }
}
