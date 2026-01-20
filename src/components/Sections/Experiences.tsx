import { Stack } from "@mui/material";
import Section from "../Generic/Section";
import JobExperiences from "../../assets/json/JobExperiences.json";
import { ReadJson } from "../../utils/JsonParser";
import ExperienceCard from "./ExperienceCard";

export interface JobExperience {
  title: string;
  company: string;
  desc: string;
  when: string;
  techStack: string[];
}

function Experiences() {
  const experiences = ReadJson<JobExperience>(JobExperiences);

  return (
    <Section
      id="experience"
      title="Experience"
      subtitle="A quick changelog of what I've done."
    >
      <Stack spacing={2}>
        {experiences.map((it) => (
          <ExperienceCard job={it} />
        ))}
      </Stack>
    </Section>
  );
}

export default Experiences;
