import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


import './assets/main.scss'
import App from './App.vue'
import router from './router'
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')

// const gitalk = new Gitalk({
//   clientID: 'GitHub Application Client ID',
//   clientSecret: 'GitHub Application Client Secret',
//   repo: 'GitHub repo',      // The repository of store comments,
//   owner: 'GitHub repo owner',
//   admin: ['GitHub repo owner and collaborators, only these guys can initialize github issues'],
//   id: location.pathname,      // Ensure uniqueness and length less than 50
//   distractionFreeMode: false  // Facebook-like distraction free mode
// })

// gitalk.render('gitalk-container')
