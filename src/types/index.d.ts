import type { TypeName } from "./const";

export interface BlogItem {
  content: string;
  data: {
    tag: keyof typeof TypeName;
    title: string;
    date: string;
  };
  isEmpty: boolean;
  excerpt: string;
}
