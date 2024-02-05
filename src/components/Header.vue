<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="0">
      Yuuka
    </el-menu-item>
    <div class="flex-grow" />
    <el-menu-item index="1">Home</el-menu-item>
    <el-sub-menu index="2">
      <template #title>Tag</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="3">About</el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const activeIndex = ref('1')

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(11, key, keyPath)
}
</script>

<style lang="scss" scoped>
.flex-grow {
  flex-grow: 1;
}
</style>