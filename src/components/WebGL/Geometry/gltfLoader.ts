import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh } from "./Mesh";
import { Texture2D } from "../Material/Texture";
import { PBRMaterial } from "../Material/PBRMaterial";
import { Mat4 } from "../Math/Matrix";
import { Model, type ModelPart } from "./Model";

function getThreeTexImage(tex: THREE.Texture | null | undefined): TexImageSource | null {
  if (!tex) return null;
  const img = tex.image as any;
  if (!img) return null;
  return img as TexImageSource;
}

function interleavePosNorUvTan(
  pos: Float32Array,
  nor?: Float32Array,
  uv?: Float32Array,
  tan?: Float32Array, // vec4 per vertex
): {
  vertices: Float32Array;
  hasNormal: boolean;
  hasUv: boolean;
  hasTangent: boolean;
} {
  const hasNormal = !!nor;
  const hasUv = !!uv;
  const hasTangent = !!tan;

  const vertCount = (pos.length / 3) | 0;

  // glTF tangents are vec4 (x,y,z,w)
  const floatsPerVert =
    3 +
    (hasNormal ? 3 : 0) +
    (hasUv ? 2 : 0) +
    (hasTangent ? 4 : 0);

  const out = new Float32Array(vertCount * floatsPerVert);

  let o = 0;
  for (let i = 0; i < vertCount; i++) {
    const pi = i * 3;
    out[o++] = pos[pi + 0];
    out[o++] = pos[pi + 1];
    out[o++] = pos[pi + 2];

    if (hasNormal) {
      const ni = i * 3;
      out[o++] = nor![ni + 0];
      out[o++] = nor![ni + 1];
      out[o++] = nor![ni + 2];
    }

    if (hasUv) {
      const ui = i * 2;
      out[o++] = uv![ui + 0];
      out[o++] = uv![ui + 1];
    }

    if (hasTangent) {
      const ti = i * 4;
      out[o++] = tan![ti + 0];
      out[o++] = tan![ti + 1];
      out[o++] = tan![ti + 2];
      out[o++] = tan![ti + 3]; // handedness
    }
  }

  return { vertices: out, hasNormal, hasUv, hasTangent };
}

function threeMatrixToMat4(m: THREE.Matrix4): Mat4 {
  return new Mat4(new Float32Array(m.elements));
}

export async function loadGLTFModel(
  gl: WebGL2RenderingContext,
  url: string,
): Promise<Model> {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(url);

  gltf.scene.updateMatrixWorld(true);

  const parts: ModelPart[] = [];

  // Cache Three.Texture -> Texture2D
  const texCache = new Map<THREE.Texture, Texture2D>();

  const getOrCreate = (t: THREE.Texture | null | undefined, opts?: { flipY?: boolean }) => {
    if (!t) return undefined;
    const existing = texCache.get(t);
    if (existing) return existing;

    const img = getThreeTexImage(t);
    if (!img) return undefined;

    // glTF usually wants flipY = false
    const gpu = Texture2D.fromImage(gl, img, { flipY: opts?.flipY ?? false, genMips: true });
    texCache.set(t, gpu);
    return gpu;
  };

  gltf.scene.traverse((obj) => {
    const meshObj = obj as THREE.Mesh;
    if (!meshObj.isMesh) return;

    const geo = meshObj.geometry as THREE.BufferGeometry;
    const posAttr = geo.getAttribute("position");
    if (!posAttr) return;

    const pos = posAttr.array as Float32Array;
    const nor = geo.getAttribute("normal")?.array as Float32Array | undefined;
    const uv = geo.getAttribute("uv")?.array as Float32Array | undefined;
    const tan = geo.getAttribute("tangent")?.array as Float32Array | undefined;

    const { vertices, hasNormal, hasUv, hasTangent } =
      interleavePosNorUvTan(pos, nor, uv, tan);

    const { strideBytes, layout } = Model.defaultLayout(hasNormal, hasUv, hasTangent);

    const idx = geo.getIndex()?.array as Uint16Array | Uint32Array | undefined;

    const gpuMesh = idx
      ? Mesh.fromIndexed(gl, vertices, strideBytes, layout, idx)
      : Mesh.fromVertices(gl, vertices, strideBytes, layout);

    const worldMatrix = threeMatrixToMat4(meshObj.matrixWorld); const matAny = meshObj.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[];
    const m = Array.isArray(matAny) ? matAny[0] : matAny;

    const material = new PBRMaterial({
      baseColorTex: getOrCreate(m.map),
      normalTex: getOrCreate(m.normalMap),
      metallicRoughnessTex: getOrCreate(m.roughnessMap ?? m.metalnessMap),
      occlusionTex: getOrCreate((m as any).aoMap),
      emissiveTex: getOrCreate(m.emissiveMap),

      baseColorFactor: [m.color.r, m.color.g, m.color.b, m.opacity ?? 1],
      metallicFactor: m.metalness ?? 1,
      roughnessFactor: m.roughness ?? 1,
      emissiveFactor: [m.emissive.r, m.emissive.g, m.emissive.b],

      normalScale: (m as any).normalScale?.x ?? 1,
      occlusionStrength: 1,

      alphaMode: m.transparent ? "BLEND" : m.alphaTest > 0 ? "MASK" : "OPAQUE",
      alphaCutoff: m.alphaTest ?? 0.5,
    });

    parts.push({ mesh: gpuMesh, worldMatrix, material });
  });

  if (parts.length === 0) throw new Error(`No meshes found in glTF: ${url}`);
  return new Model(parts);
}
