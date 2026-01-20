import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { type ReactNode } from "react";
import Body from "./components/Sections/Body";
import Footer from "./components/Sections/Footer";
import Header from "./components/Sections/Header";
import { darkTheme } from "./themes/Themes";
import { AppConfig } from "./config";
import MaintenancePage from "./components/MaintenancePage";

function HomePage(): ReactNode {
  return <>
    <Header />
    <Body />
    <Footer />
  </>
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
