---
title: 常用的 js 方法
tag: skill
date: 2024-04-26 09:44
---
## 一、数组

### 1. reduce

> 对数组中的每个元素按序执行一个函数，每次运行函数会将上一次运行的结果作为参数传入，返回值为最后一次的运行结果

参数：

1. callbackFn(accumulator, currentValue)
2. initialValue，不传时，初始值为第一个元素，即 accumulator 为 arr[0]，currentValue 为 arr[1]

返回值：计算总值

*获取不到 accumulator 时，会报错。即数组为空且无 initialValue 时*

```javascript
const a = [1, 2, 3, 4]

const initialValue = 0;
const sum = a.reduce((accumulator, currentValue) => accumulator + currentValue, initialValue)

console.log(sum) // 10
```



### 2. reduceRight

> 和reduce 不同之处在于：数组从右往左执行函数


### 3. slice

> 对原数组的浅拷贝，返回一个新数组，原数组不会被改变

参数：[start, end)

1. 如果是负数，则从数组末尾开始计算，-1 表示最后一个。
2. start 非必填，默认从0开始
3. end 非必填，默认为arr.length

返回值：浅拷贝的新数组

```javascript
const a = [1, 2, 3, 4]
const b = a.slice(1, 2) // 2
```

### 4. splice

> **就地**移除或替换数组元素

参数

1. start，必填，开始计算的索引
2. deleteCount，删除的数量
3. item1 ... itemN，要加入数组的元素

返回值：包含删除元素的数组

```javascript
const a = [1, 2, 3, 4]

const b = a.splice(1, 2, 'c')

console.log(a) // [1, 'c', 4 ]
console.log(b) // [2, 3]
```

### 5. toSpliced

> 和splice方法不同的是：
>
> 1. 不会更改原数组，是返回一个新数组
> 2. 不会返回稀疏数组，空槽会被替换成undefined

```javascript
const a = [1, 2, 3, 4]

const b = a.splice(1, 2, 'c')

console.log(a) // [1, 2, 3, 4]
console.log(b) // [1, 'c', 4]
```
