---
sidebarDepth: 2
---

# ECMAScript 新特性

## let 和 const 命令

### 1. 不存在变量提升
:::tip 变量提升现象
变量在声明之前使用，值为 `undefined`，这种现象为**变量提升现象**
- `var` 存在这种现象，而 `let` 和 `const` 改变了语法行为，不存在这种想象，变量一定要在声明后使用，否则报错
:::
```js
// var 的情况
console.log(foo); // 输出undefined
var foo = 2;

// let 的情况
console.log(bar); // 报错ReferenceError
console.log(PI); // 报错ReferenceError
const PI = 3.14;
let bar = 2;
```

### 2. 不允许重复声明
`let` 和 `const` 不允许在相同作用域内，重复声明同一个变量
```js
// 报错
function func() {
  const a = 20;
  let a = 10;
  var a = 1;
}

// 报错
function func() {
  const a = 20;
  let a = 10;
  let a = 1;
}
```

### 3. 块级作用域
ES5 只有全局作用域和函数作用域，`let` 为 `JavaScript` 新增了块级作用域
```js
// 不是块级作用域
function f1() {
  var n = 5;
  if (true) {
    var n = 10;
  }
  console.log(n); // 10
}
f1()

// 是块级作用域
function f2() {
  let n = 5;
  if (true) {
    let n = 10;
  }
  console.log(n); // 5
}
f2()
```

### 4. 顶层对象的属性
`let`命令、`const`命令、`class`命令声明的全局变量，不属于 **顶层对象（浏览器环境指的是window对象，在 Node 指的是global对象）** 的属性
```js
var a = 1;
// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1

let b = 1;
window.b // undefined
```

### 5. const 指令
`const` 声明一个只读的常量
- 常量是`基本类型`，一旦声明不可以改变
- 常量是`引用类型`，指向实际数据的指针不可以改变，但指向的数据结构可以改变
```js
const foo = {};

// 为 foo 添加一个属性，可以成功
foo.prop = 123;
console.log(foo.prop) // 123

// 将 foo 指向另一个对象，就会报错
foo = {}; // TypeError: Assignment to constant variable.
```

## 变量的结构赋值
从数组和对象中提取值，对变量进行赋值，这被称为解构

### 1. 数组的解构赋值
变量的取值由它的位置决定
```js
// ES5
let a = 1;
let b = 2;
let c = 3;

// ES6
let [a, b, c] = [1, 2, 3];
```

**数组进行解构的例子**
```js
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo // 1
bar // 2
baz // 3

let [ , , third] = ["foo", "bar", "baz"];
third // "baz"

let [x, , y] = [1, 2, 3];
x // 1
y // 3

let [head, ...tail] = [1, 2, 3, 4];
head // 1
tail // [2, 3, 4]

let [x, y, ...z] = ['a'];
x // "a"
y // undefined
z // []
```
#### 解构不成功
变量的值就等于 `undefined`
```js
let [bar, foo] = [1];
console.log(foo)  // undefined
```

#### 不完全解构
等号左边的模式，只匹配一部分的等号右边的数组
```js
let [x, y] = [1, 2, 3];
x // 1
y // 2

let [a, [b], d] = [1, [2, 3], 4];
a // 1
b // 2
d // 4
```

#### 默认值
解构赋值允许指定默认值，只有当一个数组成员严格等于 `undefined`，默认值才会生效。
```js
let [foo = true] = [];
console.log(foo) // true

let [x, y = 'b'] = ['a']; 
console.log(x, y);   // 'a' 'b'

let [a, b = 'b'] = ['a', undefined]; 
console.log(a, b);   // 'a' 'b'

let [x = 1] = [null];
console.log(x)    // null
```

#### 默认值是表达式
表达式是惰性求值的，即只有在用到的时候，才会求值
```js
function f() {
  console.log('aaa');
}

let [x = f()] = [1];
```

#### 默认值引用解构赋值的其他变量
```js
let [x = 1, y = x] = [];     // x=1; y=1
let [x = 1, y = x] = [2];    // x=2; y=2
let [x = 1, y = x] = [1, 2]; // x=1; y=2
let [x = y, y = 1] = [];     // ReferenceError: y is not defined，
```

## 2. 对象的解构赋值
变量必须与属性同名，才能取到正确的值
