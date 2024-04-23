---
title: JavaScript-函数
tag: skill
date: 2024-04-02 10:18
---
## 工厂函数

**用于创建新的实例对象**

和构造函数的区别：

1. 创建新实例的方式不同。构造函数 使用new 或者 Object.create
2. 传参数量不同
3. 定义位置不同，构造函数在类定义中定义
4. 工厂函数可以创建任何类型的实例，而构造函数通常用于特定类

```javascript
// 工厂函数
function createPerson(name, age) {
	const person = Object.create(Person.prototype)
	person.name = name
	person.age = age
	return person
}

// 构造函数
class Person {
	constructor(name, age) {
		this.name = name
		this.age = age
	}
}

// 工厂函数创建实例
const p1 = createPerson('alice', 8)

// 构造函数创建实例
const p2 = new Person('bob', 20)
```
