import { Box, Stack, Typography } from "@mui/material";

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Box id={id} sx={{ py: { xs: 6, md: 8 } }}>
      <Stack spacing={1.2} sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </Stack>
      {children}
    </Box>
  );
}

export default Section;