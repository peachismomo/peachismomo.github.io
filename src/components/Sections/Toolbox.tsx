import { Box, Card, CardContent, Typography, Stack, Chip } from "@mui/material";
import Section from "../Generic/Section";
import toolboxData from "../../assets/json/toolbox.json";

function Toolbox() {
  const { groups } = toolboxData as {
    groups: { title: string; items: string[] }[];
  };

  return (
    <Section
      id="toolbox"
      title="Toolbox"
      subtitle="The stuff I actually use to ship work."
    >
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
        }}
      >
        {groups.map((g) => (
          <Card key={g.title}>
            <CardContent>
              <Typography fontWeight={800}>{g.title}</Typography>
              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                flexWrap="wrap"
                sx={{ mt: 1.5 }}
              >
                {g.items.map((it) => (
                  <Chip
                    key={it}
                    label={it}
                    size="small"
                    variant="outlined"
                    sx={{ fontFamily: `"JetBrains Mono", monospace` }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Section>
  );
}

export default Toolbox;
