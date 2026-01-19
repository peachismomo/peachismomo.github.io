import { Stack } from "@mui/material";
import { type ReactNode, useRef, useEffect, useMemo } from "react";
import { useElementContext, useTabContext } from "../../context/useTabContext";
import { useSectionObserver } from "../../hooks/SectionObserver";
import AboutMe from "../Features/AboutMe";
import Experiences from "../Features/Experiences/Experiences";
import Projects from "../Features/Projects/Projects";

function Body(): ReactNode {
  const elementsContext = useElementContext();
  const tabContext = useTabContext();

  const aboutRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const refs = useMemo(() => [aboutRef, experienceRef, projectsRef], []);

  useEffect(() => {
    elementsContext.setElements(refs);
  }, [elementsContext, refs]);

  useSectionObserver(
    refs,
    tabContext.setCurrentIndex,
    tabContext.suppressObserver,
  );

  return (
    <Stack spacing={"8vh"} sx={{ mb: "5vh" }}>
      <div ref={aboutRef}>
        <AboutMe />
      </div>
      <div ref={experienceRef}>
        <Experiences />
      </div>
      <div ref={projectsRef}>
        <Projects />
      </div>
    </Stack>
  );
}

export default Body;
