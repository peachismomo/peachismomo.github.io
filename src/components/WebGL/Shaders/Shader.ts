export type Binding =
  | { name: string; value: number | boolean | Float32Array | Int32Array }
  | { name: string; sampler2D: { tex: WebGLTexture; unit: number } };

type UniformSetter = (binding: Binding) => void;

function buildUniformTable(gl: WebGL2RenderingContext, program: WebGLProgram) {
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
  const table = new Map<string, UniformSetter>();

  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i);
    if (!info) continue;

    // ActiveUniformInfo.name may be "uTex[0]" for arrays
    const name = info.name.replace(/\[0\]$/, "");
    const loc = gl.getUniformLocation(program, name);
    if (!loc) {
      // optimized out / in UBO / etc.
      continue;
    }

    let setter: UniformSetter;

    switch (info.type) {
      case gl.FLOAT:
        setter = (b) => gl.uniform1f(loc, (b as any).value as number);
        break;
      case gl.FLOAT_VEC2:
        setter = (b) => gl.uniform2fv(loc, (b as any).value as Float32Array);
        break;
      case gl.FLOAT_VEC3:
        setter = (b) => gl.uniform3fv(loc, (b as any).value as Float32Array);
        break;
      case gl.FLOAT_VEC4:
        setter = (b) => gl.uniform4fv(loc, (b as any).value as Float32Array);
        break;

      case gl.INT:
      case gl.BOOL:
        setter = (b) => gl.uniform1i(loc, Number((b as any).value));
        break;
      case gl.INT_VEC2:
      case gl.BOOL_VEC2:
        setter = (b) => gl.uniform2iv(loc, (b as any).value as Int32Array);
        break;
      case gl.INT_VEC3:
      case gl.BOOL_VEC3:
        setter = (b) => gl.uniform3iv(loc, (b as any).value as Int32Array);
        break;
      case gl.INT_VEC4:
      case gl.BOOL_VEC4:
        setter = (b) => gl.uniform4iv(loc, (b as any).value as Int32Array);
        break;

      case gl.FLOAT_MAT2:
        setter = (b) => gl.uniformMatrix2fv(loc, false, (b as any).value as Float32Array);
        break;
      case gl.FLOAT_MAT3:
        setter = (b) => gl.uniformMatrix3fv(loc, false, (b as any).value as Float32Array);
        break;
      case gl.FLOAT_MAT4:
        setter = (b) => gl.uniformMatrix4fv(loc, false, (b as any).value as Float32Array);
        break;

      case gl.SAMPLER_2D:
        setter = (b) => {
          const s = (b as any).sampler2D as { tex: WebGLTexture; unit: number } | undefined;
          if (!s) throw new Error(`Uniform ${name} expects sampler2D binding`);
          gl.activeTexture(gl.TEXTURE0 + s.unit);
          gl.bindTexture(gl.TEXTURE_2D, s.tex);
          gl.uniform1i(loc, s.unit);
        };
        break;

      default:
        throw new Error(`Unsupported uniform ${name} type enum: ${info.type}`);
    }

    table.set(name, setter);
  }

  return (binding: Binding) => {
    const set = table.get(binding.name);
    if (!set) {
      console.warn(`Unknown/unreflected uniform: ${binding.name}`);
      return;
    }
    set(binding);
  };
}

export interface ShaderStage {
  stage: number;
  src: string;
  shader?: WebGLShader | null;
}

export class Shader {
  public program: WebGLProgram;
  private readonly shaderStages: ShaderStage[];
  private readonly gl: WebGL2RenderingContext;
  private setUniformBinding: (b: Binding) => void;

  constructor(shaderStages: ShaderStage[], gl: WebGL2RenderingContext) {
    this.shaderStages = shaderStages;
    this.gl = gl;

    for (const stage of this.shaderStages) {
      stage.shader = this.compile(stage);
    }

    this.program = this.link(this.shaderStages);

    this.setUniformBinding = buildUniformTable(gl, this.program);

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
    return this.gl.getAttribLocation(this.program, attrib);
  }

  public bind(bindings: Binding[]) {
    this.use();
    for (const b of bindings) this.setUniformBinding(b);
  }
}
