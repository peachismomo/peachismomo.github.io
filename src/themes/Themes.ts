import { alpha, createTheme } from "@mui/material/styles";

export const monoHeading = "#FD971F";
export const monoBody = "#E6E6E1";
export const monoMuted = "#A6A69C";
export const monoOverline = "#A6E22E";
export const monoRed = "#F92672";
export const monoFg = "#F8F8F2";
export const monoBg = "#272822";
export const monoComment = "#75715E";
export const monoYellow = "#E6DB74";
export const orange = "#FD971F";
export const monoPurple = "#AE81FF";
export const blue = "#66D9EF";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: blue,
    },
    secondary: {
      main: orange,
    },

    error: {
      main: monoRed,
    },
    success: {
      main: monoOverline,
    },
    warning: {
      main: monoYellow,
    },
    info: {
      main: blue,
    },

    background: {
      default: "#1E1F1C",
      paper: monoBg,
    },

    text: {
      primary: monoFg,
      secondary: "#A6A69C",
    },

    divider: "rgba(248,248,242,0.08)",
  },

  shape: {
    borderRadius: 16,
  },

  typography: {
    fontFamily: `"Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif`,

    // Headings: all one color
    h1: { fontWeight: 700, letterSpacing: "-0.02em", color: monoHeading },
    h2: { fontWeight: 700, letterSpacing: "-0.02em", color: monoHeading },
    h3: { fontWeight: 600, color: monoHeading },
    h4: { fontWeight: 600, color: monoHeading },
    h5: { fontWeight: 700, color: monoHeading },
    h6: { fontWeight: 700, color: monoHeading },

    // Body: slightly dimmer
    body1: { lineHeight: 1.6, color: monoBody },
    body2: { lineHeight: 1.6, color: monoBody },

    // Secondary variants
    subtitle1: { color: monoBody },
    subtitle2: { color: monoMuted },
    caption: { color: monoMuted },

    button: { textTransform: "none", fontWeight: 600 },

    // Code-ish label style
    overline: {
      fontFamily: `"JetBrains Mono", monospace`,
      letterSpacing: "0.08em",
      color: monoOverline,
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "radial-gradient(1200px 600px at 20% -10%, rgba(102,217,239,0.08), transparent 40%), #1E1F1C",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(248,248,242,0.06)",
          backdropFilter: "blur(6px)",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(248,248,242,0.06)",
          background:
            "linear-gradient(180deg, rgba(248,248,242,0.02), rgba(248,248,242,0.00)), #272822",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        containedPrimary: {
          boxShadow: "0 0 0 rgba(0,0,0,0)",
          "&:hover": {
            boxShadow: "0 0 16px rgba(102,217,239,0.35)",
          },
        },
        outlinedPrimary: {
          borderColor: "rgba(102,217,239,0.4)",
          "&:hover": {
            borderColor: "#66D9EF",
            boxShadow: "0 0 12px rgba(102,217,239,0.25)",
          },
        },
      },
    },

    MuiLink: {
      styleOverrides: {
        root: {
          textDecorationColor: "rgba(253,151,31,0.45)",
          "&:hover": {
            textDecorationColor: "#FD971F",
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: ({ ownerState, theme }) => {
          const colorKey = ownerState.color ?? "default";

          // Map default → red
          const main =
            colorKey === "default"
              ? theme.palette.error.main
              : (theme.palette[colorKey]?.main ?? theme.palette.error.main);

          return {
            fontFamily: `"JetBrains Mono", monospace`,
            ...(ownerState.variant === "outlined"
              ? {
                  color: main,
                  borderColor: alpha(main, 0.45),
                  backgroundColor: alpha(main, 0.08),
                }
              : {
                  color: theme.palette.getContrastText(main),
                  backgroundColor: main,
                }),
          };
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});
