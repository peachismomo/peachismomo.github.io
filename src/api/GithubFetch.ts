import type { ProjectType } from "../types/types";

const IS_PROD = import.meta.env.PROD;
const GH_TOKEN = !IS_PROD
  ? (import.meta.env.VITE_GH_TOKEN as string | undefined)
  : undefined;

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  updated_at: string;
}

function ghFetch(input: string, init?: RequestInit) {
  return fetch(input, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...(GH_TOKEN ? { Authorization: `Bearer ${GH_TOKEN}` } : {}),
      Accept: "application/vnd.github+json",
    },
  });
}

async function fetchPublicRepos(
  username: string,
  page: number,
  perPage: number,
): Promise<GitHubRepo[]> {
  const response = await ghFetch(
    `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`,
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
  const urls = [
    `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`,
    `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`,
    `https://raw.githubusercontent.com/${owner}/${repo}/master/readme.md`,
    `https://raw.githubusercontent.com/${owner}/${repo}/main/readme.md`,
  ];

  for (const url of urls) {
    const res = await fetch(url);
    if (res.ok) return await res.text(); // proper UTF-8
  }
  return null;
}

function extractTags(repo: GitHubRepo): string[] {
  const tags = new Set<string>();

  if (repo.language) tags.add(repo.language);
  if (Array.isArray(repo.topics)) repo.topics.forEach((t) => tags.add(t));

  return [...tags];
}

export async function FetchReadme(
  owner: string,
  repo: string,
): Promise<string | null> {
  return fetchPublicReposReadme(owner, repo);
}

export async function FetchProjectsPage(
  username: string,
  page: number,
  perPage: number,
): Promise<ProjectType[]> {
  const repos = await fetchPublicRepos(username, page, perPage);

  return repos.map((repo) => ({
    title: repo.name,
    desc: repo.description ?? "",
    tags: extractTags(repo),
    htmlUrl: repo.html_url,
    homepage: repo.homepage,
    markdown: null,
    language: repo.language ?? null,
    topics: repo.topics ?? [],
    updatedAt: repo.updated_at,
  })) satisfies ProjectType[];
}
