---
sidebarDepth: 2
---

# ECMAScript 新特性

## ● let 和 const 命令

### 1. 不存在变量提升
变量在声明之前使用，值为 `undefined`，这种现象为**变量提升现象**而 `let` 和 `const` 改变了语法行为，不存在这种想象，变量一定要在声明后使用，否则报错

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

## ● 变量的结构赋值
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

## ● 字符串的扩展与新增的方法
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

## ● 函数的扩展
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

### 3. 严格模式
`ES2016` 做了一点修改，规定只要函数参数使用了`默认值`、`解构赋值`、或者`扩展运算符`，那么函数内部就不能显式设定为严格模式，否则会报错。

### 4. name 属性
`name` 属性会返回实际的函数名
```js
function foo() {}
foo.name // "foo"
```
```js
// 匿名函数赋值给一个变量，name 的返回值情况
var f = function () {};
// ES5
f.name // ""
// ES6
f.name // "f"


// 具名函数赋值给一个变量，name 的返回值情况
const bar = function baz() {};
// ES5
bar.name // "baz"
// ES6
bar.name // "baz"

// Function 构造函数返回的函数实例
(new Function).name // "anonymous"

// bind返回的函数，name属性值会加上bound前缀。
function foo() {};
foo.bind({}).name // "bound foo"
(function(){}).bind({}).name // "bound "
```

### 5. 箭头函数
ES6 允许使用箭头 `=>` 定义函数
```js
var f = v => v;

// 等同于
var f = function (v) {
    return v;
};
```

#### 无参数或多个参数
使用圆括号代表参数部分
```js
var f = () => 5;
// 等同于
var f = function () { return 5 };

var sum = (num1, num2) => num1 + num2;
// 等同于
var sum = function(num1, num2) {
    return num1 + num2;
};
```

#### 箭头函数和变量解构结合使用
```js
const full = ({ first, last }) => first + ' ' + last;

// 等同于
function full(person) {
    return person.first + ' ' + person.last;
}
```

####  rest 参数与箭头函数结合使用
```js
const numbers = (...nums) => nums;

numbers(1, 2, 3, 4, 5)
// [1,2,3,4,5]

const headAndTail = (head, ...tail) => [head, tail];

headAndTail(1, 2, 3, 4, 5)
// [1,[2,3,4,5]]
```

#### 使用注意点
1. 函数体内的 `this` 对象，就是定义时所在的对象，而不是使用时所在的对象。

2. 不可以当作构造函数，也就是说，不可以使用 `new` 命令，否则会抛出一个错误。

3. 不可以使用 `arguments` 对象，该对象在函数体内不存在。如果要用，可以用 `rest` 参数代替。

4. 不可以使用 `yield` 命令，因此箭头函数不能用作 `Generator` 函数。

#### 箭头函数的 this
箭头函数根本没有自己的 `this`，导致内部的 `this` 就是外层代码块的 `this`

- 因为没 this，所以不能用`call()`、`apply()`、`bind()` 这些方法改变 `this` 指向 
    ```js
    (function() {
        return [
            (() => this.x).bind({ x: 'inner' })()
        ];
    }).call({ x: 'outer' });    // ['outer']
    ```
- 箭头函数使用 `arguments` 变量是指向外层函数
    ```js
    function foo() {
    setTimeout(() => {
        console.log('args:', arguments);
    }, 100);
    }

    foo(2, 4, 6, 8) // args: [2, 4, 6, 8]
    ```
- 箭头函数定义对象的方法
    - `JavaScript` 引擎的处理方法是，先在全局空间生成这个箭头函数，然后赋值给对象的方法，这导致箭头函数内部的 `this` 指向全局对象
    ```js
    globalThis.s = 21;

    const obj = {
    s: 42,
    m: () => console.log(this.s)
    };

    obj.m() // 21

    //等同于下面的代码。
    globalThis.s = 21;
    globalThis.m = () => console.log(this.s);

    const obj = {
    s: 42,
    m: globalThis.m
    };

    obj.m() // 21
    ```

## ● 数组的扩展

### 1. 扩展运算符
扩展运算符（spread）是三个点`...` ，它好比 `rest 参数` 的逆运算，将一个数组转为用逗号分隔的参数序列。
```js
console.log(...[1, 2, 3])
// 1 2 3

console.log(1, ...[2, 3, 4], 5)
// 1 2 3 4 5
```

#### 主要用于函数调用
只有函数调用时，扩展运算符才可以放在圆括号中，否则会报错。
```js
// 正常使用
function push(array, ...items) {
  array.push(...items);
}

function add(x, y) {
  return x + y;
}

const numbers = [4, 38];
add(...numbers) // 42
```
```js
// 错误使用
(...[1, 2])
// Uncaught SyntaxError: Unexpected number

console.log((...[1, 2]))
// Uncaught SyntaxError: Unexpected number

console.log(...[1, 2])
// 1 2
```


#### 扩展运算符后面可以使用表达式
```js
const arr = [
    ...(x > 0 ? ['a'] : []),
    'b',
];
```

#### 替代函数的 apply 方法
由于扩展运算符可以展开数组，所以不再需要 `apply` 方法，将数组转为函数的参数了。
```js
// ES5的 写法
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
Array.prototype.push.apply(arr1, arr2);

// ES6 的写法
let arr1 = [0, 1, 2];
let arr2 = [3, 4, 5];
arr1.push(...arr2);
```

#### 扩展运算符的应用
- 复制数组(只是浅拷贝)
    ```js
    // ES5 通用方法
    const a1 = [1, 2];
    const a2 = a1.concat();

    a2[0] = 2;
    a1 // [1, 2]

    // ES6 写法
    const a1 = [1, 2];
    // 写法一
    const a2 = [...a1];
    // 写法二
    const [...a2] = a1;
    ```

- 合并数组(浅拷贝)
    ```js
    const arr1 = ['a', 'b'];
    const arr2 = ['c'];
    const arr3 = ['d', 'e'];

    // ES5 的合并数组
    arr1.concat(arr2, arr3);
    // [ 'a', 'b', 'c', 'd', 'e' ]

    // ES6 的合并数组
    [...arr1, ...arr2, ...arr3]
    // [ 'a', 'b', 'c', 'd', 'e' ]
    ```

- 与解构赋值结合
    ```js
    const [first, ...rest] = [1, 2, 3, 4, 5];
    first // 1
    rest  // [2, 3, 4, 5]

    const [first, ...rest] = [];
    first // undefined
    rest  // []

    const [first, ...rest] = ["foo"];
    first  // "foo"
    rest   // []

    // 扩展运算符用于数组赋值，只能放在参数的最后一位
    const [...butLast, last] = [1, 2, 3, 4, 5];
    // 报错

    const [first, ...middle, last] = [1, 2, 3, 4, 5];
    // 报错
    ```

- 字符串
    ```js
    // 扩展运算符还可以将字符串转为真正的数组。
    [...'hello']    // [ "h", "e", "l", "l", "o" ]
    ```

- 实现了 Iterator 接口的对象
    - `uerySelectorAll` 方法返回的是一个 `NodeList` 对象。它不是数组，而是一个类似数组的对象。这时，扩展运算符可以将其转为真正的数组，原因就在于 `NodeList` 对象实现了 `Iterator`
    ```js
    let nodeList = document.querySelectorAll('div');
    let array = [...nodeList];
    ```

- Map 和 Set 结构，Generator 函数
    ```js
    // Map
    let map = new Map([
        [1, 'one'],
        [2, 'two'],
        [3, 'three'],
    ]);

    let arr = [...map.keys()]; // [1, 2, 3]

    // Generator 函数
    const go = function*(){
        yield 1;
        yield 2;
        yield 3;
    };

    [...go()] // [1, 2, 3]
    ```

### 2. Array.from()



## ● Class
### 1. 类的由来
`JavaScript` 语言中，生成实例对象的传统方法是通过构造函数

`ES6` 提供了更接近传统语言的写法，引入了 `Class`（类）这个概念，作为对象的模板。通过 `class``关键字，可以定义类。
```js
// 传统方法定义类
function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.toString = function () {
    return '(' + this.x + ', ' + this.y + ')';
};

var p = new Point(1, 2);

// ES6 的 class
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
}
```
`ES6` 的 `class` 定义了一个类：
- `constructor()` 方法是构造方法
- `this` 代表实例对象，
- `toString()` 方法可以使用简写，方法与方法之间不需要逗号分隔


#### 类可以看作构造函数的另一种写法
- 类的数据类型就是函数，类本身就指向构造函数。
- 对类使用 `new` 命令创建实例对象
- 类必须使用 `new` 调用，否则会报错
- 类的所有方法都定义在类的 `prototype` 属性上面
- 类的内部所有定义的方法，都是不可枚举的

```js
class Point {
    doStuff() {
        console.log('stuff');
    }
}

typeof Point // "function"
Point === Point.prototype.constructor // true

const instance = new Point();
instance.doStuff(); // stuff
```

#### constructor 方法
- `constructor()` 方法是类的默认方法，通过 `new` 命令生成对象实例时，自动调用该方法
- 类必须有 `constructor()` 方法，如果没有显式定义，一个空的 `constructor()` 方法会被默认添加

#### 取值函数（getter）和存值函数（setter）















## **持续更新中...**





























