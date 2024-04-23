<template>
  <div class="main">
    <blog-table :list="list" :type="router.query.type"></blog-table>
  </div>
</template>

<script setup lang="ts">
import { tagBlogs } from '../../build/data'
import { computed } from 'vue';
import { useRoute } from 'vue-router'
import BlogTable from '../../components/BlogTable.vue'
import type { BlogItem, TagBlogType } from '../../types';

const router = useRoute();

const list = computed(() => {
  const type = router.query.type
  return (type ? (tagBlogs as TagBlogType)[type as string] : []) as BlogItem[]
})

</script>

<style lang="scss" scoped>
.main {
  padding-top: 100px;
}
</style>