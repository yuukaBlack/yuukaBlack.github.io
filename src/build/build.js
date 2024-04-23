import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv'
 
let allBlogs = [];

let tagBlogs = {};

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

const imagePath = process.env.VUE_IMAGES_PATH

files.forEach(file => {
  if(file !== 'image') {
    const filePath = path.join(docsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let pattern = /!\[.*?\]\(image\/.*?\)/g;
    content = content.replace(pattern, function(match) {
      return match.replace('image', imagePath);
    });
    const parsed = matter(content);
    result.push(parsed)
  }
})
allBlogs = result

Object.values(allBlogs).forEach((blog) => {
  if (tagBlogs[blog.data.tag]) {
    tagBlogs[blog.data.tag]?.push(blog)
  } else {
    tagBlogs[blog.data.tag] = [blog]
  }
})

fs.writeFileSync('src/build/data.ts', `export const allBlogs = ${JSON.stringify(allBlogs)}\n\nexport const tagBlogs = ${JSON.stringify(tagBlogs)}\n`);