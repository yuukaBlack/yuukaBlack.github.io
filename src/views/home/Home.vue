<template>
  <div class="flex-center">
    <el-avatar :size="80" :src="circleUrl" />
    <div class="desc">This is Yuuka</div>
  </div>
</template>

<script setup lang="ts">
import circleUrl from '../../assets/rich.jpg';
import { allBlogs, tagBlogs } from '@/build/data.js'


console.log(11, allBlogs, tagBlogs)
</script>

<style lang="scss" scoped>
.flex-center {
  width: 300px;
  margin: 30px auto;
}
.desc {
  width: 300px;
  color: white;
  padding: 15px 30px;
  background: rgb(10, 71, 10);
  margin-top: 30px;
  text-align: center;
}
</style>