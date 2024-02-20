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
      <el-menu-item index="skill">技术</el-menu-item>
      <el-menu-item index="life">生活</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="about">关于</el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import github from '../assets/github.svg'

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