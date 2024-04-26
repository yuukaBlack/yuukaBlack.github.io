---
title: Vue 应用规模化
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

适用于独立的JS\TS模块：业务逻辑、组件、类、模块或函数。不涉及UI、网络请求或环境问题

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
