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

function Projects() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

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

  const featured = useMemo(() => {
    const picked = projects.filter((p) => FEATURED_REPOS.has(p.title));
    if (picked.length) return picked;
    return [...projects].slice(0, 3);
  }, [projects]);

  const toggleExpand = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <Section
      id="projects"
      title="Featured Projects"
      subtitle="Selected C++ work — rendering, tools, systems."
    >
      {loading && (
        <Typography
          color="text.secondary"
          sx={{ fontFamily: `"JetBrains Mono", monospace` }}
        >
          Loading projects…
        </Typography>
      )}

      {error && (
        <Typography
          color="error"
          sx={{ fontFamily: `"JetBrains Mono", monospace` }}
        >
          {error}
        </Typography>
      )}

      {!loading && !error && (
        <Stack spacing={2.2}>
          {featured.map((p) => {
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

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
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

                    {/* Media slot */}
                    {/* <Box
                      sx={{
                        width: { xs: "100%", md: 340 },
                        aspectRatio: "16 / 9",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                        display: "grid",
                        placeItems: "center",
                        color: "text.secondary",
                        fontFamily: `"JetBrains Mono", monospace`,
                        fontSize: 12,
                        p: 2,
                        overflow: "hidden",
                      }}
                    >
                      Media Preview
                    </Box> */}
                  </Stack>

                  {/* Expandable README */}
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
                        // optional: make markdown images behave
                        "& img": { maxWidth: "100%" },
                      }}
                    >
                      {p.markdown ? (
                        <Markdown markdown={p.markdown} />
                      ) : (
                        "No README"
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

                  {p.homepage ? (
                    <Button
                      size="small"
                      endIcon={<LaunchIcon />}
                      href={p.homepage}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visit
                    </Button>
                  ) : (
                    <></>
                  )}
                </CardActions>
              </Card>
            );
          })}
        </Stack>
      )}
    </Section>
  );
}

export default Projects;
