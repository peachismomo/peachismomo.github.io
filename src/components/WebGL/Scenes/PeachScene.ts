import { loadGLTFModel } from "../Geometry/gltfLoader";
import type { Model } from "../Geometry/Model";
import { Shader } from "../Shaders/Shader";
import { SceneBase, type FrameInfo } from "./Scene";
import peachFrag from "../../../assets/shaders/peach.frag?raw";
import peachVert from "../../../assets/shaders/peach.vert?raw";
import { Vec3 } from "../Math/Vectors";
import { Camera } from "../Camera/Camera";
import { Mat4 } from "../Math/Matrix";

export class PeachScene extends SceneBase {
  private peachModel: Model | null = null;
  private peachShader: Shader | null = null;

  // settings
  private ambience = 0.01;
  private halfLambertPow = 2.0;

  private lightColor: Vec3 = new Vec3(1.0, 1.0, 1.0);
  private lightPos: Vec3 = new Vec3(0.0, 1.0, 0.0);
  private lightIntensity: number = 30.0;

  private lightRadius = 1.6;
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

    const nx = (e.clientX - cx) / (rect.width * 0.5);
    const ny = (cy - e.clientY) / (rect.height * 0.5); // up is +Y

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

    // Global/per-frame bindings (set by name using your new Shader.bind)
    this.peachShader.bind([
      { name: "u_view", value: this.camera.getView().data },
      { name: "u_proj", value: this.camera.getProj().data },
      { name: "u_viewPos", value: this.camera.position.toArray() },

      { name: "u_lightPos", value: this.lightPos.toArray() },
      { name: "u_lightClr", value: this.lightColor.toArray() },
      { name: "u_lightIntensity", value: this.lightIntensity },

      { name: "u_ambience", value: this.ambience },
      { name: "u_halfLambertPow", value: this.halfLambertPow },
    ]);

    // u_world = sceneWorld * nodeWorld (per-node)
    this.peachModel.draw(
      gl,
      this.peachShader,
      (nodeWorld) => {
        const finalWorld = Mat4.identity();
        Mat4.multiply(finalWorld, this.transform, nodeWorld);
        this.peachShader!.bind([{ name: "u_world", value: finalWorld.data }]);
      },
    );
  }

  protected onDispose(): void {
    if (this.peachModel) this.peachModel.dispose(this.gl);
    this.peachModel = null;

    this.peachShader?.destroy?.();
    this.peachShader = null;

    window.removeEventListener("mousemove", this.onMouseMove);
  }
}
