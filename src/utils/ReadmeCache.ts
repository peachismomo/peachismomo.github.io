function cacheKey(owner: string, repo: string) {
  return `readme:${owner}/${repo}`;
}

export function getCachedReadme(owner: string, repo: string): string | null {
  const raw = localStorage.getItem(cacheKey(owner, repo));
  if (!raw) return null;
  const { value, expires } = JSON.parse(raw) as {
    value: string;
    expires: number;
  };
  if (Date.now() > expires) {
    localStorage.removeItem(cacheKey(owner, repo));
    return null;
  }
  return value;
}

export function setCachedReadme(owner: string, repo: string, value: string) {
  localStorage.setItem(
    cacheKey(owner, repo),
    JSON.stringify({ value, expires: Date.now() + 1000 * 60 * 60 * 24 }), // 24h
  );
}
