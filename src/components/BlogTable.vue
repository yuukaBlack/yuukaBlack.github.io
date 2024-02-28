<template>
  <div class="table">
    <div v-for="(item, index) in list" :key="index" class="item" @click="openBlog(item)">
      <div class="title">
        <span class="name">{{ item?.data.title }}</span>
        <span class="date">{{ item?.data.date }}</span>
      </div>
      <div class="summary">{{ getSummary(item?.content) }}</div>
      <el-divider border-style="dashed" content-position="right"><el-icon><Ship /></el-icon></el-divider>
    </div>
  </div>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import { computed } from 'vue';
import { useRouter, type LocationQueryValue } from 'vue-router';
import type { BlogItem } from '../types/index'

interface Props {
  list: BlogItem[];
  type?: LocationQueryValue | LocationQueryValue[];
}

const props = defineProps<Props>();
const router = useRouter();

const list = computed(() => {
  return [...props.list].sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
})

const md = new MarkdownIt();

function getSummary(content: string) {
  const text = md.render(content).replace(/<[^>]+>/g, '').slice(0, 50);
  return text
}

function openBlog(item: BlogItem) {
  router.push({
    name: 'blog',
    query: {
      d: item.data.date,
      type: props.type
    }
  })
}
</script>

<style lang="scss" scoped>
.table {
  width: 55vw;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  text-align: center;
}
.item {
  padding: 15px 20px;
  cursor: pointer;
  &:hover {
    background-color: rgba(118, 139, 125, 0.4);
    border-radius: 8px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    .name {
      font-size: 24px;
      font-weight: 600;
    }
    .date {
      font-size: 12px;
    }
  }
  .summary {
    text-align: left;
  }
  .el-divider:deep(.el-divider__text) {
    background-color: transparent;
  }
}

@media (max-width: 768px) {
  .table {
    width: 90vw;
  }
}
</style>