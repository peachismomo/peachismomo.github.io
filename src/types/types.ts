export interface ProjectProps {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  private: boolean;
  markdown: string | null;
}

export interface ExperienceProps {
  title: string;
  company: string;
  description: string;
  dateStart: Date;
  dateEnd?: Date;
  techStack: string[];
  img?: string;
}
