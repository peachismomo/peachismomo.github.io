import { useMemo, useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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

const PAGE_SIZE = 3;

function Experiences() {
  const experiences = useMemo(() => ReadJson<JobExperience>(JobExperiences), []);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visible = experiences.slice(0, visibleCount);
  const hasMore = visibleCount < experiences.length;

  const showMore = () => {
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, experiences.length));
  };

  return (
    <Section id="experience" title="Experience" subtitle="A quick changelog of what I've done.">
      <Stack spacing={2}>
        {visible.map((it) => (
          <ExperienceCard key={`${it.company}-${it.title}-${it.when}`} job={it} />
        ))}

        {hasMore && (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
            <Button onClick={showMore} endIcon={<ExpandMoreIcon />}>
              Show more
            </Button>
          </Box>
        )}
      </Stack>
    </Section>
  );
}

export default Experiences;
