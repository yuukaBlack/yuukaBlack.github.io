import type { TypeName } from "./const";

export interface BlogItem {
  content: string;
  data: {
    tag: TypeName;
    title: string;
    date: string;
  };
  isEmpty: boolean;
  excerpt: string;
}
