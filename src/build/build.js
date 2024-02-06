import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

let allBlogs = new Object();

let tagBlogs = {
  life: new Object(),
  skill: new Object()
};

const docsDir = 'src/doc';
const files = fs.readdirSync(docsDir);
const result = new Map();
files.forEach(file => {
  const filePath = path.join(docsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const parsed = matter(content);
  result[parsed.data.date] = parsed
})
allBlogs = result

Object.values(allBlogs).forEach((blog) => {
  tagBlogs[blog.data.tag][blog.data.date] = blog;
})

fs.writeFileSync('src/build/data.js', `export const allBlogs = ${JSON.stringify(allBlogs)}\n\nexport const tagBlogs = ${JSON.stringify(tagBlogs)}\n`);