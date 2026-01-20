import {
  Card,
  CardContent,
  Stack,
  Typography,
  Button,
  Box,
  Divider,
} from "@mui/material";
import Section from "./Generic/Section";
import GitHubIcon from "@mui/icons-material/GitHub";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LaunchIcon from "@mui/icons-material/Launch";

function Footer() {
  return (
    <Box
      sx={{
        width: "80%",
        mx: "auto",
      }}
    >
      <Section
        id="contact"
        title="Contact"
        subtitle="Let’s talk anything C++/graphics roles and projects."
      >
        <Card>
          <CardContent>
            <Stack spacing={1.2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button
                  variant="contained"
                  startIcon={<MailOutlineIcon />}
                  onClick={() => {
                    navigator.clipboard?.writeText("iancrb00@gmail.com");
                  }}
                >
                  Copy Email
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
                  endIcon={<LaunchIcon />}
                  component="a"
                  href="https://www.linkedin.com/in/ian-chua-rong-bin/"
                  target="_blank"
                  rel="noreferrer"
                  sx={{ color: "text.secondary" }}
                >
                  LinkedIn
                </Button>
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
    </Box>
  );
}

export default Footer;
