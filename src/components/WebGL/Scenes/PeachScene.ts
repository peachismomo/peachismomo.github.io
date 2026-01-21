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

  private uWorld: WebGLUniformLocation | null = null;
  private uView: WebGLUniformLocation | null = null;
  private uProj: WebGLUniformLocation | null = null;
  private uViewPos: WebGLUniformLocation | null = null;

  private uLightPos: WebGLUniformLocation | null = null;
  private uLightColor: WebGLUniformLocation | null = null;

  private uAmbientStrength: WebGLUniformLocation | null = null;
  private uSpecStrength: WebGLUniformLocation | null = null;
  private uShininess: WebGLUniformLocation | null = null;

  private ambientStrength = 0.008;
  private specStrength = 0.5;
  private shininess = 64.0;

  private lightColor: Vec3 = new Vec3(1.0, 0.8, 0.6);
  private lightPos: Vec3 = new Vec3(0.0, -1.0, 0.0);

  private camera: Camera = new Camera(1, 1);

  // Scene/root transform (lets you force the whole model to origin / scale / rotate later)
  private sceneWorld: Mat4 = Mat4.identity();

  protected async onInit(): Promise<void> {
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

    this.uAmbientStrength = gl.getUniformLocation(prog, "u_ambientStrength");
    this.uSpecStrength = gl.getUniformLocation(prog, "u_specStrength");
    this.uShininess = gl.getUniformLocation(prog, "u_shininess");

    // camera: N units away looking at origin
    Mat4.identity(this.sceneWorld);
    const N = 2.2;
    this.camera.position = new Vec3(0, 0, N);
    this.camera.lookAt(new Vec3(0, 0, 0));

    // move model down a bit (optional)
    this.sceneWorld.data[13] = -0.5;
  }

  protected onResize(width: number, height: number): void {
    this.camera.resize(width, height);
  }

  protected onRender(frame: FrameInfo): void {
    const gl = this.gl;

    gl.viewport(0, 0, frame.width, frame.height);
    gl.clearColor(0, 0, 0, 1);
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

    // blinn-phong params
    if (this.uAmbientStrength)
      gl.uniform1f(this.uAmbientStrength, this.ambientStrength);
    if (this.uSpecStrength) gl.uniform1f(this.uSpecStrength, this.specStrength);
    if (this.uShininess) gl.uniform1f(this.uShininess, this.shininess);

    // u_world = sceneWorld * nodeWorld
    this.peachModel.draw(gl, (nodeWorld) => {
      if (!this.uWorld) return;

      const nodeMat = new Mat4(nodeWorld);
      const finalWorld = Mat4.identity();
      Mat4.multiply(finalWorld, this.sceneWorld, nodeMat);

      gl.uniformMatrix4fv(this.uWorld, false, finalWorld.data);
    });
  }

  protected onDispose(): void {
    if (this.peachModel) this.peachModel.dispose(this.gl);
    this.peachModel = null;

    this.peachShader?.destroy?.();
    this.peachShader = null;
  }
}
