import { Box, Typography, Stack } from "@mui/material";

export default function MaintenancePage() {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="background.default"
    >
      <Stack spacing={3} alignItems="center" maxWidth={520} textAlign="center">
        <img
          src="/peach.svg"
          alt="PeachIsMomo"
          width={96}
          height={96}
          style={{ opacity: 0.9 }}
        />

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
