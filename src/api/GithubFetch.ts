import type { ProjectType } from "../types/types";

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  updated_at: string;
}

interface GitHubReadmeResponse {
  content: string; // base64
}

async function fetchPublicRepos(username: string): Promise<GitHubRepo[]> {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as GitHubRepo[];
}

async function fetchPublicReposReadme(
  owner: string,
  repo: string,
): Promise<string | null> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/readme`,
  );
  if (!response.ok) return null;

  const data = (await response.json()) as GitHubReadmeResponse;

  try {
    return atob(data.content);
  } catch {
    return null;
  }
}

function extractTags(repo: GitHubRepo): string[] {
  const tags = new Set<string>();

  if (repo.language) tags.add(repo.language);
  if (Array.isArray(repo.topics)) repo.topics.forEach((t) => tags.add(t));

  return [...tags];
}

export async function FetchProjects(
  username = "peachismomo",
): Promise<ProjectType[]> {
  const repos = await fetchPublicRepos(username);

  const projects = await Promise.all(
    repos.map(async (repo) => {
      const markdown = await fetchPublicReposReadme(username, repo.name);

      return {
        title: repo.name,
        desc: repo.description ?? "",
        tags: extractTags(repo),
        htmlUrl: repo.html_url,
        homepage: repo.homepage,
        markdown,
        language: repo.language ?? null,
        topics: repo.topics ?? [],
        updatedAt: repo.updated_at,
      } satisfies ProjectType;
    }),
  );

  return projects;
}
