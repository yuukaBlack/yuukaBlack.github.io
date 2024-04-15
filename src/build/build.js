import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv'
 
let allBlogs = [];

let tagBlogs = {
  life: [],
  skill: []
};

const docsDir = 'src/doc';
const files = fs.readdirSync(docsDir);
const result = [];

function getConfigParam(key) {
  const params = process.argv;
  const result = params.find(param => param.includes(key));
  if (result) {
    return result.split('=')[1];
  }
  return null;
}

dotenv.config({ path: `.env.${getConfigParam('--mode')}`})

const imagesPath = process.env.VUE_IMAGES_PATH


files.forEach(file => {
  const filePath = path.join(docsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/\$\{VUE_IMAGES_PATH\}/g, imagesPath);
  const parsed = matter(content);
  result.push(parsed)
})
allBlogs = result

Object.values(allBlogs).forEach((blog) => {
  tagBlogs[blog.data.tag].push(blog);
})

fs.writeFileSync('src/build/data.ts', `export const allBlogs = ${JSON.stringify(allBlogs)}\n\nexport const tagBlogs = ${JSON.stringify(tagBlogs)}\n`);