<template>
  <div class="main">
    <div class="title">分类 —— {{ useTypeName() }}</div>
    <blog-table :list="list" :type="router.query.type"></blog-table>
  </div>
</template>

<script setup lang="ts">
import { tagBlogs } from '../../build/data'
import { computed } from 'vue';
import { useRoute } from 'vue-router'
import BlogTable from '../../components/BlogTable.vue'
import type { BlogItem, TagBlogType } from '../../types';
import { useTypeName } from '../../hooks/useTypeName';

const router = useRoute();

const list = computed(() => {
  const type = router.query.type
  return (type ? (tagBlogs as TagBlogType)[type as string] : []) as BlogItem[]
})

</script>

<style lang="scss" scoped>
.main {
  padding-top: 100px;
  .title {
    font-size: 26px;
    color: white;
    margin-top: 50px;
    text-align: left;
    width: 55vw;
    margin: 0 auto;
    padding: 70px 0;
    text-align: center;
  }
}
</style>