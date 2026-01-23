import * as React from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export type MediaItem =
  | { kind: "image"; src: string; alt?: string }
  | { kind: "youtube"; youtubeId: string; alt?: string };

function clampIndex(i: number, len: number) {
  if (len <= 0) return 0;
  return ((i % len) + len) % len; // wrap
}

export function MediaLightbox(props: {
  items: MediaItem[];
  open: boolean;
  initialIndex: number;
  onClose: () => void;
  title?: string;
}) {
  const { items, open, initialIndex, onClose, title } = props;

  const [index, setIndex] = React.useState(() =>
    clampIndex(initialIndex, items.length),
  );

  // When opened / initialIndex changes, sync current index
  React.useEffect(() => {
    if (!open) return;
    setIndex(clampIndex(initialIndex, items.length));
  }, [open, initialIndex, items.length]);

  const prev = React.useCallback(() => {
    setIndex((i) => clampIndex(i - 1, items.length));
  }, [items.length]);

  const next = React.useCallback(() => {
    setIndex((i) => clampIndex(i + 1, items.length));
  }, [items.length]);

  const current = items[index];

  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, prev, next]);

  const showNav = items.length > 1;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          bgcolor: "rgba(0,0,0,0.92)",
        },
      }}
    >
      <DialogContent
        sx={{
          p: { xs: 2, md: 3 },
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Top bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            {title && (
              <Typography
                variant="subtitle1"
                sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 700 }}
                noWrap
              >
                {title}
              </Typography>
            )}
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.6)" }}
            >
              {items.length ? `${index + 1} / ${items.length}` : ""}
            </Typography>
          </Box>

          <IconButton
            onClick={onClose}
            aria-label="Close"
            sx={{ color: "rgba(255,255,255,0.85)" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content area */}
        <Box
          sx={{
            position: "relative",
            flex: 1,
            display: "grid",
            placeItems: "center",
            minHeight: 0,
          }}
        >
          {/* Left nav */}
          {showNav && (
            <IconButton
              onClick={prev}
              aria-label="Previous"
              sx={{
                position: "absolute",
                left: { xs: 8, md: 16 },
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(255,255,255,0.9)",
                bgcolor: "rgba(0,0,0,0.35)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.55)" },
              }}
            >
              <ChevronLeftIcon fontSize="large" />
            </IconButton>
          )}

          {/* Right nav */}
          {showNav && (
            <IconButton
              onClick={next}
              aria-label="Next"
              sx={{
                position: "absolute",
                right: { xs: 8, md: 16 },
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(255,255,255,0.9)",
                bgcolor: "rgba(0,0,0,0.35)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.55)" },
              }}
            >
              <ChevronRightIcon fontSize="large" />
            </IconButton>
          )}

          {/* Media */}
          {current?.kind === "image" ? (
            <Box
              component="img"
              src={current.src}
              alt={current.alt ?? "Image"}
              sx={{
                maxWidth: "92vw",
                maxHeight: "78vh",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "rgba(255,255,255,0.15)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                userSelect: "none",
              }}
            />
          ) : current?.kind === "youtube" ? (
            <Box
              sx={{
                width: "min(1100px, 92vw)",
                aspectRatio: "16 / 9",
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "rgba(255,255,255,0.15)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                bgcolor: "black",
              }}
            >
              <Box
                component="iframe"
                title={current.alt ?? "YouTube video"}
                src={`https://www.youtube.com/embed/${current.youtubeId}?autoplay=1&rel=0`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                sx={{ width: "100%", height: "100%", border: 0 }}
              />
            </Box>
          ) : null}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
