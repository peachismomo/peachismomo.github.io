import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#004D61",
    },
    secondary: {
      main: "#FFB29E",
    },
    background: {
      default: "#1A1A1A",
      paper: "#232323",
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});
