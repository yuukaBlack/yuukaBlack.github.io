<template>
  <el-dialog v-model="visible" width="800" title="搜索">
    <el-input v-model="name" @change="handleInputChange" style="width: 240px" placeholder="请输入关键词" />
    <div>
      <div v-for="(item, index) in list" :key="index" class="item" @click="handleClickItem(item)">
        <div class="title" v-html="item.title"></div>
        <div class="content" v-html="item.content"></div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { Ref } from "vue";
import { allBlogs } from '../build/data'
import MarkdownIt from 'markdown-it';
import { useRouter } from "vue-router";
import type { SearchItemType } from "../types";
import useNavStore from "../store/useNavStore";

const visible = ref(false);
const name = ref("");
const list: Ref<SearchItemType[]> = ref([]);

const md = new MarkdownIt();
const router = useRouter();
const nav = useNavStore();

function handleInputChange(value: string) {
  list.value = [];
  allBlogs.forEach((item) => {
    const info = {
      title: '',
      content: '',
      date: ''
    }
    let isMatch = false;
    if (item.data.title.includes(value)) {
      isMatch = true;
      info.title = item.data.title.replace(new RegExp(value, 'gi'), `<span class="highlight">${value}</span>`);
    }
    const content = md.render(item.content).replace(/<[^>]+>/g, '')
    if (content.includes(value)) {
      isMatch = true;
      const index = content.indexOf(value)
      info.content = content.substring(index - 50, index + 50).replace(new RegExp(value, 'gi'), `<span class="highlight">${value}</span>`);
      if (!info.title) {
        info.title = item.data.title;
      }
    }
    if (isMatch) {
      info.date = item.data.date;
      list.value.push(info);
    }
  });
}

function openDialog() {
  visible.value = true;
}

function handleClickItem(item: SearchItemType) {
  nav.setNav(allBlogs.map(blog => ({
    title: blog.data.title,
    date: blog.data.date,
  })))
  const index = allBlogs.findIndex(i => i.data.date === item.date)
  nav.setPreNext(nav.nav[index - 1], nav.nav[index + 1])
  router.push({
    name: 'blog',
    query: {
      d: item.date,
    }
  })
  visible.value = false;
}

defineExpose({
  openDialog,
});
</script>

<style lang="scss" scoped>
.item {
  margin: 20px 0;
  border-bottom: 1px solid #b6b6b6;
  :deep(.highlight) {
    color: red;
  }
  cursor: pointer;
}
.title {
  font-size: 16px;
  font-weight: 600
}
.content {
  margin: 5px 0;
  color: #777;
  
}
</style>