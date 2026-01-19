import { makeSvgSpriteScene } from "./makeSvgSpriteScene";

const frag = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 outColor;

uniform sampler2D u_tex;
uniform float u_time;

void main() {
  float t = u_time * 0.001;

  // Distort UVs (simple wave)
  vec2 uv = v_uv;
  uv.y += 0.03 * sin(uv.x * 12.0 + t * 2.0);
  uv.x += 0.02 * sin(uv.y * 10.0 + t * 1.3);

  // Clamp to avoid sampling outside
  uv = clamp(uv, 0.0, 1.0);

  vec4 col = texture(u_tex, uv);

  // Optional: subtle shimmer based on wave
  col.rgb *= 0.95 + 0.05 * sin(t + uv.x * 20.0);

  outColor = col;
}
`;

export const WaveDistortScene = (svgUrl: string) =>
  makeSvgSpriteScene({
    svgUrl,
    fragSource: frag,
    transform: ({ width, height }) => {
      // keep it centered and stable; just shader distorts it
      const aspect = width / height;
      const base = 0.6;
      const sx = base * (aspect >= 1 ? 0.6 : 0.6 * aspect);
      const sy = base * 0.6;

      return {
        translate: [0, 0],
        rotate: 0,
        scale: [sx, sy],
      };
    },
    setExtraUniforms: (gl, program, { timeMs }) => {
      const uTime = gl.getUniformLocation(program, "u_time");
      if (uTime) gl.uniform1f(uTime, timeMs);
    },
  });
