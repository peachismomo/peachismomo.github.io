import { Vec3 } from "../Math/Vectors";
import { Mat4 } from "../Math/Matrix";

export interface CameraInput {
  yawDelta?: number; // radians
  pitchDelta?: number; // radians
  moveForward?: number; // + forward, - backward
  moveRight?: number; // + right, - left
  moveUp?: number; // + up, - down
}

export class Camera {
  public fovY = (60 * Math.PI) / 180;
  public near = 0.01;
  public far = 1000.0;

  public position = new Vec3(0, 0.3, 2.2);

  public yaw = 0;
  public pitch = 0;
  public pitchLimit = (89 * Math.PI) / 180;

  public moveSpeed = 2.5;
  public lookSpeed = 1.0;

  private forward = new Vec3(0, 0, -1);
  private right = new Vec3(1, 0, 0);
  private up = new Vec3(0, 1, 0);

  private view = Mat4.identity();
  private proj = Mat4.identity();
  private viewProj = Mat4.identity();

  private aspect = 1;

  constructor(width: number, height: number) {
    this.resize(width, height);
    this.recomputeMatrices();
  }

  resize(width: number, height: number) {
    this.aspect = Math.max(1e-6, width / Math.max(1, height));
    Mat4.perspective(this.proj, this.fovY, this.aspect, this.near, this.far);
    Mat4.multiply(this.viewProj, this.proj, this.view);
  }

  update(dt: number, input?: CameraInput) {
    if (input) {
      if (input.yawDelta) this.yaw += input.yawDelta;
      if (input.pitchDelta) this.pitch += input.pitchDelta;

      this.pitch = Math.max(
        -this.pitchLimit,
        Math.min(this.pitchLimit, this.pitch),
      );
    }

    this.computeBasis();

    if (input) {
      let v = new Vec3(0, 0, 0);

      const f = input.moveForward ?? 0;
      const r = input.moveRight ?? 0;
      const u = input.moveUp ?? 0;

      if (f !== 0) v = Vec3.scaleAndAdd(v, this.forward, f);
      if (r !== 0) v = Vec3.scaleAndAdd(v, this.right, r);
      if (u !== 0) v = Vec3.scaleAndAdd(v, this.up, u);

      if (Vec3.squaredLength(v) > 0) {
        v = Vec3.normalize(v);
        this.position = Vec3.scaleAndAdd(this.position, v, this.moveSpeed * dt);
      }
    }

    this.recomputeMatrices();
  }

  lookAt(target: Vec3) {
    let dir = Vec3.sub(target, this.position);
    dir = Vec3.normalize(dir);

    this.yaw = Math.atan2(dir.x, dir.z);
    this.pitch = Math.asin(dir.y);

    this.pitch = Math.max(
      -this.pitchLimit,
      Math.min(this.pitchLimit, this.pitch),
    );
    this.recomputeMatrices();
  }

  getView(): Mat4 {
    return this.view;
  }
  getProj(): Mat4 {
    return this.proj;
  }
  getViewProj(): Mat4 {
    return this.viewProj;
  }

  getForward(): Vec3 {
    return this.forward;
  }
  getRight(): Vec3 {
    return this.right;
  }
  getUp(): Vec3 {
    return this.up;
  }

  private computeBasis() {
    const cy = Math.cos(this.yaw);
    const sy = Math.sin(this.yaw);
    const cp = Math.cos(this.pitch);
    const sp = Math.sin(this.pitch);

    this.forward.x = sy * cp;
    this.forward.y = sp;
    this.forward.z = cy * cp;

    this.forward = Vec3.normalize(this.forward);

    this.right = Vec3.cross(this.forward, this.up);
    this.right = Vec3.normalize(this.right);
  }

  private recomputeMatrices() {
    this.computeBasis();

    const target = Vec3.add(this.position, this.forward);

    Mat4.lookAt(this.view, this.position, target, this.up);
    Mat4.multiply(this.viewProj, this.proj, this.view);
  }
}
