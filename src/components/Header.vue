<template>
  <el-menu
    :default-active="activeIndex"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="/" class="name">
      Yuuka
    </el-menu-item>
    <a class="github" href="https://github.com/yuukaBlack" target="_blank"><img :src="github"></a>
    <div class="flex-grow" />
    <el-button class="search" @click="handleSearch">
      <el-icon>
        <Search />
      </el-icon>
      <span>搜索</span>
    </el-button>
    <el-menu-item index="home">首页</el-menu-item>
    <el-sub-menu index="list">
      <template #title>分类</template>
      <el-menu-item v-for="([key, value]) in typeEnumEntries" :key="key" :index="key">
        {{ value }}（{{ tagBlogsCount[key] }}）
      </el-menu-item>
    </el-sub-menu>
    <el-menu-item index="about">关于</el-menu-item>
  </el-menu>
  <SearchDialog ref="searchDialogRef" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import github from '../assets/github.svg'
import { TypeEnum } from '../types/const'
import type { TagBlogType } from '../types'
import { tagBlogs } from '../build/data'
import SearchDialog from './SearchDialog.vue'

const activeIndex = ref('1')
const router = useRouter()
const searchDialogRef = ref(null)

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

function handleSearch() {
  if (searchDialogRef.value) {
    (searchDialogRef.value as any)?.openDialog()
  }
}
</script>

<style lang="scss" scoped>
.el-menu {
  position: sticky;
  top: 0;
  left: 0;
  background-color: rgba($color: #fff, $alpha: 0.8);
  z-index: 1;
  display: flex;
  align-items: center;
}
.github {
  display: inline-flex;
  align-items: center;
  margin-left: 10px;
}
.flex-grow {
  flex-grow: 1;
}
.name {
  font-weight: 600;
  font-size: 18px;
}
.search {
  border-radius: 20px;
  border: none;
  height: 40px;
  width: 50px;
  margin-right: 20px;
  font-size: 16px;
  color: #606266;
  font-weight: 500;
  span {
    color: #909399;
  }
}
</style>