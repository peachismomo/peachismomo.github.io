import { type ReactNode } from "react";
import Experiences from "./Sections/Experiences";
import GithubProjects from "./Sections/GithubProjects";
import Toolbox from "./Sections/Toolbox";
import { Box } from "@mui/material";
import FeaturedProjects from "./Sections/Projects";

function Body(): ReactNode {
  return (
    <Box
      sx={{
        width: "80%",
        mx: "auto",
      }}
    >
      <Experiences />
      <FeaturedProjects />
      <GithubProjects />
      <Toolbox />
    </Box>
  );
}

export default Body;
