import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LaunchIcon from "@mui/icons-material/Launch";
import GitHubIcon from "@mui/icons-material/GitHub";

import type { ProjectType } from "../../types/types";
import Markdown from "./Markdown";
import { FetchReadme } from "../../api/GithubFetch";
import { getCachedReadme, setCachedReadme } from "../../utils/ReadmeCache";

interface Props {
  p: ProjectType;
  owner: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function GithubProjectCard({
  p,
  owner,
  isOpen,
  onToggle,
}: Props) {
  // undefined = not loaded yet
  // null = loaded, but no README
  // string = loaded README content
  const [readme, setReadme] = useState<string | null | undefined>(undefined);
  const [loadingReadme, setLoadingReadme] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (readme !== undefined) return; // already fetched or determined missing

    // Try cache first
    const cached = getCachedReadme(owner, p.title);
    if (cached) {
      setReadme(cached);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoadingReadme(true);
      try {
        const md = await FetchReadme(owner, p.title);

        if (cancelled) return;

        setReadme(md); // string | null
        if (md) setCachedReadme(owner, p.title, md);
      } finally {
        if (!cancelled) setLoadingReadme(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, readme, owner, p.title]);

  return (
    <Card>
      <CardContent>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="stretch"
        >
          <Box sx={{ flex: 1 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap={2}
            >
              <Typography variant="h5">{p.title}</Typography>

              <IconButton onClick={onToggle} aria-label="Toggle README">
                {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {p.desc || "No description provided."}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              flexWrap="wrap"
              sx={{ mt: 2 }}
            >
              {p.tags?.slice(0, 10).map((t: string) => (
                <Chip
                  key={t}
                  label={t}
                  size="small"
                  variant="outlined"
                  sx={{ fontFamily: `"JetBrains Mono", monospace` }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>

        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              maxHeight: 520,
              overflow: "auto",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              p: 2,
              "& pre, & code": {
                fontFamily: `"JetBrains Mono", monospace`,
              },
              "& img": { maxWidth: "100%" },
            }}
          >
            {loadingReadme ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontFamily: `"JetBrains Mono", monospace` }}
              >
                Loading README…
              </Typography>
            ) : readme ? (
              <Markdown markdown={readme} repo={p.title} />
            ) : readme === null ? (
              "No README"
            ) : (
              "Loading README…"
            )}
          </Box>
        </Collapse>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          size="small"
          startIcon={<GitHubIcon />}
          href={p.htmlUrl}
          target="_blank"
          rel="noreferrer"
        >
          Repo
        </Button>

        {p.title === "peachismomo.github.io" && (
          <Typography variant="subtitle2">You're here!</Typography>
        )}

        {p.homepage && p.title !== "peachismomo.github.io" ? (
          <Button
            size="small"
            endIcon={<LaunchIcon />}
            href={p.homepage}
            target="_blank"
            rel="noreferrer"
          >
            Visit
          </Button>
        ) : null}
      </CardActions>
    </Card>
  );
}
