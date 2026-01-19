import { ThemeProvider } from "@emotion/react";
import { CssBaseline, Container, Grid, Drawer, Box } from "@mui/material";
import { type ReactNode, useEffect } from "react";
import Body from "./components/Sections/Body";
import Footer from "./components/Sections/Footer";
import Header from "./components/Sections/Header";
import { useModeContext } from "./context/useModeContext";
import TabProvider from "./providers/TabProvider";
import { darkTheme, lightTheme } from "./themes/Themes";
import { AppConfig } from "./config";
import MaintenancePage from "./components/MaintenancePage";

function IndexWrapper(): ReactNode {
  return (
    <TabProvider>
      <Container sx={{ paddingTop: "10vh" }}>
        <Grid container spacing={2}>
          <Grid size={4}>
            <Drawer
              anchor="left"
              variant="permanent"
              sx={{
                backgroundColor: "primary.main",
                width: "40vh",
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: "40vh",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100vh",
                  backgroundColor: "primary.main",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Box sx={{ flexShrink: 0, p: 2, mt: "8vh" }}>
                  <Header />
                </Box>

                <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }} />

                <Box sx={{ flexShrink: 0, p: 2 }}>
                  <Footer />
                </Box>
              </Box>
            </Drawer>
          </Grid>
          <Grid size={"grow"}>
            <Body />
          </Grid>
        </Grid>
      </Container>
    </TabProvider>
  );
}

function App() {
  const mode = useModeContext();

  // Change this to some icon button
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        mode.setIsDark((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mode]);
  return (
    <ThemeProvider theme={mode.isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      {AppConfig.siteEnabled ? <IndexWrapper /> : <MaintenancePage />}
    </ThemeProvider>
  );
}

export default App;
