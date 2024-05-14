<template>
  <div class="main">
    <div class="head">
      <el-avatar :size="80" :src="circleUrl" />
      <div class="desc">
        <div>Hey</div>
        <div>Welcome to my blog</div>
      </div>
    </div>
    <BlogTable :list="list"></BlogTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import circleUrl from '../../assets/rich.jpg';
import { allBlogs } from '../../build/data'
import BlogTable from '../../components/BlogTable.vue'
import type { BlogItem } from '../../types';

const list = ref(allBlogs  as unknown as BlogItem[]);

</script>

<style lang="scss" scoped>
.head {
  width: 60vw;
  margin: 0 auto;
  padding: 70px 0;
  text-align: center;
}
.desc {
  font-size: 26px;
  color: white;
  margin-top: 50px;
  text-align: left;
  > div {
    font-weight: 700 !important;
  }
}
@media (max-width: 768px) {
  .head {
    width: 90vw;
  }
}
</style>