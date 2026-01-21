import { useTheme } from "@mui/material/styles";
import {
  useMediaQuery,
  Stack,
  Box,
  Button,
  Typography,
  Chip,
  Container,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { GLCanvas } from "../WebGL/GLCanvas";
import { AppConfig } from "../../config";
import scrollToId from "../../utils/ScrollToId";
import HeroBg from "./HeroBg";
import { useMemo } from "react";
import { PeachScene } from "../WebGL/Scenes/PeachScene";

function Hero() {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const scene = useMemo(() => new PeachScene(), []);

  const status = AppConfig.status;

  const tags = ["C/C++", "C#", "TypeScript"];

  return (
    <Box sx={{ pt: { xs: 6, md: 8 }, pb: { xs: 4, md: 6 } }}>
      <HeroBg />
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 4, md: 5 }}
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <Box sx={{ flex: 1 }}>
            <Stack spacing={2.2}>
              <Stack spacing={0.8}>
                <Stack direction="row" alignItems="baseline" spacing={1}>
                  <Typography variant={mdUp ? "h2" : "h3"} fontWeight={800}>
                    Ian Chua
                  </Typography>

                  <Typography variant="subtitle1" color="text.secondary">
                    @peachismomo
                  </Typography>
                </Stack>

                <Typography
                  variant="h6"
                  color="text.secondary"
                  fontWeight={600}
                >
                  C++ • Graphics • Systems Engineering
                </Typography>
              </Stack>

              <Typography variant="body1" color="text.secondary">
                I focus on rendering systems, engine tooling, and
                performance-oriented C++ development, with experience across the
                full web stack.
              </Typography>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {tags.map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    variant="outlined"
                    size="small"
                    sx={{ fontFamily: `"JetBrains Mono", monospace` }}
                  />
                ))}
              </Stack>

              <Stack direction="row" spacing={1.2} alignItems="center">
                <Button
                  variant="contained"
                  onClick={() => scrollToId("projects")}
                >
                  View Projects
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<GitHubIcon />}
                  component="a"
                  href="https://github.com/peachismomo"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </Button>
                <Button
                  variant="text"
                  startIcon={<MailOutlineIcon />}
                  onClick={() => scrollToId("contact")}
                  sx={{ color: "text.secondary" }}
                >
                  Contact
                </Button>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={`Status: ${status}`}
                  size="small"
                  color={status === "Up to date" ? "success" : "warning"}
                  variant="outlined"
                />
                <Typography variant="caption" color="text.disabled">
                  / last updated: 2026-01
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Box
            sx={{
              flex: 1,
              maxWidth: { md: 520 },
              ml: { md: "auto" },
              aspectRatio: "1 / 1",
              width: "100%",
            }}
          >
            <GLCanvas scene={scene} />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default Hero;
