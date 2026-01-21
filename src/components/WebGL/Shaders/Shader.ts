export interface ShaderStage {
  stage: number;
  src: string;
  shader?: WebGLShader | null;
}

export class Shader {
  public program: WebGLProgram;
  private readonly shaderStages: ShaderStage[];
  private readonly gl: WebGL2RenderingContext;

  constructor(shaderStages: ShaderStage[], gl: WebGL2RenderingContext) {
    this.shaderStages = shaderStages;
    this.gl = gl;

    for (const stage of this.shaderStages) {
      stage.shader = this.compile(stage);
    }

    this.program = this.link(this.shaderStages);

    for (const stage of this.shaderStages) {
      if (stage.shader) {
        this.gl.detachShader(this.program, stage.shader);
        this.gl.deleteShader(stage.shader);
        stage.shader = null;
      }
    }
  }

  private compile(stage: ShaderStage): WebGLShader {
    const shader = this.gl.createShader(stage.stage);
    if (!shader) throw new Error("Failed to create shader.");

    this.gl.shaderSource(shader, stage.src);
    this.gl.compileShader(shader);

    const ok = this.gl.getShaderParameter(
      shader,
      this.gl.COMPILE_STATUS,
    ) as boolean;
    if (!ok) {
      const log = this.gl.getShaderInfoLog(shader) ?? "shader compile failed";
      this.gl.deleteShader(shader);
      throw new Error(log);
    }

    return shader;
  }

  private link(stages: ShaderStage[]): WebGLProgram {
    if (stages.some((s) => s.shader == null)) {
      throw new Error("Attempted to link with null shader stage(s).");
    }

    const program = this.gl.createProgram();
    if (!program) throw new Error("Failed to create shader program.");

    for (const s of stages) {
      if (s.shader) this.gl.attachShader(program, s.shader);
    }

    this.gl.linkProgram(program);

    const ok = this.gl.getProgramParameter(
      program,
      this.gl.LINK_STATUS,
    ) as boolean;
    if (!ok) {
      const log = this.gl.getProgramInfoLog(program) ?? "program link failed";
      this.gl.deleteProgram(program);
      throw new Error(log);
    }

    return program;
  }

  public use() {
    this.gl.useProgram(this.program);
  }

  public destroy() {
    this.gl.deleteProgram(this.program);
  }

  public getUniformLocation(uniform: string) {
    return this.gl.getUniformLocation(this.program, uniform);
  }

  public getAttribLocation(attrib: string) {
    return this.gl.getAttribLocation(this.gl, attrib);
  }
}
