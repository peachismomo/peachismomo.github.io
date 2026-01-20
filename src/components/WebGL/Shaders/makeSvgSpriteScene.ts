import type { GLScene } from "../GLCanvas";

const vert = `#version 300 es
precision highp float;

in vec2 a_pos;   // clip-space quad vertices (-1..1)
in vec2 a_uv;

out vec2 v_uv;

uniform vec2 u_translate; // clip-space
uniform float u_rotate;   // radians
uniform vec2 u_scale;     // clip-space scale

mat2 rot(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

void main() {
  v_uv = a_uv;

  vec2 p = a_pos;
  p = rot(u_rotate) * (p * u_scale);
  p += u_translate;

  gl_Position = vec4(p, 0.0, 1.0);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) {
    console.error("Failed to create shader.");
    return;
  }
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh) || "shader compile failed";
    gl.deleteShader(sh);
    throw new Error(log);
  }
  return sh;
}

function link(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const p = gl.createProgram();
  if (!p) {
    console.error("Failed to create shader program.");
    return;
  }
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(p) || "program link failed";
    gl.deleteProgram(p);
    throw new Error(log);
  }
  return p;
}

async function loadSvgAsImage(
  svgUrl: string,
  rasterWidth = 1024,
): Promise<HTMLImageElement> {
  // Fetch the SVG text and rasterize it at a chosen resolution.
  // This gives you crisp results vs relying on browser default sizing.
  const resp = await fetch(svgUrl);
  if (!resp.ok) throw new Error(`Failed to fetch SVG: ${svgUrl}`);
  const svgText = await resp.text();

  const blob = new Blob([svgText], { type: "image/svg+xml" });
  const blobUrl = URL.createObjectURL(blob);

  const img = new Image();
  img.decoding = "async";
  img.src = blobUrl;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () =>
      reject(new Error(`Failed to load SVG image: ${svgUrl}`));
  });

  // Optionally re-rasterize via canvas to a known texture size
  // (helps when SVG has no explicit width/height)
  const ratio = img.width > 0 && img.height > 0 ? img.height / img.width : 1;
  const w = rasterWidth;
  const h = Math.max(1, Math.floor(w * ratio));

  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) {
    console.error("Failed to get 2d context");
    return new Image();
  }
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);

  const out = new Image();
  out.decoding = "async";
  out.src = c.toDataURL("image/png");

  await new Promise<void>((resolve, reject) => {
    out.onload = () => resolve();
    out.onerror = () => reject(new Error("Failed to rasterize SVG"));
  });

  URL.revokeObjectURL(blobUrl);
  return out;
}

function createTexture(gl: WebGL2RenderingContext, img: HTMLImageElement) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.generateMipmap(gl.TEXTURE_2D);

  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
}

export function makeSvgSpriteScene(opts: {
  svgUrl: string;
  fragSource: string;
  transform: (info: { timeMs: number; width: number; height: number }) => {
    translate: [number, number];
    rotate: number;
    scale: [number, number];
  };
  setExtraUniforms?: (
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    info: { timeMs: number; width: number; height: number },
  ) => void;
}): GLScene {
  let program: WebGLProgram | undefined = undefined;
  let vao: WebGLVertexArrayObject | null = null;
  let tex: WebGLTexture | null = null;

  let uTranslate: WebGLUniformLocation | null = null;
  let uRotate: WebGLUniformLocation | null = null;
  let uScale: WebGLUniformLocation | null = null;
  let uTex: WebGLUniformLocation | null = null;

  return {
    init(gl) {
      // enable alpha blending for SVG transparency
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      // Compile program
      const vs = compile(gl, gl.VERTEX_SHADER, vert);
      const fs = compile(gl, gl.FRAGMENT_SHADER, opts.fragSource);

      if (!vs || !fs) {
        return () => {
          console.error("Failed to init.");
        };
      }

      program = link(gl, vs, fs);

      if (!program) {
        return () => {
          gl.deleteShader(vs);
          gl.deleteShader(fs);
        };
      }

      gl.deleteShader(vs);
      gl.deleteShader(fs);

      uTranslate = gl.getUniformLocation(program, "u_translate");
      uRotate = gl.getUniformLocation(program, "u_rotate");
      uScale = gl.getUniformLocation(program, "u_scale");
      uTex = gl.getUniformLocation(program, "u_tex");

      // Quad (clip-space) with UVs
      // Two triangles forming a quad from (-1,-1) to (1,1)
      const vertices = new Float32Array([
        // x, y,   u, v
        -1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1,

        -1, 1, 0, 1, 1, -1, 1, 0, 1, 1, 1, 1,
      ]);

      vao = gl.createVertexArray();
      gl.bindVertexArray(vao);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      const posLoc = gl.getAttribLocation(program, "a_pos");
      const uvLoc = gl.getAttribLocation(program, "a_uv");

      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 4 * 4, 0);

      gl.enableVertexAttribArray(uvLoc);
      gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 4 * 4, 2 * 4);

      gl.bindVertexArray(null);

      // async texture load
      (async () => {
        const img = await loadSvgAsImage(opts.svgUrl, 1024);
        tex = createTexture(gl, img);
      })();

      return () => {
        if (vao) gl.deleteVertexArray(vao);
        if (program) gl.deleteProgram(program);
        if (tex) gl.deleteTexture(tex);
        vao = null;
        program = undefined;
        tex = null;
      };
    },

    render(gl, info) {
      gl.clearColor(0, 0, 0, 0); // transparent background
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (!program || !vao || !tex) return;

      gl.useProgram(program);
      gl.bindVertexArray(vao);

      const { translate, rotate, scale } = opts.transform(info);
      if (uTranslate) gl.uniform2f(uTranslate, translate[0], translate[1]);
      if (uRotate) gl.uniform1f(uRotate, rotate);
      if (uScale) gl.uniform2f(uScale, scale[0], scale[1]);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      if (uTex) gl.uniform1i(uTex, 0);

      opts.setExtraUniforms?.(gl, program, info);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      gl.bindVertexArray(null);
      gl.bindTexture(gl.TEXTURE_2D, null);
    },
  };
}
