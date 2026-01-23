import {
  useMediaQuery,
  AppBar,
  Toolbar,
  Stack,
  Box,
  Button,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import scrollToId from "../../utils/ScrollToId";
import GitHubIcon from "@mui/icons-material/GitHub";
import DescriptionIcon from "@mui/icons-material/Description";

export interface NavItem {
  id: string;
  label: string;
}

export const NAV: NavItem[] = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "github", label: "Github Projects" },
  { id: "toolbox", label: "Toolbox" },
  { id: "contact", label: "Contact" },
];

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
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ flex: 1 }}
        >
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
              window.open("/resume/resumeV1.pdf", "_blank");
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

export default TopNav;
