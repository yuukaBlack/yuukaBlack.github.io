import type { TypeEnum } from "./const";

export interface BlogItem {
  content: string;
  data: {
    tag: keyof typeof TypeEnum;
    title: string;
    date: string;
  };
  isEmpty: boolean;
  excerpt: string;
}

export type TagBlogType = {
  [key: string]: BlogItem[];
};

export interface SearchItemType {
  title: string;
  content: string;
  date: string;
}
