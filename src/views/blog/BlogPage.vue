<template>
  <div class="main">
    <div class="blog">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="route.query.type" :to="{ path: '/list', query: { type: route.query.type } }">{{ typeName }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ data?.data.title }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="title">{{ data?.data.title }} <span class="tag">{{ TypeName[data?.data.tag] }}</span></div>
      <div class="date">创建于 {{ data?.data.date }}</div>
      <div v-html="blog" class="blog-md"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { allBlogs } from '../../build/data'
import { computed } from 'vue';
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it';
import MarkdownItAnchor from 'markdown-it-anchor'
import MarkdownItToc from "markdown-it-toc-done-right"
import type { BlogItem } from '../../types/index';
import { TypeName } from '../../types/const';

const md = new MarkdownIt({
  html: true
}).use(MarkdownItAnchor, {permalink: true, permalinkBefore: true, permalinkSymbol: '#'}).use(MarkdownItToc);

const route = useRoute();
const data = computed(() => {
  const date = route.query.d as string
  const data = allBlogs.find((item: BlogItem) => item.data.date===date)
  return data;
})
const blog = computed(() => {
  const html = md.render('${toc}\n' + data.value?.content);
  return html
})
const typeName = computed(() => {
  return TypeName[route.query.type as keyof typeof TypeName]
})

</script>

<style lang="scss" scoped>
.blog {
  width: 55vw;
  margin: 0 auto;
  padding-top: 50px;
}
.title {
  font-size: 24px;
  font-weight: 600;
  margin-top: 30px;
  .tag {
    color: rgb(0, 150, 94);
    display: inline-block;
    font-size: 14px;
    padding: 0 6px;
    height: 24px;
    line-height: 24px;
    border-radius: 3px;
    background-color: rgba(0,150,94,.1);
    margin-left: 10px;
  }
}
.date {
  font-size: 13px;
  color: rgb(108, 108, 108);
  margin: 5px 0 20px;
}
.blog-md {
  background-color: white;
  border-radius: 8px;
  padding: 15px 20px;
  :deep(.table-of-contents) {
    position: fixed;
    left: 7vw;
    li {
      list-style: none;
    }
  }
}
:deep(h2) {
  margin: 16px 0;
  font-weight: 600;
}
:deep(h3) {
  margin: 10px 0;
  font-weight: 500;
}
:deep(strong) {
  font-weight: 700;
}
:deep(pre) {
  background-color: #f6f8fa;
  padding: 16px;
  margin-bottom: 15px;
}
:deep(em) {
  background-color: rgba(64, 158, 255, 0.3);
}
:deep(p) {
  margin-bottom: 15px;
}
:deep(table) {
  border-collapse: collapse;
  th, td {
    border: 1px solid silver;
    min-width: 150px;
    padding: 3px 10px;
  }
}

@media (max-width: 768px) {
   .blog {
    width: 90vw;
  }
}
</style>