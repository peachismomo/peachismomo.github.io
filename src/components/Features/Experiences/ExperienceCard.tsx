import { Card, Grid, Stack, Typography } from "@mui/material";
import { type ReactNode } from "react";
import type { ExperienceProps } from "../../../types/types";
import { formatJobDates } from "../../../utils/DateFormat";

function ExperienceCard(props: ExperienceProps): ReactNode {
  return (
    <Card sx={{ padding: "30px" }}>
      <Grid container>
        <Grid size={3.5} sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="subtitle1">
            {formatJobDates(props.dateStart, props.dateEnd)}
          </Typography>
        </Grid>
        <Grid size={0.5} />
        <Grid size={"grow"}>
          <Stack>
            <Typography variant="h6" sx={{ pb: 2 }}>
              {props.title}
            </Typography>
            <Typography variant="subtitle1" sx={{ pb: 2, color: "grey.500" }}>
              {props.company}
            </Typography>
            <Typography variant="body1">{props.description}</Typography>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}

export default ExperienceCard;
