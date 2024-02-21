import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

let allBlogs = [];

let tagBlogs = {
  life: [],
  skill: []
};

const docsDir = 'src/doc';
const files = fs.readdirSync(docsDir);
const result = [];
files.forEach(file => {
  const filePath = path.join(docsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const parsed = matter(content);
  result.push(parsed)
})
allBlogs = result

Object.values(allBlogs).forEach((blog) => {
  tagBlogs[blog.data.tag].push(blog);
})

fs.writeFileSync('src/build/data.ts', `export const allBlogs = ${JSON.stringify(allBlogs)}\n\nexport const tagBlogs = ${JSON.stringify(tagBlogs)}\n`);