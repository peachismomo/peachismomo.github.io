import { type ReactNode } from "react";
import Experiences from "./Sections/Experiences";
import GithubProjects from "./Sections/GithubProjects";
import Toolbox from "./Sections/Toolbox";
import { Box } from "@mui/material";

function Body(): ReactNode {
  return (
    <Box
      sx={{
        width: "80%",
        mx: "auto",
      }}
    >
      <Experiences />
      <GithubProjects />
      <Toolbox />
    </Box>
  );
}

export default Body;
