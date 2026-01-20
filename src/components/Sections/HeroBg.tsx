import { Box } from "@mui/material";
import { GLCanvas } from "../WebGL/GLCanvas";
import { GradientScene } from "../WebGL/Shaders/Gradient";

function HeroBg() {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.45,
          filter: "saturate(0.95) contrast(0.95)",
          maskImage:
            "radial-gradient(800px 400px at 20% 10%, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(800px 400px at 20% 10%, black 0%, transparent 70%)",
        }}
      >
        <GLCanvas scene={GradientScene} />
      </Box>
    </Box>
  );
}

export default HeroBg;
