import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh } from "./Mesh";
import { Model, type Mat4, type ModelPart } from "./Model";

function interleavePosNorUv(
  pos: Float32Array,
  nor?: Float32Array,
  uv?: Float32Array,
): { vertices: Float32Array; hasNormal: boolean; hasUv: boolean } {
  const hasNormal = !!nor;
  const hasUv = !!uv;

  const vertCount = (pos.length / 3) | 0;
  const floatsPerVert = 3 + (hasNormal ? 3 : 0) + (hasUv ? 2 : 0);
  const out = new Float32Array(vertCount * floatsPerVert);

  let o = 0;
  for (let i = 0; i < vertCount; i++) {
    const pi = i * 3;
    out[o++] = pos[pi + 0];
    out[o++] = pos[pi + 1];
    out[o++] = pos[pi + 2];

    if (hasNormal) {
      const ni = i * 3;
      out[o++] = nor[ni + 0];
      out[o++] = nor[ni + 1];
      out[o++] = nor[ni + 2];
    }

    if (hasUv) {
      const ui = i * 2;
      out[o++] = uv[ui + 0];
      out[o++] = uv[ui + 1];
    }
  }

  return { vertices: out, hasNormal, hasUv };
}

function threeMatrixToMat4(m: THREE.Matrix4): Mat4 {
  return new Float32Array(m.elements);
}

export async function loadGLTFModel(
  gl: WebGL2RenderingContext,
  url: string,
): Promise<Model> {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(url);

  gltf.scene.updateMatrixWorld(true);

  const parts: ModelPart[] = [];

  gltf.scene.traverse((obj) => {
    const meshObj = obj as THREE.Mesh;
    if (!meshObj.isMesh) return;

    const geo = meshObj.geometry as THREE.BufferGeometry;

    const posAttr = geo.getAttribute("position");
    if (!posAttr) return;

    const pos = posAttr.array as Float32Array;
    const nor = geo.getAttribute("normal")?.array as Float32Array | undefined;
    const uv = geo.getAttribute("uv")?.array as Float32Array | undefined;

    const { vertices, hasNormal, hasUv } = interleavePosNorUv(pos, nor, uv);
    const { strideBytes, layout } = Model.defaultLayout(hasNormal, hasUv);

    const idx = geo.getIndex()?.array as Uint16Array | Uint32Array | undefined;

    const gpuMesh = idx
      ? Mesh.fromIndexed(gl, vertices, strideBytes, layout, idx)
      : Mesh.fromVertices(gl, vertices, strideBytes, layout);

    const worldMatrix = threeMatrixToMat4(meshObj.matrixWorld);

    parts.push({ mesh: gpuMesh, worldMatrix });
  });

  if (parts.length === 0) throw new Error(`No meshes found in glTF: ${url}`);
  return new Model(parts);
}
