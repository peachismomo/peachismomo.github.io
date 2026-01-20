export type ProjectType = {
  title: string;
  desc: string;
  tags: string[];
  htmlUrl: string;
  homepage?: string | null;
  markdown?: string | null;
  language?: string | null;
  topics?: string[];
  updatedAt?: string;
};