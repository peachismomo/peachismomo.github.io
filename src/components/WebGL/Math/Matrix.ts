import { Vec3 } from "./Vectors";

export class Mat4 {
  public data: Float32Array;

  constructor(data?: Float32Array) {
    this.data = data ? new Float32Array(data) : new Float32Array(16);
    if (!data) Mat4.identity(this);
  }

  static identity(out?: Mat4): Mat4 {
    const m = out ? out.data : new Float32Array(16);
    m[0] = 1;
    m[4] = 0;
    m[8] = 0;
    m[12] = 0;
    m[1] = 0;
    m[5] = 1;
    m[9] = 0;
    m[13] = 0;
    m[2] = 0;
    m[6] = 0;
    m[10] = 1;
    m[14] = 0;
    m[3] = 0;
    m[7] = 0;
    m[11] = 0;
    m[15] = 1;
    if (out) return out;
    return new Mat4(m);
  }

  clone(): Mat4 {
    return new Mat4(this.data);
  }

  /** out = a * b (column-major) */
  static multiply(out: Mat4, a: Mat4, b: Mat4): Mat4 {
    const am = a.data;
    const bm = b.data;
    const om = out.data;

    const a00 = am[0],
      a01 = am[1],
      a02 = am[2],
      a03 = am[3];
    const a10 = am[4],
      a11 = am[5],
      a12 = am[6],
      a13 = am[7];
    const a20 = am[8],
      a21 = am[9],
      a22 = am[10],
      a23 = am[11];
    const a30 = am[12],
      a31 = am[13],
      a32 = am[14],
      a33 = am[15];

    const b00 = bm[0],
      b01 = bm[1],
      b02 = bm[2],
      b03 = bm[3];
    const b10 = bm[4],
      b11 = bm[5],
      b12 = bm[6],
      b13 = bm[7];
    const b20 = bm[8],
      b21 = bm[9],
      b22 = bm[10],
      b23 = bm[11];
    const b30 = bm[12],
      b31 = bm[13],
      b32 = bm[14],
      b33 = bm[15];

    om[0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
    om[1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
    om[2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
    om[3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;

    om[4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
    om[5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
    om[6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
    om[7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;

    om[8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
    om[9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
    om[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
    om[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;

    om[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
    om[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
    om[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
    om[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;

    return out;
  }

  static translation(out: Mat4, t: Vec3): Mat4 {
    Mat4.identity(out);
    out.data[12] = t.x;
    out.data[13] = t.y;
    out.data[14] = t.z;
    return out;
  }

  static scale(out: Mat4, s: Vec3): Mat4 {
    Mat4.identity(out);
    out.data[0] = s.x;
    out.data[5] = s.y;
    out.data[10] = s.z;
    return out;
  }

  static rotateX(out: Mat4, radians: number): Mat4 {
    Mat4.identity(out);
    const c = Math.cos(radians);
    const s = Math.sin(radians);
    out.data[5] = c;
    out.data[6] = s;
    out.data[9] = -s;
    out.data[10] = c;
    return out;
  }

  static rotateY(out: Mat4, radians: number): Mat4 {
    Mat4.identity(out);
    const c = Math.cos(radians);
    const s = Math.sin(radians);
    out.data[0] = c;
    out.data[2] = -s;
    out.data[8] = s;
    out.data[10] = c;
    return out;
  }

  static rotateZ(out: Mat4, radians: number): Mat4 {
    Mat4.identity(out);
    const c = Math.cos(radians);
    const s = Math.sin(radians);
    out.data[0] = c;
    out.data[1] = s;
    out.data[4] = -s;
    out.data[5] = c;
    return out;
  }

  /** out = perspective(fovYRadians, aspect, near, far) */
  static perspective(
    out: Mat4,
    fovY: number,
    aspect: number,
    near: number,
    far: number,
  ): Mat4 {
    const f = 1.0 / Math.tan(fovY * 0.5);
    const nf = 1.0 / (near - far);
    const m = out.data;

    m[0] = f / aspect;
    m[4] = 0;
    m[8] = 0;
    m[12] = 0;
    m[1] = 0;
    m[5] = f;
    m[9] = 0;
    m[13] = 0;
    m[2] = 0;
    m[6] = 0;
    m[10] = (far + near) * nf;
    m[14] = 2 * far * near * nf;
    m[3] = 0;
    m[7] = 0;
    m[11] = -1;
    m[15] = 0;

    return out;
  }

  /** out = lookAt(eye, target, up) */
  static lookAt(out: Mat4, eye: Vec3, target: Vec3, up: Vec3): Mat4 {
    const ex = eye.x,
      ey = eye.y,
      ez = eye.z;
    let zx = ex - target.x;
    let zy = ey - target.y;
    let zz = ez - target.z;

    let len = Math.hypot(zx, zy, zz) || 1;
    zx /= len;
    zy /= len;
    zz /= len;

    // x = up x z
    let xx = up.y * zz - up.z * zy;
    let xy = up.z * zx - up.x * zz;
    let xz = up.x * zy - up.y * zx;

    len = Math.hypot(xx, xy, xz) || 1;
    xx /= len;
    xy /= len;
    xz /= len;

    // y = z x x
    const yx = zy * xz - zz * xy;
    const yy = zz * xx - zx * xz;
    const yz = zx * xy - zy * xx;

    const m = out.data;
    m[0] = xx;
    m[4] = yx;
    m[8] = zx;
    m[12] = 0;
    m[1] = xy;
    m[5] = yy;
    m[9] = zy;
    m[13] = 0;
    m[2] = xz;
    m[6] = yz;
    m[10] = zz;
    m[14] = 0;
    m[3] = 0;
    m[7] = 0;
    m[11] = 0;
    m[15] = 1;

    // translation
    m[12] = -(xx * ex + xy * ey + xz * ez);
    m[13] = -(yx * ex + yy * ey + yz * ez);
    m[14] = -(zx * ex + zy * ey + zz * ez);

    return out;
  }

  /** out = inverse(a). returns false if non-invertible. */
  static invert(out: Mat4, a: Mat4): boolean {
    const m = a.data;
    const o = out.data;

    const a00 = m[0],
      a01 = m[1],
      a02 = m[2],
      a03 = m[3];
    const a10 = m[4],
      a11 = m[5],
      a12 = m[6],
      a13 = m[7];
    const a20 = m[8],
      a21 = m[9],
      a22 = m[10],
      a23 = m[11];
    const a30 = m[12],
      a31 = m[13],
      a32 = m[14],
      a33 = m[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    let det =
      b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) return false;
    det = 1.0 / det;

    o[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    o[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * det;
    o[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    o[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * det;

    o[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * det;
    o[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    o[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * det;
    o[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;

    o[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    o[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * det;
    o[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    o[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * det;

    o[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * det;
    o[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    o[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * det;
    o[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return true;
  }

  toArray(): Float32Array {
    return this.data;
  }
}
