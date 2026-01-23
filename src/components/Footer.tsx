import { useState } from "react";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Button,
  Box,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import Section from "./Generic/Section";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

function Footer() {
  const [toast, setToast] = useState<string | null>(null);

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard?.writeText(value);
      setToast(`${label} copied`);
    } catch {
      setToast(`Failed to copy ${label.toLowerCase()}`);
    }
  };

  return (
    <Box sx={{ width: "80%", mx: "auto" }}>
      <Section
        id="contact"
        title="Contact"
        subtitle="Let’s talk anything C++/graphics roles and projects."
      >
        <Card>
          <CardContent>
            <Stack spacing={1.2}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.2}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
              >
                {/* Left: links */}
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Button
                    variant="outlined"
                    startIcon={<GitHubIcon />}
                    href="..."
                    target="_blank"
                  >
                    GitHub
                  </Button>
                  <Button
                    variant="outlined"
                    endIcon={<LaunchIcon />}
                    href="..."
                    target="_blank"
                  >
                    LinkedIn
                  </Button>
                </Stack>

                {/* Right: copy */}
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Button
                    variant="outlined"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => copy("Email", "iancrb00@gmail.com")}
                    sx={{ fontFamily: `"JetBrains Mono", monospace` }}
                  >
                    iancrb00@gmail.com
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => copy("Phone", "+65 9298 0585")}
                    sx={{ fontFamily: `"JetBrains Mono", monospace` }}
                  >
                    +65 9298 0585
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Box sx={{ pt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            justifyContent="space-between"
          >
            <Typography variant="caption" color="text.disabled">
              © {new Date().getFullYear()} Ian Chua
            </Typography>
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontFamily: `"JetBrains Mono", monospace` }}
            >
              Built with Vite + React + MUI + WebGL
            </Typography>
          </Stack>
        </Box>
      </Section>

      <Snackbar
        open={!!toast}
        autoHideDuration={2200}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Footer;
