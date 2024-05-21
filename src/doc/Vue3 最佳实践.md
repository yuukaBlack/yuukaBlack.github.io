---
title: Vue3 最佳实践
tag: skill
date: 2024-05-21 14:48
---
## 一、性能优化

* **页面加载性能**
* **更新性能**

### 1.1 加载优化

1. **选择正确的架构**：根据场景选择正确的架构，比如对于博客、营销页，可以使用服务端渲染，或不用Vue SPA
2. **包体积 与 Tree-shaking**

   1. 使用构建工具。

      1. 没有用到的组件、api会被tree-trake，不会被打包
      2. 模版会被预编译，不用在浏览器中载入Vue编译器，会避免运行时的编译开销
   2. 依赖优化

      1. 使用es模块的依赖，对tree-shake更友好
      2. 依赖的体积和能力的性价比，使用 [bundlejs.com](https://bundlejs.com/) 检查
3. **代码分割**：将js包拆分为多个小的，可以按需加载或并行加载某些文件

   1. js 文件：动态导入的语法，会使得文件被拆分到单独的文件中，只有调用时才加载 ``import('./lazy.js')``
   2. vue 文件：懒加载（异步组件），会为该组件创建单独的块，该组件只在页面中被渲染时才会加载 ``const Foo = defineAsyncComponent(() => import('./Foo.vue'))``
   3. vue router：路由懒加载，建议 使用异步组件作为路由组件

### 1.2 更新优化

1. **props 稳定**：一个子组件至少会在props变化时发生变化
2. **v-once**：组件无需再更新时 建议使用该指令，在未来的更新时会直接跳过
3. **v-memo**：用来有条件的跳过某些大型子树或者v-for列表的更新
4. **计算属性稳定**：
   1. 如果计算属性是简单类型，那么值没有变化时不会触发副作用。
   2. 如果是对象类型，那么每次计算时都会创建新对象，新旧值不相等，会触发副作用。所以我们可以有条件的返回旧值，从而避免触发副作用
      ```javascript
      const computedObj = computed((oldValue) => {
        const newValue = {
          isEven: count.value % 2 === 0
        }
        if (oldValue && oldValue.isEven === newValue.isEven) {
          return oldValue
        }
        return newValue
      })

      ```

### 1.3 通用优化

1. **大型列表优化**：使用列表虚拟化，只渲染用户视口中能看到的部分。使用现有的社区库

   1. [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)
   2. [vue-virtual-scroll-grid](https://github.com/rocwang/vue-virtual-scroll-grid)
   3. [vueuc/VVirtualList](https://github.com/07akioni/vueuc)
2. **减少大型不可变数据的响应式开销**：

   vue响应式系统默认是深度的。每个属性访问都将触发代理的依赖追踪。会有很大的性能负担

   可以使用shallRef 和 shallowReactive 浅层次API, 但是触发更新时需要替换整个值
3. **避免不必要的组件抽象**

   组件实例 比 普通DOM节点要昂贵的多，为了逻辑抽象创建太多组件将会导致性能损失

   如果创建的组件只用了几次，不用考虑优化。

   对于大型列表，如果每项都包含很多子组件，那么去掉一个不必要的组件抽象，会减少数百个组件实例的性能消耗
