import { Box, Typography, Stack } from "@mui/material";
import { GLCanvas } from "./WebGL/GLCanvas";
import { FloatRotateScene } from "./WebGL/Shaders/FloatRotateScene";

export default function MaintenancePage() {
  const url = "/peach.svg";

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="background.default"
    >
      <Stack spacing={3} alignItems="center" maxWidth={520} textAlign="center">
        <GLCanvas scene={FloatRotateScene(url)} />

        <Typography variant="h3" fontWeight={700}>
          PeachIsMomo
        </Typography>

        <Typography variant="body1" color="text.secondary">
          This site is currently under maintenance.
          <br />
          I’m polishing a few things — check back soon!
        </Typography>

        <Typography variant="caption" color="text.disabled">
          © {new Date().getFullYear()} PeachIsMomo
        </Typography>
      </Stack>
    </Box>
  );
}
