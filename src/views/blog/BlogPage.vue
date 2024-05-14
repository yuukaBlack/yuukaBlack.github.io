<template>
  <div class="main">
    <div class="blog">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="route.query.type" :to="{ path: '/list', query: { type: route.query.type } }">{{ useTypeName() }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ data?.data?.title }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="title">{{ data?.data?.title }} <span class="tag">{{ TypeEnum[data?.data?.tag] }}</span></div>
      <div class="date">创建于 {{ data?.data?.date }}</div>
      <div v-html="blog" class="blog-md"></div>
      <div class="nav-bottom">
        <div class="pre" @click="handleClickPre">
          <span v-if="showPre">
            <el-icon><ArrowLeftBold /></el-icon>{{ nav.pre.title }}
          </span>
        </div>
        <div class="next" @click="handleClickNext">
          <span v-if="showNext">
            {{ nav.next.title }}<el-icon><ArrowRightBold /></el-icon>
          </span>
        </div>
      </div>
      <div class="comment">
        <el-divider border-style="dashed"><el-icon size="24"><EditPen /></el-icon></el-divider>
        <div id="gitalk-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { allBlogs } from '../../build/data'
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it';
import MarkdownItAnchor from 'markdown-it-anchor'
import MarkdownItToc from "markdown-it-toc-done-right"
import type { BlogItem } from '../../types/index';
import { TypeEnum } from '../../types/const';
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'
import { useTypeName } from '../../hooks/useTypeName';
import useNavStore from '../../store/useNavStore';

const nav = useNavStore()

const md = new MarkdownIt({
  html: true
}).use(MarkdownItAnchor, { permalink: true, permalinkBefore: true, permalinkSymbol: '#'}).use(MarkdownItToc, { level: [1,2,3] });

const route = useRoute();
const router = useRouter();
const data = computed(() => {
  const date = route.query.d as string
  const data = (allBlogs as BlogItem[]).find((item: BlogItem) => item.data.date === date) || {} as BlogItem
  const index = nav.nav.findIndex(item => item.date === date)
  nav.setPreNext(nav.nav[index - 1], nav.nav[index + 1])
  window.scrollTo(0, 0)
  return data;
})
const blog = computed(() => {
  const html = md.render('${toc}\n' + data.value?.content);
  return html
})

const showPre = computed(() => nav.pre)

const showNext = computed(() => nav.next)

window.scrollTo(0, 0)

function handleClickPre() {
  router.push({
    name: 'blog',
    query: {
      d: nav.pre.date,
      type: route.query.type
    }
  })
}

function handleClickNext() {
  router.push({
    name: 'blog',
    query: {
      d: nav.next.date,
      type: route.query.type
    }
  })
}


onMounted(() => {
  const gitalk = new Gitalk({
    clientID: '41c17f28037c90e3b1f1',
    clientSecret: '722d893a8ba00434eb3c18883e7560a35e8f43f5',
    repo: 'yuukaBlack.github.io',     // The repository of store comments,
    owner: 'yuukaBlack',
    admin: ['yuukaBlack'],
    id: location.search,      // Ensure uniqueness and length less than 50
    distractionFreeMode: false  // Facebook-like distraction free mode
  })

  gitalk.render('gitalk-container')
})
</script>

<style lang="scss" scoped>
.blog {
  width: 60vw;
  margin: 0 auto;
  padding-top: 50px;
  :deep(.el-breadcrumb__inner:not(.is-link)) {
    color: #393f4a;
  }
}
.comment {
  background-color: white;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  #gitalk-container {
    background-color: white;
    padding: 0 20px 15px;
  }
}
.nav-bottom {
  background-color: white;
  display: flex;
  justify-content: space-between;
  padding: 40px 20px 60px;
  cursor: pointer;
  .pre, .next {
    &:hover {
      color: var(--el-color-primary);
    }
    >span {
      display: inline-flex;
      align-items: center;
      font-size: 13px;
      i {
        margin: 0 5px;
      }
    }
  }
}
.title {
  font-size: 24px;
  font-weight: 600;
  margin-top: 30px;
  .tag {
    color: white;
    display: inline-block;
    font-size: 14px;
    padding: 0 6px;
    height: 24px;
    line-height: 24px;
    border-radius: 3px;
    background-color: rgb(0, 150, 95);
    margin-left: 10px;
  }
}
.date {
  font-size: 13px;
  color: #393f4a;
  margin: 5px 0 20px;
}
.blog-md {
  background-color: white;
  border-radius: 8px 8px 0 0;
  padding: 15px 20px;
  :deep(.table-of-contents) {
    position: fixed;
    left: 1vw;
    li {
      list-style: none;
      a  {
        color: #393f4a;
      }
    }
  }
}
:deep(h2) {
  margin: 16px 0;
  font-weight: 600;
}
:deep(h3) {
  margin: 16px 0 10px;
  font-weight: 500;
}
:deep(h4) {
  margin: 5px 0;
  font-weight: 500;
}
:deep(strong) {
  font-weight: 700;
}
:deep(code) {
  background-color: #e2ebf5;
  padding: 3px 5px;
  display: inline-block;
  white-space: pre-wrap;
  width: 100%;
  overflow-x: scroll;
}
:deep(pre) {
  background-color: #f6f8fa;
  padding: 16px;
  margin-bottom: 15px;
  code {
    background-color: transparent;
  }
}
:deep(em) {
  background-color: rgba(240, 128, 64, 0.445);
}
:deep(p) {
  margin-bottom: 15px;
}
:deep(ol) {
  margin-bottom: 15px;
}
:deep(li > ol) {
  margin-bottom: 5px;
}
:deep(img) {
  max-width: 100%;
}
:deep(table) {
  border-collapse: collapse;
  th, td {
    border: 1px solid silver;
    min-width: 150px;
    padding: 3px 10px;
  }
}
:deep(blockquote) {
  border-left: 5px solid #a4c0e0;
  padding: 5px 15px;
  background-color: #a4c0e059;
  p {
    margin-bottom: 5px;
  }
}

@media (max-width: 768px) {
   .blog {
    width: 90vw;
  }
  :deep(.table-of-contents) {
    display: none;
  }
}
</style>