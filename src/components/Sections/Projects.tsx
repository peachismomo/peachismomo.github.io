import {
  Stack,
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  CardActions,
  Button,
  Collapse,
  Divider,
} from "@mui/material";
import Section from "../Generic/Section";
import projectsData from "../../assets/json/projects.json";
import { ReadJson } from "../../utils/JsonParser";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useMemo, useState } from "react";
import { MediaLightbox, type MediaItem } from "./MediaLightbox"; // adjust path if needed

interface Project {
  slug: string;
  name: string;
  shortDescription?: string;
  fullDescription?: string;
  when: string;
  techStack: string[];
  headerImage?: {
    src: string;
    alt?: string;
  };
  additionalImages?: {
    src?: string;
    alt?: string;
    youtubeId?: string;
  }[];
}

function renderRichText(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Box
          key={i}
          component="span"
          sx={{
            fontWeight: 800,
            color: "text.primary",
            letterSpacing: "0.01em",
          }}
        >
          {part.slice(2, -2)}
        </Box>
      );
    }
    return part;
  });
}

function getPublicAssetUrl(project: Project, assetFileName?: string) {
  if (!assetFileName) return "";
  const file = assetFileName.startsWith("/")
    ? assetFileName.slice(1)
    : assetFileName;
  return `/${project.slug}/${file}`;
}

// TS-friendly builder: always returns MediaItem[] (never nulls)
function buildMediaItems(project: Project): MediaItem[] {
  const items: MediaItem[] = [];

  if (project.headerImage?.src) {
    items.push({
      kind: "image",
      src: getPublicAssetUrl(project, project.headerImage.src),
      alt: project.headerImage.alt ?? project.name,
    });
  }

  for (const m of project.additionalImages ?? []) {
    if (m.youtubeId) {
      items.push({
        kind: "youtube",
        youtubeId: m.youtubeId,
        alt: m.alt,
      });
      continue;
    }

    if (m.src) {
      items.push({
        kind: "image",
        src: getPublicAssetUrl(project, m.src),
        alt: m.alt,
      });
    }
  }

  return items;
}

const PAGE_SIZE = 3;

function FeaturedProjects() {
  const allProjects = useMemo(() => ReadJson<Project>(projectsData), []);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItems, setLightboxItems] = useState<MediaItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxTitle, setLightboxTitle] = useState<string | undefined>(
    undefined,
  );

  const openLightbox = (title: string, items: MediaItem[], index: number) => {
    if (!items.length) return;
    const safeIndex = Math.max(0, Math.min(index, items.length - 1));
    setLightboxTitle(title);
    setLightboxItems(items);
    setLightboxIndex(safeIndex);
    setLightboxOpen(true);
  };

  const toggle = (name: string) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const visibleProjects = allProjects.slice(0, visibleCount);
  const hasMore = visibleCount < allProjects.length;

  const showMore = () => {
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, allProjects.length));
  };

  const onThumbKeyDown = (openFn: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFn();
    }
  };

  return (
    <Section
      id="projects"
      title="Academic/Personal Projects"
      subtitle="A curated selection of systems, engines, and graphics work in C++."
    >
      <Stack spacing={2.2}>
        {visibleProjects.map((p) => {
          const isOpen = !!expanded[p.name];

          const headerUrl = p.headerImage?.src
            ? getPublicAssetUrl(p, p.headerImage.src)
            : "";

          const mediaItems = buildMediaItems(p);

          const openAtHeader = () => openLightbox(p.name, mediaItems, 0);

          return (
            <Card key={p.name}>
              <CardContent>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  alignItems="stretch"
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="overline"
                      sx={{
                        display: "block",
                        mb: 0.5,
                        fontFamily: `"JetBrains Mono", monospace`,
                      }}
                    >
                      {p.when}
                    </Typography>

                    <Typography variant="h5" fontWeight={700}>
                      {p.name}
                    </Typography>

                    {p.shortDescription && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {p.shortDescription}
                      </Typography>
                    )}

                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap
                      flexWrap="wrap"
                      sx={{ mt: 2 }}
                    >
                      {p.techStack.map((t) => (
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

                  {p.headerImage && (
                    <Box
                      role="button"
                      tabIndex={0}
                      onClick={openAtHeader}
                      onKeyDown={onThumbKeyDown(openAtHeader)}
                      sx={{
                        width: { xs: "100%", md: 340 },
                        aspectRatio: "16 / 9",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                        overflow: "hidden",
                        position: "relative",
                        cursor: "pointer",
                        outline: "none",
                      }}
                    >
                      <Box
                        component="img"
                        src={headerUrl}
                        alt={p.headerImage.alt ?? p.name}
                        loading="lazy"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </Box>
                  )}
                </Stack>

                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <Divider sx={{ my: 2 }} />

                  {p.fullDescription && (
                    <Typography
                      variant="body2"
                      sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}
                    >
                      {renderRichText(p.fullDescription)}
                    </Typography>
                  )}

                  {!!p.additionalImages?.length && (
                    <Stack spacing={1.5} sx={{ mt: 2 }}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ fontFamily: `"JetBrains Mono", monospace` }}
                      >
                        Additional Media
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1.5}
                        useFlexGap
                        flexWrap="wrap"
                      >
                        {(p.additionalImages ?? []).map((img) => {
                          // Find the index in mediaItems for this thumb
                          const idx = img.youtubeId
                            ? mediaItems.findIndex(
                                (x) =>
                                  x.kind === "youtube" &&
                                  x.youtubeId === img.youtubeId,
                              )
                            : img.src
                              ? mediaItems.findIndex(
                                  (x) =>
                                    x.kind === "image" &&
                                    x.src === getPublicAssetUrl(p, img.src),
                                )
                              : -1;

                          const openAt = () =>
                            openLightbox(p.name, mediaItems, Math.max(0, idx));

                          if (img.youtubeId) {
                            const thumb = `https://img.youtube.com/vi/${img.youtubeId}/hqdefault.jpg`;

                            return (
                              <Box
                                key={`yt:${img.youtubeId}`}
                                role="button"
                                tabIndex={0}
                                onClick={openAt}
                                onKeyDown={onThumbKeyDown(openAt)}
                                sx={{
                                  width: { xs: "100%", sm: 260 },
                                  aspectRatio: "16 / 9",
                                  borderRadius: 2,
                                  border: "1px solid",
                                  borderColor: "divider",
                                  overflow: "hidden",
                                  bgcolor: "background.paper",
                                  position: "relative",
                                  display: "block",
                                  cursor: "pointer",
                                  outline: "none",
                                }}
                              >
                                <Box
                                  component="img"
                                  src={thumb}
                                  alt={img.alt ?? "YouTube video"}
                                  loading="lazy"
                                  sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                  }}
                                />
                                <Box
                                  sx={{
                                    position: "absolute",
                                    inset: 0,
                                    display: "grid",
                                    placeItems: "center",
                                    bgcolor: "rgba(0,0,0,0.25)",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 48,
                                      height: 48,
                                      borderRadius: "50%",
                                      bgcolor: "rgba(0,0,0,0.6)",
                                      display: "grid",
                                      placeItems: "center",
                                    }}
                                  >
                                    <Box
                                      component="span"
                                      sx={{
                                        width: 0,
                                        height: 0,
                                        borderTop: "8px solid transparent",
                                        borderBottom: "8px solid transparent",
                                        borderLeft: "12px solid white",
                                        ml: 0.5,
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </Box>
                            );
                          }

                          if (img.src) {
                            const url = getPublicAssetUrl(p, img.src);

                            return (
                              <Box
                                key={`img:${img.src}`}
                                role="button"
                                tabIndex={0}
                                onClick={openAt}
                                onKeyDown={onThumbKeyDown(openAt)}
                                sx={{
                                  width: { xs: "100%", sm: 260 },
                                  aspectRatio: "16 / 9",
                                  borderRadius: 2,
                                  border: "1px solid",
                                  borderColor: "divider",
                                  overflow: "hidden",
                                  bgcolor: "background.paper",
                                  cursor: "pointer",
                                  outline: "none",
                                }}
                              >
                                <Box
                                  component="img"
                                  src={url}
                                  alt={img.alt ?? "Project image"}
                                  loading="lazy"
                                  sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                  }}
                                />
                              </Box>
                            );
                          }

                          return null;
                        })}
                      </Stack>
                    </Stack>
                  )}
                </Collapse>
              </CardContent>

              <CardActions sx={{ px: 2, pb: 2 }}>
                {(p.fullDescription ||
                  (p.additionalImages?.length ?? 0) > 0) && (
                  <Button
                    size="small"
                    onClick={() => toggle(p.name)}
                    endIcon={isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  >
                    {isOpen ? "Show less" : "Expand more"}
                  </Button>
                )}
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

      <MediaLightbox
        open={lightboxOpen}
        items={lightboxItems}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        title={lightboxTitle}
      />
    </Section>
  );
}

export default FeaturedProjects;
