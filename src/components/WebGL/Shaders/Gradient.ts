import type { GLScene } from "../GLCanvas";

const vert = `#version 300 es
precision highp float;

in vec2 a_pos;
out vec2 v_uv;

void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const frag = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 outColor;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
  float t = u_time * 0.001;
  vec2 uv = v_uv;

  // simple animated gradient
  float wave = 0.5 + 0.5 * sin(t + uv.x * 6.2831);
  vec3 col = vec3(uv.x, uv.y, wave);

  outColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) throw new Error("createShader failed");
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh) || "Shader compile failed";
    gl.deleteShader(sh);
    throw new Error(log);
  }
  return sh;
}

function link(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const prog = gl.createProgram();
  if (!prog) throw new Error("createProgram failed");
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(prog) || "Program link failed";
    gl.deleteProgram(prog);
    throw new Error(log);
  }
  return prog;
}

export const GradientScene: GLScene = (() => {
  let program: WebGLProgram | null = null;
  let vao: WebGLVertexArrayObject | null = null;
  let uTime: WebGLUniformLocation | null = null;
  let uRes: WebGLUniformLocation | null = null;

  return {
    init(gl) {
      const vs = compile(gl, gl.VERTEX_SHADER, vert);
      const fs = compile(gl, gl.FRAGMENT_SHADER, frag);
      program = link(gl, vs, fs);

      // shaders can be deleted after linking
      gl.deleteShader(vs);
      gl.deleteShader(fs);

      uTime = gl.getUniformLocation(program, "u_time");
      uRes = gl.getUniformLocation(program, "u_resolution");

      const posLoc = gl.getAttribLocation(program, "a_pos");

      // Full-screen triangle
      vao = gl.createVertexArray();
      gl.bindVertexArray(vao);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW,
      );

      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.bindVertexArray(null);

      return () => {
        if (vao) gl.deleteVertexArray(vao);
        if (program) gl.deleteProgram(program);
        vao = null;
        program = null;
      };
    },

    render(gl, { timeMs, width, height }) {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (!program || !vao) return;

      gl.useProgram(program);
      gl.bindVertexArray(vao);

      if (uTime) gl.uniform1f(uTime, timeMs);
      if (uRes) gl.uniform2f(uRes, width, height);

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      gl.bindVertexArray(null);
    },
  };
})();
