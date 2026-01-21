import { Mesh, type AttrDesc } from "./Mesh";

export type Mat4 = Float32Array; // column-major 4x4

export interface ModelPart {
  mesh: Mesh;
  worldMatrix: Mat4;
}

export class Model {
  public readonly parts: ModelPart[];

  constructor(parts: ModelPart[]) {
    this.parts = parts;
  }

  draw(gl: WebGL2RenderingContext, setWorldMatrix: (m: Mat4) => void) {
    for (const p of this.parts) {
      setWorldMatrix(p.worldMatrix);
      p.mesh.draw(gl);
    }
  }

  dispose(gl: WebGL2RenderingContext) {
    for (const p of this.parts) p.mesh.dispose(gl);
  }

  static defaultLayout(
    hasNormal: boolean,
    hasUv: boolean,
  ): { strideBytes: number; layout: AttrDesc[] } {
    // locations: 0=pos, 1=normal, 2=uv
    let offset = 0;
    const layout: AttrDesc[] = [{ index: 0, size: 3, offset }];
    offset += 3 * 4;

    if (hasNormal) {
      layout.push({ index: 1, size: 3, offset });
      offset += 3 * 4;
    }
    if (hasUv) {
      layout.push({ index: 2, size: 2, offset });
      offset += 2 * 4;
    }
    return { strideBytes: offset, layout };
  }
}
