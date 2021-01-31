---
sidebarDepth: 2
---

# ECMAScript 新特性
[[toc]]
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
### 1. 简介
#### 类的由来
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
在类内部可以使用 `get` 和 `set` 键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。
```js
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: '+value);
  }
}

let inst = new MyClass();

inst.prop = 123;    // setter: 123

inst.prop;   // 'getter'
```

#### 属性表达式
类的属性名，可以采用表达式
```js
let methodName = 'getArea';

class Square {
  constructor(length) {
    // ...
  }

  [methodName]() {
    // ...
  }
}
```

#### Class 表达式
与函数一样，类也可以使用表达式的形式定义
```js
const MyClass = class Me {
    getClassName() {
        return Me.name;
    }
};

// 如果类的内部没用到的话，可以省略Me，也就是可以写成下面的形式。
const MyClass = class { /* ... */ };
```
这个类的名字是 `Me`，但是 `Me` 只在 `Class` 的内部可用，指代当前类。在 `Class` 外部，这个类只能用 `MyClass` 引用。

#### 注意点
1. 严格模式：类和模块内部默认就是严格模式
2. 不存在变量提升
    ```js
    new Foo()   // ReferenceError
    class Foo {}
    ```
3. name 属性：`name` 属性总是返回紧跟在 `class` 关键字后面的类名。
4. this 指向
    - 类的方法内部如果含有this，它默认指向类的实例，但是，如果将这个方法提取出来单独使用，this会指向该方法运行时所在的环境（由于 class 内部是严格模式，所以 this 实际指向的是undefined）
    ```js
    class Logger {
    printName(name = 'there') {
        this.print(`Hello ${name}`);
    }

    print(text) {
        console.log(text);
    }
    }

    const logger = new Logger();
    const { printName } = logger;
    printName(); // TypeError: Cannot read property 'print' of undefined
    ```
    解决办法：
    ::: details 点击看代码
    - 在构造方法中绑定this，这样就不会找不到print方法了
    ```js
    class Logger {
        constructor() {
            this.printName = this.printName.bind(this);
        }
    }
    ```
    - 使用箭头函数
    ```js
    class Obj {
        constructor() {
            this.getThis = () => this;
        }
    }

    const myObj = new Obj();
    myObj.getThis() === myObj // true
    ```
    - 使用 Proxy
    ```js
    function selfish (target) {
        const cache = new WeakMap();
        const handler = {
            get (target, key) {
            const value = Reflect.get(target, key);
            if (typeof value !== 'function') {
                return value;
            }
            if (!cache.has(value)) {
                cache.set(value, value.bind(target));
            }
            return cache.get(value);
            }
        };
        const proxy = new Proxy(target, handler);
        return proxy;
    }

    const logger = selfish(new Logger());
    ```
    :::

### 2. 静态方法
class 中定义的方法加上 `static` 关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这称为 **静态方法**
```js
class Foo {
  static classMethod() {
    return 'hello';
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod()   // TypeError: foo.classMethod is not a function
```
#### 静态方法的 this 
如果静态方法包含 `this` 关键字，这个 `this` 指的是类，而不是实例。
```js
class Foo {
    static bar() {
        this.baz();
    }
    static baz() {
        console.log('hello');
    }
    baz() {
        console.log('world');
    }
}

Foo.bar() // hello
```

#### 静态方法可以继承
父类的静态方法，可以被子类继承。
```js
class Foo {
    static classMethod() {
        return 'hello';
    }
}

class Bar extends Foo {
}

Bar.classMethod() // 'hello'
```

#### 静态方法可以从super对象上调用
```js
class Foo {
    static classMethod() {
        return 'hello';
    }
}

class Bar extends Foo {
    static classMethod() {
        return super.classMethod() + ', too';
    }
}

Bar.classMethod() // "hello, too"
```

### 3. 实例属性的新写法
实例属性this._count定义在constructor()方法里面。另一种写法是，这个属性也可以定义在类的最顶层
```js
class IncreasingCounter {
    _count = 0;
    get value() {
        console.log('Getting the current value!');
        return this._count;
    }
    increment() {
        this._count++;
    }
}
```
上面代码中，实例属性 `_count` 与取值函数 `value()` 和 `increment()` 方法，处于同一个层级。这时，不需要在实例属性前面加上`this`。

新写法的好处：所有实例对象自身的属性都定义在类的头部，看上去比较整齐，一眼就能看出这个类有哪些实例属性

### 4. new.target 属性
如果构造函数不是通过 `new` 命令或` Reflect.construct()` 调用的，`new.target` 会返回 `undefined`

因此这个属性可以用来确定构造函数是怎么调用的。
```js
function Person(name) {
  if (new.target !== undefined) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

// 另一种写法
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

var person = new Person('张三'); // 正确
var notAPerson = Person.call(person, '张三');  // 报错
```

#### 子类继承父类 new.target 返回子类
```js
class Rectangle {
    constructor(length, width) {
        console.log(new.target === Rectangle);
        // ...
    }
}

class Square extends Rectangle {
    constructor(length, width) {
        super(length, width);
    }
}

var obj = new Square(3); // 输出 false
```

## ● Promise 
### 1. Promise 的含义
`Promise` 是异步编程的一种解决方案

`Promise` 是一个对象，从它可以获取异步操作的消息

有了 `Promise` 对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。此外，`Promise` 对象提供统一的接口，使得控制异步操作更加容易。

`Promise` 对象有以下两个特点：
1. **对象的状态不受外界影响**
    - `Promise` 对象代表一个异步操作，有三种状态：`pending（进行中）`、`fulfilled（已成功）`和`rejected（已失败）`。只有异步操作的结果，可以决定当前是哪一种状态
2. **一旦状态改变，就不会再变**
    - `Promise` 对象的状态改变，只能从 `pending变为fulfilled` 和从`pending变为rejected`

`Promise` 对象有以下三个缺点：
1. 无法取消`Promise`，一旦新建它就会立即执行，无法中途取消
2. 如果不设置回调函数，`Promise`内部抛出的错误，不会反应到外部
3. 当处于 `pending` 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）


### 2. 基本用法
`ES6` 规定，`Promise` 对象是一个构造函数，用来生成 `Promise` 实例。

`Promise` 构造函数接受一个函数作为参数，该函数的两个参数分别是 `resolve` 和 `reject`，这两个也是函数
- `resolve` 函数的作用：将 `Promise` 对象的状态从 `未完成` 变为 `成功`（即从 pending 变为 resolved）
- `reject` 函数的作用是，将 `Promise` 对象的状态从 `未完成` 变为 `失败`（即从 pending 变为 rejected）

下面是一个图片加载的异步操作的例子：
::: details 点击看代码
```js
const getJSON = function(url) {
    const promise = new Promise(function(resolve, reject){
        const handler = function() {
        if (this.readyState !== 4) {
            return;
        }
        if (this.status === 200) {
            resolve(this.response);
        } else {
            reject(new Error(this.statusText));
        }
        };
        const client = new XMLHttpRequest();
        client.open("GET", url);
        client.onreadystatechange = handler;
        client.responseType = "json";
        client.setRequestHeader("Accept", "application/json");
        client.send();

    });

    return promise;
};

getJSON("/posts.json").then(function(json) {
    console.log('Contents: ' + json);
}, function(error) {
    console.error('出错了', error);
});
```
:::
如果调用 `resolve` 函数和 `reject` 函数时带有参数，那么它们的参数会被传递给回调函数
- `reject` 函数的参数通常是 `Error` 对象的实例，表示抛出的错误
- `resolve` 函数的参数除了正常的值以外，还可能是另一个 `Promise` 实例，例如
    ::: details 点击看代码
    ```js
    const p1 = new Promise(function (resolve, reject) {
        setTimeout(() => reject(new Error('fail')), 3000)
    })

    const p2 = new Promise(function (resolve, reject) {
        setTimeout(() => resolve(p1), 1000)
    })

    p2
    .then(result => console.log(result))
    .catch(error => console.log(error))
    ```
    上面代码，由于 `p2` 返回的是另一个 `Promise`，导致 `p2` 自己的状态无效了，由 `p1` 的状态决定 `p2` 的状态
    :::

#### resolve 或 reject 并不会终结 Promise 的参数函数的执行
```js
new Promise((resolve, reject) => {
resolve(1);
    console.log(2);
}).then(r => {
    console.log(r);
});
// 2
// 1
```
一般来说，调用 `resolve` 或 `reject` 以后，`Promise` 的使命就完成了，后继操作应该放到 `then` 方法里面，而不应该直接写在 `resolve` 或 `reject` 的后面。所以，最好在它们前面加上 `return` 语句，这样就不会有意外
```js
new Promise((resolve, reject) => {
    return resolve(1);
    // 后面的语句不会执行
    console.log(2);
})
```

### 3. Promise.prototype.then()
`Promise` 实例的 `then` 方法，定义在 `Prommise.prototype` 上

作用：为 `Promise` 实例添加状态改变时的回调函数

`then` 方法接受两个参数：
- `resolved` 状态的回调函数
- `rejected` 状态的回调函数

#### 链式写法
`then` 方法返回的是一个新的 `Promise` 实例（注意，不是原来那个Promise实例）。因此可以采用链式写法，即 `then` 方法后面再调用另一个 `then` 方法。
```js
getJSON("/post/1.json").then(function(post) {
    return getJSON(post.commentURL);
}).then(function (comments) {
    console.log("resolved: ", comments);
}, function (err){
    console.log("rejected: ", err);
});
```
上面代码中，第一个 `then` 方法指定的回调函数，返回的是另一个 `Promise` 对象。这时，第二个 `then` 方法指定的回调函数，就会等待这个新的 `Promise` 对象状态发生变化。如果变为 `resolved`，就调用第一个回调函数，如果状态变为 `rejected`，就调用第二个回调函数。

### 4. Promise.prototype.catch()
`Promise.prototype.catch()` 方法是 `.then(null, rejection)` 或 `.then(undefined, rejection)` 的别名，用于指定发生错误时的回调函数。
```js
p.then((val) => console.log('fulfilled:', val))
    .catch((err) => console.log('rejected', err));

// 等同于
p.then((val) => console.log('fulfilled:', val))
    .then(null, (err) => console.log("rejected:", err));
```

#### Promise 状态已经变成 resolved，再抛出错误是无效的
```js
const promise = new Promise(function(resolve, reject) {
    resolve('ok');
    throw new Error('test');
});
promise
    .then(function(value) { console.log(value) })
    .catch(function(error) { console.log(error) });
// ok
```
上面代码中，`Promise` 在 `resolve` 语句后面，再抛出错误，不会被捕获，等于没有抛出。因为 `Promise` 的状态一旦改变，就永久保持该状态，不会再变了。

#### 不建议使用 then 的第二个参数
一般来说，不要在 `then()` 方法里面定义 `Reject` 状态的回调函数

`Promise` 对象后面要跟 `catch()` 方法，这样可以处理 `Promise` 内部发生的错误。`catch()` 方法返回的还是一个 `Promise` 对象，因此后面还可以接着调用 `then()` 方法。
```js
// bad
const someAsyncThing = function() {
    return new Promise(function(resolve, reject) {
        // 下面一行会报错，因为x没有声明
        resolve(x + 2);
    });
};

someAsyncThing()
.catch(function(error) {
    console.log('oh no', error);
})
.then(function() {
    console.log('carry on');
});
// oh no [ReferenceError: x is not defined]
// carry on
```
上面代码运行完`catch()`方法指定的回调函数，会接着运行后面那个`then()`方法指定的回调函数。如果没有报错，则会跳过`catch()`方法

### 5. Promise.prototype.finally()
`finally()` 方法用于指定不管 `Promise` 对象最后状态如何，都会执行的操作。该方法的回调函数不接受任何参数
```js
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```


### 6. Promise.all()
`Promise.all()` 方法用于将多个 `Promise` 实例，包装成一个新的 `Promise` 实例。
```js
const p = Promise.all([p1, p2, p3]);
```
上面代码中，`Promise.all()` 方法接受一个数组作为参数，`p1`、`p2`、`p3`都是 `Promise` 实例

`p`的状态由`p1`、`p2`、`p3`决定，分成两种情况。
- 只有`p1`、`p2`、`p3`的状态都变成`fulfilled`，`p` 的状态才会变成`fulfilled`，此时`p1`、`p2`、`p3`的返回值组成一个数组，传递给 `p` 的回调函数。
- 只要`p1`、`p2`、`p3`之中有一个被`rejected`，`p`的状态就变成 `rejected`，此时第一个被`reject`的实例的返回值，会传递给`p`的回调函数。

如果作为参数的 `Promise` 实例，自己定义了 `catch` 方法，那么它一旦被 `rejected`，并不会触发 `Promise.all()` 的 `catch` 方法。
```js
const p1 = new Promise((resolve, reject) => {
    resolve('hello');
})
.then(result => result)
.catch(e => e);

const p2 = new Promise((resolve, reject) => {
    throw new Error('报错了');
})
.then(result => result)
.catch(e => e);

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// ["hello", Error: 报错了]
```

### 7. Promise.race()
`Promise.race()` 方法同样是将多个 `Promise` 实例，包装成一个新的 `Promise` 实例。
```js
const p = Promise.race([p1, p2, p3]);
```

`p`的状态：只要`p1`、`p2`、`p3`之中有一个实例率先改变状态，`p`的状态就跟着改变

下面是一个例子，如果指定时间内没有获得结果，就将 `Promise` 的状态变为 `reject`，否则变为 `resolve`
```js
const p = Promise.race([
    fetch('/resource-that-may-take-a-while'),
    new Promise(function (resolve, reject) {
        setTimeout(() => reject(new Error('request timeout')), 5000)
    })
]);

p
.then(console.log)
.catch(console.error);
```

### 8. Promise.allSettled()
`Promise.allSettled()` 方法接受一组 `Promise` 实例作为参数，包装成一个新的 `Promise` 实例。只有等到所有这些参数实例都返回结果，不管是 `fulfilled` 还是 `rejected`，包装实例才会结束

需要知道异步操作的结果有没有结束，`Promise.allSettled()`方法就很有用

该方法返回的新的 `Promise` 实例，一旦结束，状态总是`fulfilled`，不会变成`rejected`。状态变成`fulfilled`后，`Promise` 的监听函数接收到的参数是一个数组，每个成员对应一个传入`Promise.allSettled()`的 `Promise` 实例。
```js
const resolved = Promise.resolve(42);
const rejected = Promise.reject(-1);

const allSettledPromise = Promise.allSettled([resolved, rejected]);

allSettledPromise.then(function (results) {
    console.log(results);
});
// [
//    { status: 'fulfilled', value: 42 },
//    { status: 'rejected', reason: -1 }
// ]
```

### 9. Promise.any()
`ES2021` 引入了 `Promise.any()` 方法。该方法接受一组 `Promise` 实例作为参数，包装成一个新的 `Promise` 实例返回

只要参数实例有一个变成 `fulfilled` 状态，包装实例就会变成 `fulfilled` 状态；如果所有参数实例都变成 `rejected` 状态，包装实例就会变成 `rejected` 状态。

`Promise.any()` 跟 `Promise.race()` 方法很像，只有一点不同，就是不会因为某个 `Promise` 变成 `rejected` 状态而结束。

### 10. Promise.resolve()
`Promise.resolve()` 方法可以将将现有对象转为 `Promise` 对象
```js
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```
`Promise.resolve() `方法的参数分成四种情况：
1. 参数是一个 `Promise` 实例
    - 如果参数是 `Promise` 实例，那么 `Promise.resolve` 将不做任何修改、原封不动地返回这个实例
2. 参数是一个 `thenable` 对象
    ```js
    let thenable = {
    then: function(resolve, reject) {
        resolve(42);
    }
    };

    let p1 = Promise.resolve(thenable);
    p1.then(function (value) {
        console.log(value);  // 42
    });
    ```
3. 参数不是具有 `then()` 方法的对象，或根本就不是对象
    - Promise.resolve()方法返回一个新的 Promise 对象，状态为resolved
    ```js
    const p = Promise.resolve('Hello');

    p.then(function (s) {
    console.log(s)
    });
    // Hello
    ```
4. 不带有任何参数
    - `Promise.resolve()` 方法允许调用时不带参数，直接返回一个 `resolved` 状态的 `Promise` 对象。

### 11. Promise.reject()
`Promise.reject(reason)` 方法也会返回一个新的 `Promise` 实例，该实例的状态为 `rejected`

`Promise.reject()` 方法的参数，会原封不动地作为reject的理由，变成后续方法的参数。
```js
Promise.reject('出错了')
.catch(e => {
    console.log(e === '出错了')
})
// true
```

## ● Generator 函数的语法
### 1. 简介
Generator 函数是一个状态机，封装了多个内部状态，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态

两个特征：
1. `function` 关键字与函数名之间有一个星号
2. 函数体内部使用 `yield` 表达式，定义不同的内部状态
```js
function* helloWorldGenerator() {
    yield 'hello';
    yield 'world';
    return 'ending';
}

var hw = helloWorldGenerator();
```
上面代码：
- 有三个状态：`hello`，`world` 和 `return` 语句
- 调用 `Generator` 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象

#### Generator 函数是分段执行的
必须调用遍历器对象的 `next` 方法，使得指针移向下一个状态。也就是说，每次调用 `next` 方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个`yield`表达式（或return语句）为止
```js
hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```
调用 `Generator` 函数，返回一个遍历器对象，代表 `Generator` 函数的内部指针。以后，每次调用遍历器对象的 `next` 方法，就会返回一个有着 `value` 和 `done` 两个属性的对象
- `value`属性表示当前的内部状态的值，是 `yield` 表达式后面那个表达式的值
- `done`属性是一个布尔值，表示是否遍历结束。

#### yield 表达式
`yield` 表达式就是暂停标志。

遍历器对象的next方法的运行逻辑如下:
1. 遇到 `yield` 表达式，就暂停执行后面的操作，并将紧跟在 `yield` 后面的那个表达式的值，作为返回的对象的 `value` 属性值。
2. 下一次调用 `next` 方法时，再继续往下执行，直到遇到下一个 `yield` 表达式。
3. 如果没有再遇到新的 `yield` 表达式，就一直运行到函数结束，直到 `return` 语句为止，并将 `return` 语句后面的表达式的值，作为返回的对象的 `value` 属性值。
4. 如果该函数没有 `return` 语句，则返回的对象的value属性值为 `undefined`

`yield` 表达式后面的表达式，只有当调用 `next` 方法、内部指针指向该语句时才会执行
```js
function* gen() {
    yield  123 + 456;
}
```

<br/>

```js
function* f() {
    console.log('执行了！')
}

var generator = f();

setTimeout(function () {
    generator.next()
}, 2000);
```
`Generator` 函数可以不用 `yield` 表达式，这时就变成了一个单纯的暂缓执行函数。就变成只有调用`next方法`时，函数 `f` 才会执行

### 2. next 方法的参数
`next` 方法可以带一个参数，该参数就会被当作上一个 `yield` 表达式的返回值。`V8 引擎`直接忽略第一次使用 `next` 方法时的参数，只有从第二次使用next方法开始，参数才是有效的
```js
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
```
上面代码第一次调用`b`的`next`方法时，返回`x+1`的值`6`；第二次调用`next`方法，将上一次`yield`表达式的值设为`12`，因此`y`等于`24`，返回`y / 3`的值`8`；第三次调用`next`方法，将上一次`yield`表达式的值设为`13`，因此`z`等于`13`，这时`x`等于`5`，`y`等于`24`，所以`return`语句的值等于`42`。

### 3. for...of 循环
`for...of` 循环可以自动遍历 `Generator` 函数运行时生成的 `Iterator` 对象，且此时不再需要调用`next方法`。
```js
function* foo() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
    return 6;
}

for (let v of foo()) {
    console.log(v);
}
// 1 2 3 4 5
```

除了`for...of`循环以外，`扩展运算符（...）`、`解构赋值`和`Array.from方法`内部调用的，都是遍历器接口。这意味着，它们都可以将 `Generator` 函数返回的 `Iterator` 对象，作为参数。
```js
function* numbers () {
    yield 1
    yield 2
    return 3
    yield 4
}

// 扩展运算符
[...numbers()] // [1, 2]

// Array.from 方法
Array.from(numbers()) // [1, 2]

// 解构赋值
let [x, y] = numbers();
x // 1
y // 2

// for...of 循环
for (let n of numbers()) {
    console.log(n)
}
// 1
// 2
```

### 4. Generator.prototype.throw()
`Generator` 函数返回的遍历器对象，都有一个 `throw` 方法，可以在函数体外抛出错误，然后在 `Generator` 函数体内捕获。
```js
var g = function* () {
    try {
        yield;
    } catch (e) {
        console.log('内部捕获', e);
    }
};

var i = g();
i.next();

try {
    i.throw('a');
    i.throw('b');
} catch (e) {
    console.log('外部捕获', e);
}
// 内部捕获 a
// 外部捕获 b
```
上面代码中，遍历器对象i连续抛出两个错误。第一个错误被 `Generator` 函数体内的 `catch` 语句捕获。i第二次抛出错误，由于 `Generator` 函数内部的 `catch` 语句已经执行过了，不会再捕捉到这个错误了，所以这个错误就被抛出了 `Generator` 函数体，被函数体外的 `catch` 语句捕获。

`throw` 方法可以接受一个参数，该参数会被catch语句接收，建议抛出`Error`对象的实例。

- `throw` 方法抛出的错误要被内部捕获，前提是必须至少执行过一次 `next` 方法。
- `throw`方法被捕获以后，会附带执行下一条`yield`表达式。也就是说，会附带执行一次`next`方法。
- 如果 `Generator` 函数内部没有部署 `try...catch` 代码块，那么`throw`方法抛出的错误，将被外部`try...catch`代码块捕获。
- 如果 `Generator` 函数内部和外部，都没有部署`try...catch`代码块，那么程序将报错，直接中断执行。

### 5. Generator.prototype.return() 
`Generator` 函数返回的遍历器对象，还有一个 `return()` 方法，可以返回给定的值，不提供参数，则返回值的value属性为undefined，并且终结遍历 `Generator` 函数
```js
function* gen() {
    yield 1;
    yield 2;
    yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next()        // { value: undefined, done: true }
```

<br/>

```js
function* numbers () {
    yield 1;
    try {
        yield 2;
        yield 3;
    } finally {
        yield 4;
        yield 5;
    }
    yield 6;
}
var g = numbers();
g.next() // { value: 1, done: false }
g.next() // { value: 2, done: false }
g.return(7) // { value: 4, done: false }
g.next() // { value: 5, done: false }
g.next() // { value: 7, done: true }
```

### 6. next()、throw()、return() 的共同点
`next()`、`throw()`、`return()`这三个方法本质上是同一件事，可以放在一起理解。它们的作用都是让 `Generator` 函数恢复执行，并且使用不同的语句替换 `yield` 表达式。

- `next()`是将`yield`表达式替换成一个值。
    ```js
    const g = function* (x, y) {
        let result = yield x + y;
        return result;
    };

    const gen = g(1, 2);
    gen.next(); // Object {value: 3, done: false}

    gen.next(1); // Object {value: 1, done: true}
    // 相当于将 let result = yield x + y
    // 替换成 let result = 1;
    ```
- `throw()` 是将 `yield` 表达式替换成一个 `throw` 语句。
    ```js
    gen.throw(new Error('出错了')); // Uncaught Error: 出错了
    // 相当于将 let result = yield x + y
    // 替换成 let result = throw(new Error('出错了'));
    ```
- `return()` 是将 `yield` 表达式替换成一个 `return` 语句。
    ```js
    gen.return(2); // Object {value: 2, done: true}
    // 相当于将 let result = yield x + y
    // 替换成 let result = return 2;
    ```

### 7. yield* 表达式
`yield*表达式`：用来在一个 `Generator` 函数里面执行另一个 `Generator` 函数。
```js
function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
    yield 'x';
    yield* foo();
    yield 'y';
}

// 等同于
function* bar() {
    yield 'x';
    yield 'a';
    yield 'b';
    yield 'y';
}

// 等同于
function* bar() {
    yield 'x';
    for (let v of foo()) {
        yield v;
    }
    yield 'y';
}

for (let v of bar()){
    console.log(v);
}
// "x"
// "a"
// "b"
// "y"
```

### 8. 作为对象属性的 Generator 函数
如果一个对象的属性是 Generator 函数，可以简写成下面的形式
```js
let obj = {
    * myGeneratorMethod() {
        ···
    }
};

// 等价
let obj = {
  myGeneratorMethod: function* () {
    // ···
  }
};
```

### 9. Generator 函数的this
`Generator` 函数总是返回一个遍历器，ES6 规定这个遍历器是 `Generator` 函数的实例，也继承了 `Generator` 函数的 `prototype` 对象上的方法。
```js
function* g() {}

g.prototype.hello = function () {
    return 'hi!';
};

let obj = g();

obj instanceof g // true
obj.hello() // 'hi!'
```

让 `Generator` 函数返回一个正常的对象实例
```js
function* F() {
    this.a = 1;
    yield this.b = 2;
    yield this.c = 3;
}
var obj = {};
var f = F.call(obj);

f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}

obj.a // 1
obj.b // 2
obj.c // 3
```

### 10. 应用
#### 异步操作的同步化表达
`Generator` 函数的暂停执行的效果，意味着可以把异步操作写在 `yield` 表达式里面，等到调用`next方法`时再往后执行
```js
function* loadUI() {
    showLoadingScreen();
    yield loadUIDataAsynchronously();
    hideLoadingScreen();
}
var loader = loadUI();
// 加载UI
loader.next()

// 卸载UI
loader.next()
```

#### 控制流管理
采用回调函数：
```js
step1(function (value1) {
    step2(value1, function(value2) {
        step3(value2, function(value3) {
            step4(value3, function(value4) {
                // Do something with value4
            });
        });
    });
});
```
采用 Promise 改写上面的代码
```js
Promise.resolve(step1)
    .then(step2)
    .then(step3)
    .then(step4)
    .then(function (value4) {
        // Do something with value4
    }, function (error) {
        // Handle any error from step1 through step4
    })
    .done();
```
Generator 函数可以进一步改善代码运行流程
```js
function* longRunningTask(value1) {
    try {
        var value2 = yield step1(value1);
        var value3 = yield step2(value2);
        var value4 = yield step3(value3);
        var value5 = yield step4(value4);
        // Do something with value4
    } catch (e) {
        // Handle any error from step1 through step4
    }
}
```

#### 部署 Iterator 接口
```js
function* iterEntries(obj) {
    let keys = Object.keys(obj);
    for (let i=0; i < keys.length; i++) {
        let key = keys[i];
        yield [key, obj[key]];
    }
}

let myObj = { foo: 3, bar: 7 };

for (let [key, value] of iterEntries(myObj)) {
    console.log(key, value);
}

// foo 3
// bar 7
```

#### 作为数据结构
`Generator` 可以看作是数据结构，更确切地说，可以看作是一个数组结构，因为 `Generator` 函数可以返回一系列的值
```js
function* doStuff() {
    yield fs.readFile.bind(null, 'hello.txt');
    yield fs.readFile.bind(null, 'world.txt');
    yield fs.readFile.bind(null, 'and-such.txt');
}
for (task of doStuff()) {
    // task是一个函数，可以像回调函数那样使用它
}
```

## async 函数
### 1. 含义
`async` 函数就是 `Generator` 函数的语法糖。
```js
const gen = function* () {
    const f1 = yield readFile('/etc/fstab');
    const f2 = yield readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
};

const asyncReadFile = async function () {
    const f1 = await readFile('/etc/fstab');
    const f2 = await readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
};
```
一比较就会发现，async函数就是： 
- 将 `Generator 函数` 的 `星号（*）` 替换成 `async`，
- 将 `yield` 替换成`await`

`async 函数`对 `Generator 函数` 的改进，体现在以下四点：
#### 内置执行器
`Generator 函数` 的执行必须靠执行器，所以才有了 `co` 模块，而 `async函数` 自带执行器。也就是说，`async函数` 的执行，与普通函数一模一样，只要一行
```js
asyncReadFile();
```

#### 更好的语义
`async` 和 `await`，比起`星号`和`yield`，语义更清楚了
- `async`表示函数里有异步操作
- `await` 表示紧跟在后面的表达式需要等待结果

#### 更广的适用性
`co` 模块约定，`yield` 命令后面只能是 `Thunk` 函数或 `Promise` 对象，而 `async` 函数的 `await` 命令后面，可以是 `Promise` 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 `resolved` 的 `Promise` 对象）。

#### 返回值是 Promise
`async函数`的返回值是 `Promise` 对象，这比 `Generator 函数`的返回值是 `Iterator 对象` 方便多了。你可以用`then方法`指定下一步的操作。

进一步说，`async函数` 完全可以看作多个异步操作，包装成的一个 `Promise` 对象，而 `await` 命令就是内部 `then` 命令的语法糖。

### 2. 基本用法
下面是另一个例子，指定多少毫秒后输出一个值。
```js
function timeout(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function asyncPrint(value, ms) {
    await timeout(ms);
    console.log(value);
}

asyncPrint('hello world', 50);
```
`async 函数` 有多种使用形式
```js
// 函数声明
async function foo() {}

// 函数表达式
const foo = async function () {};

// 对象的方法
let obj = { async foo() {} };
obj.foo().then(...)

// Class 的方法
class Storage {
  constructor() {
    this.cachePromise = caches.open('avatars');
  }

  async getAvatar(name) {
    const cache = await this.cachePromise;
    return cache.match(`/avatars/${name}.jpg`);
  }
}

const storage = new Storage();
storage.getAvatar('jake').then(…);

// 箭头函数
const foo = async () => {};
```

### 3. 语法

#### 返回 Promise 对象
`async 函数` 返回一个 `Promise` 对象。

`async 函数` 内部 `return` 语句返回的值，会成为 `then` 方法回调函数的参数。
```js
async function f() {
    return 'hello world';
}

f().then(v => console.log(v))
// "hello world"
```
上面代码中，函数 `f` 内部 `return` 命令返回的值，会被 `then` 方法回调函数接收到。

`async` 函数内部抛出错误，会导致返回的 Promise 对象变为 `reject` 状态。抛出的错误对象会被`catch`方法回调函数接收到。
```js
async function f() {
    throw new Error('出错了');
}

f().then(
    v => console.log('resolve', v),
    e => console.log('reject', e)
)
//reject Error: 出错了
```

#### Promise 对象的状态变化
只有 `async` 函数内部的异步操作执行完，才会执行 `then` 方法指定的回调函数。除非遇到 `return` 语句或者抛出错误

#### await 命令
```js
async function f() {
  // 等同于
  // return 123;
  return await 123;
}

f().then(v => console.log(v))
// 123
```
上面代码中，`await` 命令的参数是数值 `123`，这时等同于 `return 123`。

`await` 命令后面是一个 `thenable` 对象（即定义了then方法的对象），那么 `await` 会将其等同于 `Promise` 对象。
```js
class Sleep {
    constructor(timeout) {
        this.timeout = timeout;
    }
    then(resolve, reject) {
        const startTime = Date.now();
        setTimeout(
        () => resolve(Date.now() - startTime),
        this.timeout
        );
    }
}

(async () => {
    const sleepTime = await new Sleep(1000);
    console.log(sleepTime);
})();
// 1000
```

任何一个 `await` 语句后面的 `Promise` 对象变为 `reject` 状态，那么整个 `async` 函数都会中断执行。
```js
async function f() {
    await Promise.reject('出错了');
    await Promise.resolve('hello world'); // 不会执行
}
```

前一个异步操作失败，也不要中断后面的异步操作的解决方法
- 将 `await` 后面的 `Promise` 对象为 `reject` 状态的放在 `try...catch` 结构里面
    ```js
    async function f() {
        try {
            await Promise.reject('出错了');
        } catch(e) {
        }
        return await Promise.resolve('hello world');
    }

    f()
    .then(v => console.log(v))
    // hello world
    ```
- 也可以在后 `Promise` 对象后面再跟一个 `catch` 方法
    ```js
    async function f() {
        await Promise.reject('出错了')
            .catch(e => console.log(e));
        return await Promise.resolve('hello world');
    }

    f()
    .then(v => console.log(v))
    // 出错了
    // hello world
    ```

#### 使用注意点
第一点：前面已经说过，`await` 命令后面的 `Promise` 对象，运行结果可能是 `rejected` ，所以最好把 `await` 命令放在`try...catch`代码块中。
```js
async function myFunction() {
    try {
        await somethingThatReturnsAPromise();
    } catch (err) {
        console.log(err);
    }
}

// 另一种写法

async function myFunction() {
    await somethingThatReturnsAPromise()
    .catch(function (err) {
        console.log(err);
    });
}
```
第二点：多个 `await` 命令后面的异步操作，如果不存在继发关系，最好让它们同时触发。
```js
// 继发关系，getFoo和getBar是两个独立的异步操作（即互不依赖），被写成继发关系。这样比较耗时，因为只有getFoo完成以后，才会执行getBar
let foo = await getFoo();
let bar = await getBar();
```
```js
// 下面两种写法，getFoo和getBar都是同时触发，这样就会缩短程序的执行时间

// 写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// 写法二
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;
```
第三点：`await` 命令只能用在 `async` 函数之中，如果用在普通函数，就会报错。
```js
async function dbFuc(db) {
    let docs = [{}, {}, {}];

    // 报错
    docs.forEach(function (doc) {
        await db.post(doc);
    });
}
```
第四点：async 函数可以保留运行堆栈
```js
const a = () => {
    b().then(() => c());
};
```
上面代码中，函数 `a` 内部运行了一个异步任务 `b()`。当 `b()` 运行的时候，函数 `a()` 不会中断，而是继续执行。等到 `b()` 运行结束，可能 `a()` 早就运行结束了，`b()`所在的上下文环境已经消失了。如果 `b()` 或 `c()` 报错，错误堆栈将不包括`a()`

现在将这个例子改成 `async` 函数
```js
const a = async () => {
    await b();
    c();
};
```
上面代码中，`b()` 运行的时候，`a()` 是暂停执行，上下文环境都保存着。一旦 `b()` 或 `c()` 报错，错误堆栈将包括`a()`

### 4. async 函数的实现原理
`async` 函数的实现原理，就是将 `Generator` 函数和自动执行器，包装在一个函数里。
```js
async function fn(args) {
  // ...
}

// 等同于

function fn(args) {
    return spawn(function* () {
        // ...
    });
}
```
下面给出 `spawn` 函数的实现，基本就是前文自动执行器的翻版。
```js
function spawn(genF) {
    return new Promise(function(resolve, reject) {
        const gen = genF();
        function step(nextF) {
            let next;
            try {
                next = nextF();
            } catch(e) {
                return reject(e);
            }
            if(next.done) {
                return resolve(next.value);
            }
            Promise.resolve(next.value).then(function(v) {
                step(function() { return gen.next(v); });
            }, function(e) {
                step(function() { return gen.throw(e); });
            });
        }
        step(function() { return gen.next(undefined); });
    });
}
```

### 5. 与其他异步处理方法的比较




## **持续更新中...**





























