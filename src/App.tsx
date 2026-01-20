import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { type ReactNode } from "react";
import Body from "./components/Body";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { darkTheme } from "./themes/Themes";
import { AppConfig } from "./config";
import MaintenancePage from "./components/Sections/MaintenancePage";

function HomePage(): ReactNode {
  return (
    <>
      <Header />
      <Body />
      <Footer />
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {AppConfig.siteEnabled ? <HomePage /> : <MaintenancePage />}
    </ThemeProvider>
  );
}

export default App;
