import { useTheme } from "@mui/material/styles";
import { useMediaQuery, AppBar, Toolbar, Stack, Box, Button, Typography, IconButton, Chip, Container } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import DescriptionIcon from "@mui/icons-material/Description";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { GLCanvas } from "../WebGL/GLCanvas";
import { FloatRotateScene } from "../WebGL/Shaders/FloatRotateScene";
import { AppConfig } from "../../config";

export type NavItem = { id: string; label: string };

export const NAV: NavItem[] = [
  { id: "projects", label: "Projects" },
  { id: "deep-dives", label: "Deep Dives" },
  { id: "toolbox", label: "Toolbox" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 88; // offset for AppBar
  window.scrollTo({ top: y, behavior: "smooth" });
}

function TopNav() {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(15,17,21,0.72)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ minHeight: 72 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flex: 1 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              display: "grid",
              placeItems: "center",
              fontFamily: `"JetBrains Mono", monospace`,
              color: "text.primary",
            }}
          >
            IC
          </Box>

          {mdUp ? (
            <Stack direction="row" spacing={0.5} alignItems="center">
              {NAV.map((n) => (
                <Button
                  key={n.id}
                  size="small"
                  color="inherit"
                  onClick={() => scrollToId(n.id)}
                  sx={{ color: "text.secondary" }}
                >
                  {n.label}
                </Button>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Portfolio
            </Typography>
          )}
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            aria-label="GitHub"
            color="inherit"
            component="a"
            href="https://github.com/peachismomo"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon />
          </IconButton>

          <Button
            variant="outlined"
            startIcon={<DescriptionIcon />}
            onClick={() => {
              // TODO: replace with your resume URL
              window.open("/resume.pdf", "_blank");
            }}
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
          >
            Resume
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

function Hero() {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const status = AppConfig.status;

  const tags = ["C/C++", "C#", "TypeScript"];

  return (
    <Box sx={{ pt: { xs: 6, md: 8 }, pb: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 4, md: 5 }}
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <Box sx={{ flex: 1 }}>
            <Stack spacing={2.2}>
              <Stack spacing={0.8}>
                <Typography variant={mdUp ? "h2" : "h3"} fontWeight={800}>
                  Ian Chua
                </Typography>
                <Typography variant="h6" color="text.secondary" fontWeight={600}>
                  C++ • Graphics • Systems Engineering
                </Typography>
              </Stack>

              <Typography variant="body1" color="text.secondary">
                I focus on rendering systems, engine tooling, and performance-oriented C++ development, with experience across the full web stack.
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
                <Button variant="contained" onClick={() => scrollToId("projects")}>
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

          <Box sx={{ flex: 1, maxWidth: { md: 520 }, ml: { md: "auto" } }}>
            <GLCanvas scene={FloatRotateScene("/peach.svg")} />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

function Header() {
  return <>
    <TopNav />
    <Hero />
  </>;
}

export default Header;