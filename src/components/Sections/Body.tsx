import { type ReactNode } from "react";
import Experiences from "../Experiences";
import Projects from "../Projects";
import Toolbox from "../Toolbox";
import { Box } from "@mui/material";

function Body(): ReactNode {
  return <Box
    sx={{
      width: "80%",
      mx: "auto",
    }}
  >
    <Projects />
    <Experiences />
    <Toolbox />
  </Box>
}

export default Body;
