import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Box, Typography, Link } from "@mui/material";

function isAbsoluteUrl(url: string) {
  return /^(https?:)?\/\//.test(url);
}

function joinUrl(base: string, path: string) {
  const cleanedBase = base.endsWith("/") ? base : base + "/";
  const cleanedPath = path.replace(/^\.?\//, "");
  return cleanedBase + cleanedPath;
}

export function Markdown({
  markdown,
  repo,
  branch = "main",
}: {
  markdown: string;
  repo: string;
  branch?: string;
}) {
  const rawBase = `https://raw.githubusercontent.com/peachismomo/${repo}/${branch}/`;

  return (
    <Box
      sx={{
        typography: "body2",
        color: "text.primary",
        "& h1": { typography: "h5", fontWeight: 800, mt: 1, mb: 1 },
        "& h2": { typography: "h6", fontWeight: 800, mt: 2, mb: 1 },
        "& h3": { typography: "subtitle1", fontWeight: 800, mt: 2, mb: 1 },
        "& p": { my: 1, color: "text.secondary" },
        "& a": { color: "primary.main", wordBreak: "break-word" },
        "& ul, & ol": { pl: 3, my: 1, color: "text.secondary" },
        "& li": { my: 0.5 },
        "& blockquote": {
          m: 0,
          my: 1.5,
          pl: 2,
          borderLeft: "3px solid",
          borderColor: "divider",
          color: "text.secondary",
        },
        "& code": {
          fontFamily: `"JetBrains Mono", monospace`,
          fontSize: "0.9em",
          bgcolor: "action.hover",
          px: 0.6,
          py: 0.2,
          borderRadius: 1,
        },
        "& pre": {
          bgcolor: "action.hover",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: 2,
          overflow: "auto",
        },
        "& pre code": { bgcolor: "transparent", p: 0 },
        "& img": { maxWidth: "100%", borderRadius: 2 },
        "& hr": { borderColor: "divider", my: 2 },
        "& table": { width: "100%", borderCollapse: "collapse", my: 1.5 },
        "& th, & td": { border: "1px solid", borderColor: "divider", p: 1 },
        "& th": { bgcolor: "action.hover" },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          a: ({ href, children }) => (
            <Link href={href} target="_blank" rel="noreferrer">
              {children}
            </Link>
          ),
          p: ({ children }) => (
            <Typography component="p">{children}</Typography>
          ),
          img: ({ src, alt }) => {
            const safeSrc = src ?? "";
            const resolvedSrc = isAbsoluteUrl(safeSrc)
              ? safeSrc
              : joinUrl(rawBase, safeSrc);
            return <img src={resolvedSrc} alt={alt ?? ""} />;
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </Box>
  );
}

export default Markdown;
