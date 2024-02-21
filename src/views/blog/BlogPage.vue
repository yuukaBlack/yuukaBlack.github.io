<template>
  <div class="main">
    <div class="blog">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="route.query.type" :to="{ path: '/list', query: { type: route.query.type } }">{{ typeName }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ data?.data.title }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="title">{{ data?.data.title }}</div>
      <div class="date">{{ data?.data.date }}</div>
      <div v-html="blog" class="blog-md"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { allBlogs } from '../../build/data'
import { computed } from 'vue';
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it';
import type { BlogItem } from '../../types/index';
import { TypeName } from '../../types/const';

const md = new MarkdownIt({
  html: true
});

const route = useRoute();
const data = computed(() => {
  const date = route.query.d
  const data = allBlogs.find((item: BlogItem) => item.data.date === date);
  return data;
})
const blog = computed(() => {
  const html = md.render(data.value?.content);
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
}
.date {
  font-size: 13px;
  color: rgb(108, 108, 108);
  margin-bottom: 20px;
}
.blog-md {
  background-color: white;
  border-radius: 8px;
  padding: 15px 20px;
}
:deep(h2) {
  margin-bottom: 10px;
}

@media (max-width: 768px) {
   .blog {
    width: 90vw;
  }
}
</style>