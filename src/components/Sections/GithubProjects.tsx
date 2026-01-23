import { useEffect, useMemo, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Section from "../Generic/Section";
import { FetchProjectsPage } from "../../api/GithubFetch";
import type { ProjectType } from "../../types/types";
import GithubProjectCard from "./GithubProjectCard";

const FEATURED_REPOS = new Set<string>([]);
const PAGE_SIZE = 3;
const OWNER = "peachismomo";

function GithubProjects() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const first = await FetchProjectsPage(OWNER, 1, PAGE_SIZE);
        if (!alive) return;

        setProjects(first);
        setPage(1);
        setHasMore(first.length === PAGE_SIZE); // if less, likely no more
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

  const toggleExpand = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const showMore = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      setError(null);

      const nextPage = page + 1;
      const next = await FetchProjectsPage(OWNER, nextPage, PAGE_SIZE);

      setProjects((prev) => {
        const seen = new Set(prev.map((p) => p.title));
        const merged = [...prev, ...next.filter((p) => !seen.has(p.title))];
        return merged;
      });

      setPage(nextPage);
      setHasMore(next.length === PAGE_SIZE);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load more projects");
    } finally {
      setLoadingMore(false);
    }
  };

  const list = useMemo(() => {
    if (FEATURED_REPOS.size === 0) return projects;
    const picked = projects.filter((p) => FEATURED_REPOS.has(p.title));
    return picked.length ? picked : projects;
  }, [projects]);

  return (
    <Section
      id="github"
      title="GitHub"
      subtitle="Some of my projects on GitHub"
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
          {list.map((p) => (
            <GithubProjectCard
              key={p.title}
              p={p}
              owner={OWNER}
              isOpen={!!expanded[p.title]}
              onToggle={() => toggleExpand(p.title)}
            />
          ))}

          {hasMore && (
            <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
              <Button
                onClick={showMore}
                endIcon={<ExpandMoreIcon />}
                disabled={loadingMore}
              >
                {loadingMore ? "Loading…" : "Show more projects"}
              </Button>
            </Box>
          )}
        </Stack>
      )}
    </Section>
  );
}

export default GithubProjects;
