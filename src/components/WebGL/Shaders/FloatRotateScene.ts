import { makeSvgSpriteScene } from "./makeSvgSpriteScene";

const frag = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 outColor;

uniform sampler2D u_tex;

void main() {
  outColor = texture(u_tex, v_uv);
}
`;

export const FloatRotateScene = (svgUrl: string) =>
  makeSvgSpriteScene({
    svgUrl,
    fragSource: frag,
    transform: ({ timeMs, width, height }) => {
      const t = timeMs * 0.001;

      // translate in clip-space (small float up/down)
      const y = 0.08 * Math.sin(t * 1.5);
      const x = 0.05 * Math.sin(t * 0.8);

      // rotate a bit
      const rot = 0.25 * Math.sin(t);

      // scale based on aspect so it looks consistent
      const aspect = width / height;
      const base = 1.0; // overall size (clip-space)
      const sx = base * (aspect >= 1 ? 0.6 : 0.6 * aspect);
      const sy = base * 0.6;

      return {
        translate: [x, y] as [number, number],
        rotate: rot,
        scale: [sx, sy] as [number, number],
      };
    },
  });
