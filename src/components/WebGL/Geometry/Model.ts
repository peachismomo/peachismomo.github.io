import type { PBRMaterial } from "../Material/PBRMaterial";
import type { Mat4 } from "../Math/Matrix";
import type { Shader } from "../Shaders/Shader";
import { Mesh, type AttrDesc } from "./Mesh";

export type ModelPart = {
  mesh: Mesh;
  worldMatrix: Mat4;
  material: PBRMaterial;
};

export class Model {
  public readonly parts: ModelPart[];

  constructor(parts: ModelPart[]) {
    this.parts = parts;
  }

  draw(gl: WebGL2RenderingContext, shader: Shader, setWorldMatrix: (m: Mat4) => void) {
    for (const p of this.parts) {
      p.material.bind(gl, shader);
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
    hasTangent: boolean,
  ): { strideBytes: number; layout: AttrDesc[] } {
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
    if (hasTangent) {
      layout.push({ index: 3, size: 4, offset });
      offset += 4 * 4;
    }

    return { strideBytes: offset, layout };
  }

}
