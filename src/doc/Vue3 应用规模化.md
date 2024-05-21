---
title: Vue3 应用规模化
tag: skill
date: 2024-04-26 17:50
---
## 一、编译相关

vue 提供了多种格式的 构建文件

1. 前缀为 vue.runtime. 的文件是只包含运行时的版本，不包含编译器。当使用这个版本时，所有的模板都必须由构建步骤预先编译
2. 名称中不含 .runtime 的文件是完全版，包含编译器。支持在浏览器中直接编译模板

## 二、路由

1. 服务端路由：用户发送一个http请求，服务端解析请求，返回响应结果。比如传统的服务端渲染，当用户交互更改url，会请求服务端获取新的html，浏览器加载整个页面
2. 客户端路由：对于这种单页应用，客户端监听路由更改（即拦截跳转请求），动态获取新的数据，更新页面

## 三、测试

> 使用 Vitest（不基于浏览器，所以快，但是捕捉不到样式问题、原生dom问题、cookie等
>
> 使用 Cypress （基于浏览器的运行器，由于要执行打开浏览器，编译样式表等，所以慢

### 1. 单元测试

*适用于独立的JS\TS模块：业务逻辑、组件、类、模块或函数。不涉及UI、网络请求或环境问题*

针对于 Vue 的特殊的单元测试

1. 组合式函数
   1. 依赖于宿主组件，包含生命周期钩子、供给/注入。需要被包装在一个宿主组件中才可以测试

      ```javascript
      // 编写一个帮手函数，创建一个组件，并且在组件中执行组合式函数
      // test-utils.js
      import { createApp } from 'vue'

      export function withSetup(composable) {
        let result
        const app = createApp({
          setup() {
            result = composable()
            // 忽略模板警告
            return () => {}
          }
        })
        app.mount(document.createElement('div'))
        // 返回结果与应用实例
        // 用来测试供给和组件卸载
        return [result, app]
      }

      import { withSetup } from './test-utils'
      import { useFoo } from './foo'

      test('useFoo', () => {
        const [result, app] = withSetup(() => useFoo(123))
        // 为注入的测试模拟一方供给
        app.provide(...)
        // 执行断言
        expect(result.foo.value).toBe(1)
        // 如果需要的话可以这样触发
        app.unmount()
      })
      ```
   2. 不依赖于宿主组件。直接调用并断言其返回的状态或方法

      ```javascript
      // counter.js
      import { ref } from 'vue'

      export function useCounter() {
        const count = ref(0)
        const increment = () => count.value++

        return {
          count,
          increment
        }
      }

      // counter.test.js
      import { useCounter } from './counter.js'

      test('useCounter', () => {
        const { count, increment } = useCounter()
        expect(count.value).toBe(0)

        increment()
        expect(count.value).toBe(1)
      })
      ```
2. 组件
   1. 白盒：单元测试，对组件进行更独立的测试
   2. 黑盒：组件测试，测试组件在整个系统中的集成情况

### 2. 组件测试

*组件测试关注 prop 事件 slot 样式 生命周期钩子 用户交互 等，只关注组件做了什么，而不是如何实现的。*

*所以不要测试组件的私有状态或私有方法。如果想测试一个私有方法，应该把他提到独立的实用函数中，然后写他的单元测试*

```javascript
const valueSelector = '[data-testid=stepper-value]'
const buttonSelector = '[data-testid=increment]'

const wrapper = mount(Stepper, {
  props: {
    max: 1
  }
})

expect(wrapper.find(valueSelector).text()).toContain('0')

await wrapper.find(buttonSelector).trigger('click')

expect(wrapper.find(valueSelector).text()).toContain('1')
```

### 3. 端到端测试

*完全依靠在真实浏览器中浏览整个页面来测试你的应用， 测试 当用户实际使用你的应用时发生了什么*

**推荐方案：Cypress**

选择端到端测试方案 需要考虑的因素：

1. 跨浏览器测试：了解应用在多个不同浏览器上运行的情况
2. 更快的反馈：集成和部署（CI/CD） 快，支持本地开发时单独测试某个页面，支持热重载
3. 调试体验
4. 无头模式下的可见性：在CI/CD运行时，即在无界面的浏览器中运行。需要能查看应用的快照、视频，从而了解错误的原因

## 四、服务端渲染（SSR)

> 默认情况下，vue是在浏览器生成和操作dom。服务端渲染指的是，vue支持将组件在服务器生成html字符串，然后通过响应返回给浏览器，然后浏览器再将html字符串生成可交互的应用

### 4.1 SSR的优势

1. **更快的首屏加载**。无需等待浏览器将资源下载、执行后才展示；对于需要有数据请求的应用，有更快的数据库连接。
2. 前后端统一语言
3. 更好的seo，html中是完整的内容

### 4.2 SSR的劣势

1. 开发限制。第三方库在服务端渲染的应用中使用、一些浏览器端特定的代码执行
2. 构建、部署限制。客户端渲染的应用是build后的文件夹部署在服务器上。SSR 由于用户交互时，会请求服务端拿到html进行渲染，所以还需要有node环境来运行服务端代码，以及可能的数据库连接等
3. 更高的服务端负载

是否使用SSR  取决于是否有很强烈的 **首屏加载速度** 要求

### 4.3 SSG静态站点（预渲染）

在构建过程，完成渲染，生成的html作为静态文件被服务器托管，每次请求时直接返回，不需要重新生成

如果SSR渲染的页面对于所有人都是一样的，数据也都一样，比如/about  /contact 、博客网站等，那么可以使用SSG

和SSR一样 有很好的首屏加载速度。但是比SSR花销更小，更容易部署

### 4.4 实现服务端渲染

1. 写通用内容：构建应用
2. 写service：
   1. 接口请求，构建应用，构建后的转成html string，拼完整的html，返回
   2. 端口监听
   3. 支持浏览器加载客户端文件
3. 写client：构建和service一样的应用，挂载到dom上，用于用户交互时有反应

更通用的方案：Nuxt 、Quasar

### 4.4 书写SSR规范

1. SSR期间避免响应性，都使用请求+service返回新的html
2. 生命周期函数不会在SSR期间调用，只会在客户端运行
3. 不要在SSR期间使用客户端特有api，比如window  document
4. 状态污染。需要在每个请求中创建一个全新的实例，包括router和store，然后使用provide将store注入
5. 激活不匹配，需要避免以下的问题
   1. 不符合规范的html结构
   2. 渲染所用的数据用到了随机数
   3. 客户端和服务端时区，会不一致
