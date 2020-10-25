---
sidebarDepth: 2
---

# ECMAScript 新特性

## 一、let 和 const 命令

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

## 二、变量的结构赋值
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

### 2. 对象的解构赋值
变量必须与属性同名，才能取到正确的值，如果解构失败变量的值为 `udnefined`
```js
let { bar, foo } = { foo: 'aaa', bar: 'bbb' };
foo // "aaa"
bar // "bbb"

let { baz } = { foo: 'aaa', bar: 'bbb' };
baz // undefined
```

#### 对象方法的解构赋值
```js
// 例一
let { log, sin, cos } = Math;

// 例二
const { log } = console;
log('hello') // hello
```

#### 解构赋值的变量名和属性名
变量名与属性名不一致，必须写成下面这样：
```js
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
console.log(baz) // "aaa"

let obj = { first: 'hello', last: 'world' };
let { first: f, last: l } = obj;
console.log(f) // 'hello'
console.log(l) // 'world'
```
实际上之前的写法只是简写：
```js
let { foo: foo, bar: bar } = { foo: 'aaa', bar: 'bbb' };
```
:::tip 对象解构赋值的内部机制
是先找到同名属性，然后再赋给对应的变量。真正被赋值的是后者，而不是前者。
```js
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"
foo // error: foo is not defined
```
上面代码中，`foo` 是匹配的模式，`baz` 才是变量。真正被赋值的是变量 `baz`，而不是模式`foo`。
:::

#### 解构赋值继承的属性
```js
const obj1 = {};
const obj2 = { foo: 'bar' };
Object.setPrototypeOf(obj1, obj2);

const { foo } = obj1;
foo // "bar"
``` 
上面代码中，对象obj1的原型对象是 `obj2`。`foo` 属性不是 `obj1` 自身的属性，而是继承自``obj2``的属性，解构赋值可以取到这个属性

#### 默认值
默认值生效的条件是，对象的属性值严格等于 `undefined`
```js
var {x = 3} = {};
x // 3

var {x: y = 3} = {x: 5};
y // 5

var {x = 3} = {x: undefined};
x // 3

var {x = 3} = {x: null};
x // null
```

### 3. 字符串的解构赋值
字符串也可以解构赋值。这是因为此时，字符串被转换成了一个类似数组的对象
```js
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"

// 可以对类似数组的 length 属性解构赋值
let {length : len} = 'hello';
len // 5
```

### 4. 函数参数的解构赋值
函数参数也可以使用解构赋值
```js
function add([x, y]){
  return x + y;
}

add([1, 2]); // 3
```

#### 默认值
```js
function move({x = 0, y = 0} = {}) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]
```

#### 函数参数为什么要写成 `{x = 0， y = 0} = {}` 形式
是为了避免执行 `move()` 会报错，***数组形式也会报错***
```js
function move1({x = 0, y = 0}){
    return [x, y];
}
move1()    // Uncaught TypeError: Cannot read property 'x' of undefined

// 函数参数的 arguments 是类似数组，不能进行解构赋值
function move2([x = 0, y = 0]){
    return [x, y];
}
move2()    // Uncaught TypeError: undefined is not iterable (cannot read property Symbol(Symbol.iterator))
```

上面代码中，解构赋值可以看成:
```js
// 执行move()时，arguments可以看作空类似数组[ ]，这个赋值表达式是会报错的
let [{x = 0, y = 0}] = [];  // Uncaught TypeError: Cannot read property 'x' of undefined
```
再看看下面的这个写法：
```js
function move({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]
```
上面代码中，只有当执行 `move()` 参数右边的 `{ x: 0, y: 0 }` 才会被使用

### 5. 用途

#### 交换变量的值
```js
let x = 1;
let y = 2;

[x, y] = [y, x];
console.log('x:' + x, 'y:'+ y)
```

#### 取出函数返回的多个值
```js
// 返回一个数组
function example1() {
  return [1, 2, 3];
}
let [a, b, c] = example1();

// 返回一个对象
function example2() {
  return {
    foo: 1,
    bar: 2
  };
}
let { foo, bar } = example2();
```

#### 提取 JSON 数据
```js
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

let { id, status, data: number } = jsonData;
console.log(id, status, number);  // 42, "OK", [867, 5309]
```

#### 函数参数的默认值
指定参数的默认值，就避免了在函数体内部再写 `var foo = config.foo || 'default foo'` 这样的语句
```js
jQuery.ajax = function (url, {
  async = true,
  beforeSend = function () {},
  cache = true,
  complete = function () {},
  crossDomain = false,
  global = true,
  // ... more config
} = {}) {
  // ... do stuff
};
```

#### 输入模块的指定方法
加载模块时，往往需要指定输入哪些方法。解构赋值使得输入语句非常清晰。
```js
const { SourceMapConsumer, SourceNode } = require("source-map");
```

## 三、字符串的扩展与新增的方法
### 1. 模板字符串
模板字符串（template string）是增强版的字符串，用 **反引号（`）** 标识

#### 定义多行字符串
所有的空格和缩进都会被保留在输出之中
```js
let text = `In JavaScript this is
          not legal.`
```

#### 字符串中嵌入变量
模板字符串中嵌入变量，需要将变量名写在 `${}` 之中，大括号内部可以放入任意的 JavaScript 表达式，可以进行运算，以及引用对象属性，还能调用函数
```js
let name = "Bob", time = "today";
let text = `Hello ${name}, how are you ${time}?`

// 运算
let x = 1;
let y = 2;
`${x} + ${y} = ${x + y}`    // "1 + 2 = 3"

// 引用对象属性
let obj = {x: 1, y: 2};
`${obj.x + obj.y}`    // "3"

// 调用函数
function fn() {
  return "Hello World";
}
`foo ${fn()} bar`
```

## 四、函数的扩展
### 1. 默认值
**ES5 的写法：**
```js
function log(x, y) {
  y = y || 'World';
  console.log(x, y);
}

log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello World
```
上面代码中的最后一行，参数y赋值了，但是对应的布尔值为false，则该赋值不起作用

**ES6的写法：**
```js
function log(x, y = 'World') {
  console.log(x, y);
}

log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello
```

### 2. rest 参数
ES6 引入 rest 参数（形式为`...变量名`），用于获取函数的多余参数
```js
function add(a, ...values) {
    console.log(a);       // 2
    console.log(values);  // [5, 3]
}

add(2, 5, 3)
```

#### rest 参数的变量是一个数组
`arguments` 是类似数组的对象，要使用数组的方法，必须使用 `Array.prototype.slice.call` 先将其转为数组
```js
function push(array, ...items) {
  items.forEach(function(item) {
    array.push(item);
    console.log(item);
  });
}

var a = [];
push(a, 1, 2, 3)
```

#### rest 参数只能是最后一个参数
```js
// 报错
function f(a, ...b, c) {
  // ...
}
```

## **持续更新中...**





























