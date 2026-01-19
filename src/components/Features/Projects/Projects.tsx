import { useEffect, useState, type ReactNode } from "react";
import { FetchProjects } from "../../../api/GithubFetch";
import { type ProjectProps } from "../../../types/types";
import { Backdrop, CircularProgress, Stack } from "@mui/material";
import Project from "./ProjectCard";

function Projects(): ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<ProjectProps[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        await new Promise((f) => setTimeout(f, 1000));
        setProjects(await FetchProjects());
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProjects();
  }, []);

  if (isLoading) {
    // backdrop tints the background
    return (
      <Backdrop open={true}>
        <CircularProgress />
      </Backdrop>
    );
  }

  return (
    <Stack spacing={"1vh"}>
      {projects.map((project, idx) => {
        if (project.html_url && !project.html_url?.includes("https://"))
          project.html_url = "https://" + project.html_url;
        return (
          <div key={idx}>
            <Project {...project} />
          </div>
        );
      })}
    </Stack>
  );
}

export default Projects;
