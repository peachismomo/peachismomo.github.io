import { Stack, Card, CardContent, Typography, Chip } from "@mui/material";
import Section from "./Generic/Section";
import JobExperiences from "../assets/json/JobExperiences.json";
import { ReadJson } from "../utils/JsonParser";
import { monoPurple } from "../themes/Themes";

type JobExperience = {
  title: string;
  company: string;
  desc: string;
  when: string;
  techStack: string[];
};

function Experiences() {
  const experiences = ReadJson<JobExperience>(JobExperiences);

  return (
    <Section id="experience" title="Experience" subtitle="A quick changelog of what I've done.">
      <Stack spacing={2}>
        {experiences.map((it) => (
          <Card key={`${it.company}-${it.title}`}>
            <CardContent>
              <Typography
                variant="overline"
                sx={{
                  display: "block",
                  mb: 0.5,
                  fontFamily: `"JetBrains Mono", monospace`,
                }}
              >
                {it.when}
              </Typography>

              <Typography variant="h5" color={monoPurple}>
                {it.title} · {it.company}
              </Typography>

              <Typography variant="body2" sx={{ mt: 0.8 }}>
                {it.desc}
              </Typography>

              {/* Tech stack */}
              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                flexWrap="wrap"
                sx={{ mt: 1.6 }}
              >
                {it.techStack.map((tech) => (
                  <Chip
                    key={tech}
                    label={tech}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontFamily: `"JetBrains Mono", monospace`,
                      borderColor: "divider",
                      color: "text.secondary",
                    }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Section>
  );
}

export default Experiences;
