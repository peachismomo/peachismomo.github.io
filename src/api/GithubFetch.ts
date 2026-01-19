import type { ProjectProps } from "../types/types";

async function fetchPublicRepos(username: string): Promise<ProjectProps[]> {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos`,
  );
  // const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch: ${response.status} ${response.statusText}`,
    );
  }

  const data: ProjectProps[] = await response.json();
  return data;
}

async function fetchPublicReposReadme(
  owner: string,
  repo: string,
): Promise<string | null> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/readme`,
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  try {
    const readme = atob(data.content); // decode base64 content
    console.log(readme);
    return readme;
  } catch {
    return null;
  }
}

export async function FetchProjects(): Promise<ProjectProps[]> {
  const repos = await fetchPublicRepos("peachismomo");
  const projectsWithMarkdown = await Promise.all(
    repos.map(async (repo) => {
      const markdown = await fetchPublicReposReadme("peachismomo", repo.name);
      return { ...repo, markdown };
    }),
  );
  return projectsWithMarkdown;
}
