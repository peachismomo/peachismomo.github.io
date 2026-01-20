import { type ReactNode } from "react";
import Experiences from "./Sections/Experiences";
import Projects from "./Sections/Projects";
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
      <Projects />
      <Experiences />
      <Toolbox />
    </Box>
  );
}

export default Body;
