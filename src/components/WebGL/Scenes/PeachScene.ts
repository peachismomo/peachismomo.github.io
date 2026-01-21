import { loadGLTFModel } from "../Geometry/gltfLoader";
import type { Model } from "../Geometry/Model";
import { Shader } from "../Shaders/Shader";
import { SceneBase, type FrameInfo } from "./Scene";
import peachFrag from "../../../assets/shaders/peach.frag?raw";
import peachVert from "../../../assets/shaders/peach.vert?raw";
import { Vec3 } from "../Math/Vectors";
import { Camera } from "../Camera/Camera";
import { Mat4 } from "../Math/Matrix";
import type { PBRBindings } from "../Material/PBRMaterial";

export class PeachScene extends SceneBase {
  private peachModel: Model | null = null;
  private peachShader: Shader | null = null;

  // uniforms
  private uWorld: WebGLUniformLocation | null = null;
  private uView: WebGLUniformLocation | null = null;
  private uProj: WebGLUniformLocation | null = null;
  private uViewPos: WebGLUniformLocation | null = null;

  private uLightPos: WebGLUniformLocation | null = null;
  private uLightColor: WebGLUniformLocation | null = null;
  private uLightIntensity: WebGLUniformLocation | null = null;

  private uAmbience: WebGLUniformLocation | null = null;
  private uHalfLambertPow: WebGLUniformLocation | null = null;

  private pbrBindings: PBRBindings | null = null;

  // settings
  private ambience = 0.03;
  private halfLambertPow = 2.0;

  private lightColor: Vec3 = new Vec3(1.0, 0.8, 0.6);
  private lightPos: Vec3 = new Vec3(0.0, 1.0, 0.0);
  private lightIntensity: number = 50.0;

  private lightRadius = 2.0;

  private camera: Camera = new Camera(1, 1);

  private transform: Mat4 = Mat4.identity();

  private translate: Vec3 = new Vec3(0, 0, 0);
  private rot: Vec3 = new Vec3(0, 0, 0);
  private scale: Vec3 = new Vec3(1, 1, 1);

  private maxTilt = Math.PI * 0.5; // 90deg

  private onMouseMove = (e: MouseEvent) => {
    const canvas = this.gl.canvas;
    if (!(canvas instanceof HTMLCanvasElement)) return;

    const rect = canvas.getBoundingClientRect();
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.5;

    // normalized to [-1, 1]
    const nx = (e.clientX - cx) / (rect.width * 0.5);
    const ny = (cy - e.clientY) / (rect.height * 0.5); // flipped so up is +Y

    const phi = Math.atan2(ny, nx);
    const d = Math.min(1, Math.hypot(nx, ny));
    const theta = d * this.maxTilt;

    const r = this.lightRadius;

    this.lightPos.x = Math.sin(theta) * Math.cos(phi) * r;
    this.lightPos.y = Math.sin(theta) * Math.sin(phi) * r;
    this.lightPos.z = Math.cos(theta) * r; // center => r
  };


  protected onUpdate(deltaTime: number) {
    this.rot.y += 0.001 * deltaTime;
    Mat4.buildTRS(this.transform, this.translate, this.rot, this.scale);
  }

  protected async onInit(): Promise<void> {
    window.addEventListener("mousemove", this.onMouseMove);

    const gl = this.gl;

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    this.peachModel = await loadGLTFModel(gl, "/models/peach.glb");

    this.peachShader = new Shader(
      [
        { stage: gl.VERTEX_SHADER, src: peachVert },
        { stage: gl.FRAGMENT_SHADER, src: peachFrag },
      ],
      gl,
    );

    const prog = this.peachShader.program;
    this.uWorld = gl.getUniformLocation(prog, "u_world");
    this.uView = gl.getUniformLocation(prog, "u_view");
    this.uProj = gl.getUniformLocation(prog, "u_proj");
    this.uViewPos = gl.getUniformLocation(prog, "u_viewPos");

    this.uLightPos = gl.getUniformLocation(prog, "u_lightPos");
    this.uLightColor = gl.getUniformLocation(prog, "u_lightClr");
    this.uLightIntensity = gl.getUniformLocation(prog, "u_lightIntensity");

    this.uAmbience = gl.getUniformLocation(prog, "u_ambience");
    this.uHalfLambertPow = gl.getUniformLocation(prog, "u_halfLambertPow");

    this.pbrBindings = {
      uBaseColorTex: gl.getUniformLocation(prog, "u_baseColorTex")!,
      uNormalTex: gl.getUniformLocation(prog, "u_normalTex")!,
      uMetalRoughTex: gl.getUniformLocation(prog, "u_metallicRoughnessTex")!,
      uOcclusionTex: gl.getUniformLocation(prog, "u_occlusionTex")!,
      uEmissiveTex: gl.getUniformLocation(prog, "u_emissiveTex")!,

      uBaseColorFactor: gl.getUniformLocation(prog, "u_baseColorFactor")!,
      uMetallicFactor: gl.getUniformLocation(prog, "u_metallicFactor")!,
      uRoughnessFactor: gl.getUniformLocation(prog, "u_roughnessFactor")!,
      uEmissiveFactor: gl.getUniformLocation(prog, "u_emissiveFactor")!,

      uNormalScale: gl.getUniformLocation(prog, "u_normalScale")!,
      uOcclusionStrength: gl.getUniformLocation(prog, "u_occlusionStrength")!,

      uAlphaMode: gl.getUniformLocation(prog, "u_alphaMode")!,
      uAlphaCutoff: gl.getUniformLocation(prog, "u_alphaCutoff")!,
    };

    Mat4.identity(this.transform);
    const N = 2.2;
    this.camera.position = new Vec3(0, 0, N);
    this.camera.lookAt(new Vec3(0, 0, 0));
  }

  protected onResize(width: number, height: number): void {
    this.camera.resize(width, height);
  }

  protected onRender(frame: FrameInfo): void {
    const gl = this.gl;

    gl.viewport(0, 0, frame.width, frame.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (!this.peachModel || !this.peachShader) return;

    this.camera.resize(frame.width, frame.height);
    this.camera.update(frame.timeMs / 1000);

    gl.useProgram(this.peachShader.program);

    // matrices
    if (this.uView)
      gl.uniformMatrix4fv(this.uView, false, this.camera.getView().data);
    if (this.uProj)
      gl.uniformMatrix4fv(this.uProj, false, this.camera.getProj().data);

    // camera pos for specular
    if (this.uViewPos)
      gl.uniform3fv(this.uViewPos, this.camera.position.toArray());

    // light
    if (this.uLightPos) gl.uniform3fv(this.uLightPos, this.lightPos.toArray());
    if (this.uLightColor)
      gl.uniform3fv(this.uLightColor, this.lightColor.toArray());
    if (this.uLightIntensity)
      gl.uniform1f(this.uLightIntensity, this.lightIntensity);

    // params
    if (this.uAmbience)
      gl.uniform1f(this.uAmbience, this.ambience);
    if (this.uHalfLambertPow) gl.uniform1f(this.uHalfLambertPow, this.halfLambertPow);

    // u_world = sceneWorld * nodeWorld
    this.peachModel.draw(gl, (nodeWorld) => {
      if (!this.uWorld) return;

      const finalWorld = Mat4.identity();
      Mat4.multiply(finalWorld, this.transform, nodeWorld);

      gl.uniformMatrix4fv(this.uWorld, false, finalWorld.data);
    }, this.pbrBindings);
  }

  protected onDispose(): void {
    if (this.peachModel) this.peachModel.dispose(this.gl);
    this.peachModel = null;

    this.peachShader?.destroy?.();
    this.peachShader = null;

    window.removeEventListener("mousemove", this.onMouseMove);
  }
}
