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

function getPublicAssetUrl(project: Project, assetFileName: string) {
  const file = assetFileName.startsWith("/")
    ? assetFileName.slice(1)
    : assetFileName;
  return `/${project.slug}/${file}`;
}

const PAGE_SIZE = 3;

function FeaturedProjects() {
  const allProjects = useMemo(() => ReadJson<Project>(projectsData), []);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const toggle = (name: string) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const visibleProjects = allProjects.slice(0, visibleCount);
  const hasMore = visibleCount < allProjects.length;

  const showMore = () => {
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, allProjects.length));
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
          const headerUrl = p.headerImage
            ? getPublicAssetUrl(p, p.headerImage.src)
            : "";

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
                      sx={{
                        width: { xs: "100%", md: 340 },
                        aspectRatio: "16 / 9",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                        overflow: "hidden",
                        position: "relative",
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
                        {p.additionalImages.map((img) => {
                          if (img.youtubeId) {
                            const thumb = `https://img.youtube.com/vi/${img.youtubeId}/hqdefault.jpg`;
                            const link = `https://www.youtube.com/watch?v=${img.youtubeId}`;

                            return (
                              <Box
                                key={`yt:${img.youtubeId}`}
                                component="a"
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  width: { xs: "100%", sm: 260 },
                                  aspectRatio: "16 / 9",
                                  borderRadius: 2,
                                  border: "1px solid",
                                  borderColor: "divider",
                                  overflow: "hidden",
                                  bgcolor: "background.paper",
                                  position: "relative",
                                  textDecoration: "none",
                                  display: "block",
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
                                sx={{
                                  width: { xs: "100%", sm: 260 },
                                  aspectRatio: "16 / 9",
                                  borderRadius: 2,
                                  border: "1px solid",
                                  borderColor: "divider",
                                  overflow: "hidden",
                                  bgcolor: "background.paper",
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
    </Section>
  );
}

export default FeaturedProjects;
