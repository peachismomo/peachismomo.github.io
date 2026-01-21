import React, { useEffect, useRef } from "react";

export interface GLScene {
  init: (gl: WebGL2RenderingContext) => () => void;
  render: (
    gl: WebGL2RenderingContext,
    info: { timeMs: number; width: number; height: number },
  ) => void;
  update?: (deltaTime: number) => void;
}

export function GLCanvas({
  scene,
  className,
  style,
}: {
  scene: GLScene;
  className?: string;
  style?: React.CSSProperties;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
    });
    if (!gl) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      return { width: w, height: h };
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas.parentElement ?? canvas);

    const cleanup = scene.init(gl);
    let lastTime = 0;

    let raf = 0;
    const loop = (t: number) => {
      const dt = lastTime ? (t - lastTime) : 0;
      lastTime = t;

      const { width, height } = resize();
      scene.update?.(dt);
      scene.render(gl, { timeMs: t, width, height });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (typeof cleanup === "function") cleanup();
    };
  }, [scene]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ background: "transparent", width: "100%", height: "100%", display: "block", ...style }}
    />
  );
}
