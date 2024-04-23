<template>
  <el-menu
    :default-active="activeIndex"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="/">
      Yuuka
    </el-menu-item>
    <a class="github" href="https://github.com/yuukaBlack" target="_blank"><img :src="github"></a>
    <div class="flex-grow" />
    <el-menu-item index="home">首页</el-menu-item>
    <el-sub-menu index="list">
      <template #title>分类</template>
      <el-menu-item v-for="([key, value]) in typeEnumEntries" :key="key" :index="key">
        {{ value }}（{{ tagBlogsCount[key] }}）
      </el-menu-item>
    </el-sub-menu>
    <el-menu-item index="about">关于</el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import github from '../assets/github.svg'
import { TypeEnum } from '../types/const'
import type { TagBlogType } from '../types'
import { tagBlogs } from '@/build/data'

const activeIndex = ref('1')
const router = useRouter()

const handleSelect = (key: string, keyPath: string[]) => {
  if (keyPath.length > 1) {
    router.push({
      name: keyPath[0],
      query: {
        type: key
      }
    })
  } else {
    router.push({
      name: key
    })
  }
}

const typeEnumEntries = computed(() => {
  return Object.entries(TypeEnum)
})

const tagBlogsCount = computed(() => {
  const result: { [key: string]: number } = {}
  for (const item in tagBlogs) {
    result[item] = (tagBlogs as TagBlogType)[item].length
  }
  return result
})
</script>

<style lang="scss" scoped>
.github {
  display: inline-flex;
  align-items: center;
  margin-left: 10px;
}
.flex-grow {
  flex-grow: 1;
}
</style>