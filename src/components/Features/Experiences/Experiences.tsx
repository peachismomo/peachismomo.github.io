import { Stack } from "@mui/material";
import type { ReactNode } from "react";
import type { ExperienceProps } from "../../../types/types";
import { ReadJson } from "../../../utils/JsonParser";
import ExperienceCard from "./ExperienceCard";

import experienceData from "../../../assets/json/JobExperiences.json";

function Experiences(): ReactNode {
  const experiences = ReadJson<ExperienceProps>(experienceData);

  return (
    <Stack spacing={"5vh"}>
      {experiences.map((job, idx) => {
        return (
          <div key={idx}>
            <ExperienceCard {...job}></ExperienceCard>
          </div>
        );
      })}
    </Stack>
  );
}

export default Experiences;
