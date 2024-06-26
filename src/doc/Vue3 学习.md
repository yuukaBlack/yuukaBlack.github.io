---
title: Vue3 学习
tag: skill
date: 2024-02-22 10:54
---
**仅包含 组合式 写法的学习**

## 一、组合式API

```js
// 写法一
<script>
  setup() {
    const count = ref(0);
    function increment() {};
    // 在模版中使用的数据和方法需要返回
    return {
  	count,
	increment
    }
  }
</script>

// 写法二，简化写法一，script中的顶层的导入、声明的变量、函数可以在模版中直接使用
<script setup>
  const count = ref(0);
  function increment() {};
</script>
```

### 1.1 响应式数据

1. ref

   ```js
   // 声明
   const count = ref(0);

   // 获取\设置
   count.value

   // 模版中获取
   count
   ```
2. reactive

   ```js
   // 声明
   const state = reactive({ count: 0 }})

   // 获取、模版获取、设置
   state.count
   ```

*注意：*

1. *简单类型使用ref，复杂类型使用reactive*
2. *reactive，结构后的属性会丢失响应性*

### 1.2 计算属性

computed

```js
// 声明
const msg = computed(() => {
	return count.value > 1 ? 'yes' : 'no';
})

// 获取，返回的是一个ref
msg.value

// 模版获取
msg
```

### 1.3 侦听器

1. watch

   ```js
   // 监听一个ref
   watch(count, (new, old) => {
   	// do something
   })

   // 监听响应式对象的属性值，不能直接监听，要使用getter函数
   watch(
   	() => obj.count,
   	(count) => {
   		console.log(count)
   	}
   )

   // 多个来源组成的数组
   watch([x, () => y.value], ([newX, newY]) => {})

   // 监听一个reactive响应式对象，会创建一个深层监听器，所有嵌套变更时都会触发
   watch(obj, (new, old) => {
   	// new 和 old是相等的，因为他们是同一个对象
   })

   // 监听返回一个响应式对象的getter函数，不会创建深层监听器，只有在对象被替换时才会触发
   watch(() => state.obj, (new, old) => {})

   // 上个例子，可以加个 deep 转成深层监听器
   watch(
   	() => state.obj,
   	(new, old) => {
   		// new 和 old是相等的，因为他们是同一个对象，除非state.obj被整个替换
   	},
   	{ deep: true }
   )

   // 立即执行，监听到改变时再执行
   watch(
   	count,
   	(new, old) => {
   		// do something
   	},
   	{ immediate: true }
   )

   // 只执行一次
   watch(
   	count,
   	(new, old) => {
   		// do something
   	},
   	{ once: true }
   )
   ```
2. watchEffect，自动跟踪回调的响应式依赖的变更，并且立即执行

   ```js
   watchEffect(() => {
   	console.log(count.value)
   })
   ```

*注意：回调的触发时机，会在父组件更新之后，当前组件dom更新之前*

```js
// 希望在dom更新之后执行
// watch
watch(source, callback, {
  flush: 'post'
})

// watchEffect
watchEffect(callback, {
  flush: 'post'
})
watchPostEffect(() => {
  /* 在 Vue 更新后执行 */
})

// 在 vue 任何更新前触发
// watch
watch(source, callback, {
  flush: 'sync'
})

// watchEffect
watchEffect(callback, {
  flush: 'sync'
})
watchSyncEffect(() => {
  /* 在响应式数据变化时同步执行 */
})

```

### 1.4 Props & Emit

```js
// 方式一
<script setup>
// 声明props, 声明emit
const props = defineProps(['title'])
// props声明可以使用如下方式，定义类型
const props = defineProps({
	old: Number,
	msg: [String, Number] // 多种类型,
	num: {
		type: Number,
		required: true, // 必填
		default: 0 // 默认值
	},
	child: {
		type: Object,
		default(rawProps) {
			return { msg: 'hello'}
		} // 对象和数组的默认值，要从函数返回，传参为组件接受到的原始prop
	},
	// 自定义类型校验
	title: {
		validator(value, props) {
			return ['success', 'error'].includes(value)
		}
	}
})
const emit = defineEmits(['enlarge-text'])
// 可以使用如下方式进行参数验证
const emit = defineEmits({
	click: null, // 没有校验
	submit(payload: { email: string, password: string }) {
		// 通过返回值为 true 还是 false 来判断，表明时间是否合法
		// 验证是否通过
	}
})
// 调用
console.log(props.title)
emit('enlarge-text')
</script>

// 方式二
export default {
  // 声明
  props: ['title'],
  props: {
  	title: String,
	old: Number
  }
  emits: ['enlarge-text'],
  setup(props, ctx) {
    // 调用
    console.log(props.title)
    ctx.emit('enlarge-text')
  }
}
```

#### Props

1. prop命名使用小驼峰，向子组件传递时使用短横线
2. 传递时，仅写上但不传值，会认为是true
3. 将对象的所有属性当做props传入，使用v-bind
4. 数据单向流动
5. 默认都是可选的，未传递的：
   1. 布尔类型：默认值为false
   2. 其他类型：默认值为undefined
6. prop的类型type是 该prop预期类型的构造函数，所以也可以是自定义的类或构造函数，vue会通过instanceof来检查类型
7. 多种类型时，有boolean的都会进行类型转换，和string在一起 string在前面时除外

#### Emit

1. 和props一样，emit是使用小驼峰，父组件监听时使用短横线
2. 组件触发的事件没有冒泡机制

#### 透传

1. 当组件以单个元素为根元素时，父组件透传的attribute v-on会自动添加到根元素上。class style会合并
2. 使用inheritAttrs 可以禁用透传应用到根节点上
3. 使用$attrs可以访问透传的所有内容（不包含声明的props和emit）
4. 和props不同的是：不会自动转化短横线，会保留原始格式。@click会转化为 $attrs.onClick
5. 多个根节点的组件没有自动透传行为，如果透传了参数，且没有显示绑定，则会报错
6. 在js中使用 useAttrs() 来访问所有透传的内容。注意：这里返回的attribute不是响应式的，不能通过侦听器监听他的变化

## 二、组合式函数

组合式函数是一个利用 vue 的组合式 api 来封装和复用有状态逻辑的函数

### 2.1 约定

1. 命名：use为开头，驼峰式
2. 输入参数，
   1. 最好使用toValue来处理，可以规范化处理 ref getter函数 原始值
   2. 参数如果是ref或getter，为了能够被追踪，1使用watch显式的监视，2在watchEffect中调用toValue
3. 返回值
   1. 返回一个包含多个ref的普通的非响应式的对象
   2. 如果希望使用对象属性来访问，可以使用reactive来包装一下组合式函数的调用 `const mouse = reactive(useMouse())`
4. 副作用
   1. 服务端渲染，确保在组件挂载后再执行dom相关的副作用
   2. 在onUnmounted中清理副作用
5. 限制：组合式函数只能在 `<script setup> 或 setup()中调用`，只能被同步调用，也可以在生命周期中调用

```javascript
// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
	const x = ref(0)
	const y = ref(0)

	function update(event) {
		x.value = event.pageX
		y.value = event.pageY
	}

	onMounted(() => window.addEventListener('mousemove', update))
	onUnmounted(() => window.removeEventListener('mousemove', update))

	return { x, y }
}

// Index.vue
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>
	{{ x }}, {{ y }}
</template>
```

## 三、指令

### 3.1 v-if 和 v-for

1. 不要同时使用
2. 都可在 template 上使用

### 3.2 v-for

1. 遍历对象，(value, key, index)
2. 遍历整数n，v-for="n in 10"，会从1到10重复
3. 默认 就地更新 策略，建议给个唯一值key

### 3.3 v-on

```js
// 内联事件
<span @click="count++">11</span>
<span @click="foo()">11</span>
// 传参
<span @click="foo('hey')">11</span>
<span @click="foo('hey', $event)">11</span>
<span @click="(event) => foo('hey', event)">11</span>

// 方法事件
<span @click="foo">11</span>
```

### 3.4 ref

1. 可以绑定为一个函数，在每次组件更新时被调用 `<input :ref="(el) => {}">`
2. 选项式，父组件可以通过 ref 调用子组件的数据和方法
3. `<script setup>` 组件默认是私有的，父组件访问不到，除非子组件通过defineExpose 宏显示暴露

   ```js
   // 像 defineExpose 这样的编译器宏不需要导入
   defineExpose({
     a,
     b
   })
   ```

### 3.5 v-model 数据双向绑定

1. defineModel

   1. 子组件使用defineModel宏返回一个ref值，他的.value和父组件的v-model值一起更新。宏做了两个事：
      1. modelValue prop
      2. update: modelValue emit
   2. 可通过传参，来声明prop
      1. required 必填
      2. default 默认值
2. v-model的参数，定义数据名称 v-model:title
3. 多个v-model，v-model:first   v-model:last
4. 修饰符

   1. .lazy，在change事件后更新数据，而不是input事件
   2. .number，数据使用parseFloat()自动转换为数字，转换失败，则返回原始值
   3. .trim，自动去除数据两端的空格
   4. 自定义修饰符

   ```javascript
   // 子组件 child
   <script setup>
   const model = defineModel()

   function update() {
   	model.value++
   }
   </script>

   <template>
   	<div> {{ model}} </div> <span @click="update">add</span>
   </template>

   // 父组件
   <template>
   	<child v-model="title" />
   </template>
   ```

   ```javascript
   // 子组件 child 多个参数
   <script setup>
   // 必填参数, 自定义修饰符
   const [firstName, firstNameModifiers]= defineModel('firstName', { required: true })
   // 默认值参数
   const lastName= defineModel('lastName'{ default: 'yu' })

   if(firstNameModifiers.capitalize) {
   	firstName.value = firstName.value.charAt(0).toUpperCase() + firstNamevalue.slice(1)
   }

   </script>

   <template>
   	<input type="input" v-model="firstName" />
   	<input type="input" v-model="lastName" />
   </template>

   // 父组件
   <template>
   	<child v-model:firstName.capitalize="name1" />
   	<child v-model:lastName="name2" />
   </template>
   ```

### 3.6 自定义指令

*为了重用 涉及普通元素的 底层dom访问 的逻辑*

定义：

1. 在 `<script setup> ` 中以v开头的驼峰式命名的变量，被用作一个自定义指令。
2. 其他情况，需要使用 directives 选项注册
3. app.directive 全局定义

```javascript
// 方式一
<script setup>
const vFocus = {
	mounted: (el) => el.focus()
}
</script>

<template>
	<input v-focus />
</template>

// 方式二
<script>
export default {
	setup() {}
	directives: {
		focus: {
			//
		}
	}
}
</script>

// 全局注册
const app = createApp({})

app.directive('focus', {
	// 
})

// 简化形式，在mounted和updated是执行此函数
app.directive('color', (el, binding) => {
	el.style.color = binding.value
})
```

指令钩子

1. created 绑定元素的 attribute 前，时间监听器应用前
2. beforeMount  元素被插入dom前调用
3. mounted 元素的父组件、子节点都挂载完成后调用
4. beforeUpdate 元素的父组件更新前调用
5. updated 元素的父组件、子节点都更新后调用
6. beforeUnmount 元素的父组件卸载前调用
7. unmounted 元素的父组件卸载后调用

钩子参数

1. el 指令绑定到的元素
2. binding 对象
   1. value 传递给指令的值 `v-focus="2"`
   2. oldValue 之前的值
   3. arg 传递给指令的参数 `v-focus:bar, ` 参数可以是动态的
   4. modifiers 修饰符对象 `v-focus.foo.bar `对象是，`{ foo: true, bar: true }`
   5. instance 使用该指令的组件实例
   6. dir 指令的定义对象
3. vnode 绑定元素的底层VNode
4. preVnode 之前的渲染中指令所绑定的VNode

*当在组件上使用自定义指令时，会始终应用于组件的根节点。但是不推荐在组件上使用自定义指令*

## 四、生命周期

```js
onMounted(() => {
	console.log('mounted')
})
```

|                                  | vue2          | vue3              |                 |
| -------------------------------- | ------------- | ----------------- | --------------- |
| 创建前                           | beforeCreate  | 用setup           | data: undefined |
| 创建时，属性计算完成，dom未生成  | created       | 用setup           | data: { msg}    |
| 挂载前，模版 数据挂载前          | beforeMount   | onBeforeMount     | {{ msg }}       |
| 挂载后                           | mounted       | onMounted         | hello           |
| 更新前                           | beforeUpdate  | onBeforeUpdate    |                 |
| 更新时                           | updated       | onUpdated         |                 |
| 卸载前                           | beforeDestroy | onBeforeUnmount   |                 |
| 卸载后                           | destroyed     | onUnmounted       |                 |
| 错误捕获                         | errorCaptured | onErrorCaptured   |                 |
| render收集依赖调用，有几个调几次 | -             | onRenderTracked   |                 |
| 某个依赖改变，触发渲染           | -             | onRenderTriggered |                 |

## 五、组件

### 5.1 动态组件

`<component :is="tabs[currentTab]"></component> ` 在多个组件切换时，被切换的组件会被卸载，可以通过 `<KeepAlive> `组件强制被切换掉的组件仍然保持“存活”的状态

### 5.2 组件命名

子组件命名和使用，使用大驼峰

### 5.3 Slot

1. 作用域，
   1. 渲染作用域：默认情况下，模版中的表达式只能访问其定义时所处的作用域。即插槽内容无法访问子组件的数据
   2. 作用域插槽：插槽内容想访问子组件的数据，可以在slot时向出口传递参数

      ```javascript
      // 子组件 Head
      <div>
      	<slot :text="msg" :count="1"></slot>
      </div>

      // 父组件
      <Head v-slot="slotProps">
      	{{ slotProps.text}}: {{ slotProps.count }}
      </Head>

      // 具名插槽传参，name是特殊参数，不会作为props传递
      // 子组件 Head
      <div>
      	<slot name="head" :text="msg" :count="1"></slot>
      	<slot :text="msg" :count="1"></slot>
      	<slot name="footer" :text="msg" :count="1"></slot>
      </div>

      // 父组件
      <Head>
      	<template #head="headerProps">
      	// 使用参数，有具名slot时，默认插槽需要使用显式标签，不能使用v-slot来获取参数
      	<template #default="defaultProps">
      	<template #footer="footerProps">
      </Head>
      ```
2. 默认内容 `<slot> submit </slot>`
3. 具名插槽
   1. ``<template v-slot:head>`  或者 <template #head> ``名称可以是变量
   2. 使用name来定义slot名称 ``<slot name="head"> ``没有定义的默认是default
   3. 所有位于顶级的非template节点都被隐式的视为默认插槽的内容
4. 无渲染组件：只包含逻辑而不需要自己渲染内容的组件

### 5.4 异步组件

在需要时再从服务器加载相关组件

使用 defineAsyncComponent 和 es模块动态导入 import，vite和webpack支持此语法，并且会将它们作为打包时的代码分割点

```javascript
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
	import('./head/Head.vue')
})

// 也可以使用全局注册
app.component('Head', defineAsyncComponent(() => {
	import('./head/Head.vue')
}))

// 支持高级选项处理加载错误状态
const AsyncComp = defineAsyncComponent({
	loader: import('./head/Head.vue'),
	loadingComponent: Load, // 在异步组件加载时展示
	delay: 200, // 加载前有200ms的延迟，为了可以完整展示加载组件
	errorComponent: Error, // 加载失败时展示的组件
	timeout: 3000, // 超过3000ms还没加载出来，就展示失败组件
})


// 搭配Suspense组件使用
```

### 5.5 依赖注入

provide, inject

```javascript
// 父组件
import { provide, readonly } from 'vue;

provide('msg', 'hello'); // key值可以是string或symbol

// value可以是任意类型，包含ref，可以和后代组件建立响应式联系
const num = ref(0)
provide('num', num);

// 使用readonly来确保提供的数据不能被子组件更改
provide('num-only', readonly(num))


// 在整个应用层面提供依赖
import { createApp } from 'vue';

const app = createApp({})
app.provide('msg', 'hello')


// 子组件
import { inject } from 'vue';

const msg = inject('msg')
const num = inject('num') // 不会自动解构

// 如果在注入时不要求必须有提供者，那么需要提供一个默认值
const head = inject('head', 'haha')

// 默认值需要函数调用或初始化类获取时，可以使用工厂函数来避免在用不到默认值的情况下不进行计算，
// 需要传递第三个参数来表示默认值是工厂函数
const value = inject('key', () => getValue(), true)

```

*注意：将响应式的变更都放在提供方组件中，如果需要在子组件更改的话，应该在提供方组件中提供一个更改数据的函数*

### 5.6 内置组件

#### Transition

*在一个元素或组件进入和离开DOM时应用动画，仅支持单个元素，或有一个根元素的组件*

进入和离开时，会先检测css过渡或动画，再调用监听的 js 钩子，再执行

1. 触发条件：`v-if`、`v-show`、`v-if` / `v-else` / `v-else-if`、`key`属性改变、由 `<component> `切换的动态组件。
2. 动画各个阶段的class，可以为class写css动画:

   ![1712815739846](image/20240222/1712815739846.png)

   * 可以使用 name 自定义前缀：`<transition name="yu"> ，那么 v-enter-from -> yu-enter-from `，name支持变量
   * 自定义class，使用第三方css动画库时会用到：`<transition enter-active-class="animate__active">`
   * 阶段开始时，class自动添加至元素上，完成后，class自动被移除。
   * 过渡结束事件：transitionend 或 animationend，取决于使用了哪个css，如果都有使用，则需要使用type来确定事件。`<transition type="animation" >`
   * 可以使用选择器为深层次的子元素写 css 动画，可以使用 duration 属性来指定过渡的总时间
   * 性能考虑：使用transform  opacity这种不会影响dom结构 不会进行css布局重新计算的，height margin这种需谨慎使用
3. js 钩子

   ```javascript
   <Transition
     :css="false" 
     // 默认事件会在css动画和js执行的动画时 都触发。
     // 如果仅是js执行动画，可以加上这个属性，表明不会自动添加和移除class，可以跳过css过渡的探测，性能好
     // 此时 钩子回调函数的done就是必须的，在过渡效果完成后调用，否则回调函数执行完就认为过渡完成
     @before-enter="onBeforeEnter"
     @enter="onEnter" // 开始插入，开始进入动画
     @after-enter="onAfterEnter"
     @enter-cancelled="onEnterCancelled"
     @before-leave="onBeforeLeave"
     @leave="onLeave"
     @after-leave="onAfterLeave"
     @leave-cancelled="onLeaveCancelled"
   >
     <!-- ... -->
   </Transition>

   ```
4. 可封装 Transition 组件，从而复用过渡效果
5. 其他属性:

   * appear 只在元素初次渲染时应用
   * mode 过渡模式 out-in 表示 先执行离开动画再执行进入动画

#### TransitionGroup

*用于对v-for列表中的元素或组件的插入、移除和顺序改变添加动画效果*

支持和Transition一样的class 属性 js钩子等

特殊：

1. 需要使用 tag 来指定容器元素
2. mode 属性不可用
3. 列表中的元素必须有唯一的 key
4. class 会被添加至列表内的元素，而不是容器元素
5. class 新增 v-move 表示对移动中的元素的过渡

```javascript
<TranstionGroup name="list" tag="ul">
	<li v-for="item in items" :key="item.id">
		{{ item.msg }}
	</li>
</TransitionGroup>
```

#### KeepAlive

*在多个组件间动态切换时 缓存被移除的组件实例*

```javascript
// 在切换组件时，会缓存组件状态，切换回来时 状态保留

<KeepAlive>
	<component is="activeComp" />
</KeepAlive>

// 默认会缓存内部所有的组件实例，但可以通过 include 和 exclude 来定制该行为
// 值可以使逗号分隔的字符串、正则表达式、数组，会根据组件的 name 进行匹配

<KeepAlive include="a,b">
	<component is="activeComp" />
</KeepAlive>

// 使用 max 来限制可被限制的最大组件实例数，超过时，最久没被访问的缓存实例被销毁
```

被切换时，从dom上移除，但是由于被缓存而作为组件树的一部分，状态变为不活跃而不是被卸载。

当切换回来时，会插入到DOM中，将被激活

生命周期钩子，不仅适用于KeepAlive缓存的根组件，也适用于缓存树中的后代组件：

1. onActivated 首次挂载 和 从缓存中被重新插入时
2. onDeactivated 从dom移除 进入缓存时，和 卸载时


#### Teleport

*将一个组件内部的一部分模版“传送”到该组件的 DOM 结构外层的位置去*

1. to 来指定传送的目标。to 可以是 选择器字符串 或 dom元素对象
2. disabled 禁用传送，当做行内元素
3. 多个teleport to一个目标，按顺序依次追加

```javascript
<template>
	<button @click="open = true"> open modal </button>
	<Teleport to="body">
		<div v-if="open" class="modal">
		...
		</div>
	</Teleport>
</template>
```


#### Suspense

协调 子组件树中 所有异步资源的处理，可以等待下层的所有异步资源解析完成，可以在等待时渲染一个加载状态

1. 可以协调的异步资源：
   1. 带有异步 setup 的组件，即 setup() 中有 await
   2. `<script setup>` 时顶层有 await
   3. 异步组件，异步组件中自定义的加载、报错、延时等配置均被忽略。但可以指定 suspensible: false 表明不用Suspense 控制
2. 插槽，defauult、fallback。均只允许一个直接子节点
   1. 初始渲染时，渲染默认插槽内容，如果有任何异步依赖，则进入挂起状态，渲染fallback插槽内容。当所有异步依赖都完成后，则进入完成状态，渲染默认插槽的内容
   2. 当默认插槽被替换时，suspense会回到挂起状态，但是不会展示fallback插槽，而是展示之前默认插槽的内容。可以使用timeout进行控制此行为，timeout表示渲染耗时多久后会展示fallback插槽
3. 事件
   1. pending 进入挂起状态
   2. resolve 默认插槽完成获取新内容时
   3. fallback fallback插槽显示时
4. 错误处理：在使用suspense的组件中。使用errorCaptured 选项 或者 onErrorCapture钩子



## 六、插件

*是一种能为Vue添加全局功能的工具代码*

```javascript
// 使用
app.use(myPlugin, {
	// 额外参数
})

// 定义
const myPlugin = {
	install(app, options) {
		// app为安装此插件的应用实例，options为额外参数
		// 插件代码
		// 可以使用app.provide提供一些内容
	}
}
```

### 6.1 使用范围

1. 通过 app.component 和 app.directive 注册一到多个全局组件或自定义指令
2. 通过 app.provide 使一个资源可被注入进整个应用
3. 向 app.config.globalProperties 中添加一些全局实例属性或方法
