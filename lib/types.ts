export type Project = {
  slug: string;
  title: string;
  oneLiner: string;
  hykon: boolean;
  order: number;
  tech: string[];
  links: {
    github?: string;
    live?: string;
  };
};

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
};
