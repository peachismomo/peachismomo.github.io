import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
  Collapse,
  IconButton,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Section from "../Generic/Section";
import LaunchIcon from "@mui/icons-material/Launch";
import GitHubIcon from "@mui/icons-material/GitHub";
import { FetchProjects } from "../../api/GithubFetch";
import type { ProjectType } from "../../types/types";
import Markdown from "./Markdown";

const FEATURED_REPOS = new Set<string>([]);

const PAGE_SIZE = 3;

function GithubProjects() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await FetchProjects("peachismomo");
        if (!alive) return;

        setProjects(data);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Failed to load projects");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [projects.length]);

  const featured = useMemo(() => {
    const picked = projects.filter((p) => FEATURED_REPOS.has(p.title));
    if (picked.length) return picked;
    return [...projects].slice(0, 3);
  }, [projects]);

  // NEW: pick the list to render and paginate it
  const list = useMemo(() => {
    const usingFeaturedSet = FEATURED_REPOS.size > 0 && featured.length > 0;
    return usingFeaturedSet ? featured : projects;
  }, [projects, featured]);

  const visible = useMemo(() => list.slice(0, visibleCount), [list, visibleCount]);
  const hasMore = visibleCount < list.length;

  const showMore = () => {
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, list.length));
  };

  const toggleExpand = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <Section id="github" title="GitHub" subtitle="Some of my projects on GitHub">
      {loading && (
        <Typography
          color="text.secondary"
          sx={{ fontFamily: `"JetBrains Mono", monospace` }}
        >
          Loading projects…
        </Typography>
      )}

      {error && (
        <Typography color="error" sx={{ fontFamily: `"JetBrains Mono", monospace` }}>
          {error}
        </Typography>
      )}

      {!loading && !error && (
        <Stack spacing={2.2}>
          {visible.map((p) => {
            const isOpen = !!expanded[p.title];

            return (
              <Card key={p.title}>
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

                        <IconButton
                          onClick={() => toggleExpand(p.title)}
                          aria-label="Toggle README"
                        >
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
                      {p.markdown ? <Markdown markdown={p.markdown} /> : "No README"}
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
          })}

          {hasMore && (
            <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
              <Button onClick={showMore} endIcon={<ExpandMoreIcon />}>
                Show more projects
              </Button>
            </Box>
          )}
        </Stack>
      )}
    </Section>
  );
}

export default GithubProjects;
