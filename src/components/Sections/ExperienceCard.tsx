import { Card, CardContent, Typography, Stack, Chip } from "@mui/material";
import type { JobExperience } from "./Experiences";
import { monoComment } from "../../themes/Themes";

interface ExperienceCardProps {
  job: JobExperience;
}

function ExperienceCard(props: ExperienceCardProps) {
  return (
    <Card key={`${props.job.company}-${props.job.title}`}>
      <CardContent>
        <Typography
          variant="overline"
          sx={{
            display: "block",
            mb: 0.5,
            fontFamily: `"JetBrains Mono", monospace`,
          }}
        >
          {props.job.when}
        </Typography>

        <Typography variant="h5">{props.job.title}</Typography>

        <Typography variant="subtitle2" sx={{ mb: 2 }} color={monoComment}>
          {props.job.company}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ whiteSpace: "pre-line", mb: 2 }}
        >
          {props.job.desc}
        </Typography>

        {/* Tech stack */}
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          sx={{ mt: 1.6 }}
        >
          {props.job.techStack.map((tech) => (
            <Chip key={tech} label={tech} size="small" variant="outlined" />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ExperienceCard;
