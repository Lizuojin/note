---
sidebar: auto
# sidebarDepth: 1
---
# 你不知道的JS(下)
## 代码
- 程序常被称为**源码**或**代码**，它是一组特定的指令，用来指示计算机要执行哪些任务
- **语句：** 执行特定任务的一组单词、数字和运算符，由一个或多个表达式组成
- **表达式：** 对一个变量或值的引用；或一组值和变量与运算符的组合，例如a = b + 2语句
  - 2是一个**字面值表达式**
  - b 是一个**变量表达式**，表示获取的当前值
  - b * 2 是一个**算术表达式**，表示进行乘法运算
  - a = b * 2 是一个赋值表达式，将表达式 b * 2 的结果赋值给变量 a

### 执行程序
---
- **代码解释：** 在程序被执行时，对命令的翻译通常是自上而下逐行执行的
- **代码编译：** 对另外一些语言来说，这种翻译是预先进行的，运行已经编译好的

### 运算符
---
- 赋值：`=`
- 算术：`+` `-` `*` `/`
- 复合赋值：`+=` `-=` `*=` `/=`
- 递增/递减：`++`  `--`
- 对象属性访问：`.` `[]`
- 相等：`==` `===`
- 比较：`<` `>` `<=` `>=`
- 逻辑：`&&` `||`

### 代码注释
---
- 没有注释的代码不是最优的
- 过多注释可能是拙劣代码
- 注释应该解释为什么，而非是什么，如果代码很难理解，注释可以解释下实现原理 

## ES6及更新版本

### 块作用域声明
---
ES6之前变量作用域的基本单元是function，ES6可以使用let、const声明创建一个块作用域

#### let 声明
```js
var a = 2;
{
  let a = 3;
  cosnole.log(a);   // 3
}
console.log(a);     // 2
```

#### const 声明
- 常用于创建常量，只是**赋值本身**不可变，如果这个值是复杂值，比如对象或者数组，内容还是可以修改
- 声明后必须初始化
```js
{
  const a = [1, 2, 3];
  a.push(4);
  console.log(a);   // [1, 2, 3, 4]

  a = 42;           // TypeError    
}
```

#### 临时死亡区(暂时性死区)
访问一个已经声明但没有初始化的变量，会导致ReferenceError错误
```js
{
  console.log(a);   // undefined
  console.log(b);   // ReferenceError
  console.log(c);   // ReferenceError

  var a;
  let b;
  const c = 1;
}
```

### 扩展运算符
---
ES6引入新的运算符`...` ，通常称为 spread 或 rest (展开或收集) 运算符

#### 展开
```js
// 展开数组
function foo(x,y,z) {
  console.log(x, y, z);
}
foo( ...[1, 2, 3] );    // 1 2 3 

// ...基本上替代了concat()，[1].concat(a, [5])
var a = [2, 3, 4];
var b = [1, ...a, 5];
console.log(b);   // [1,2,3,4,5]
```

#### 收集
```js
// 把剩下的参数收集到一起组成一个数组
function foo(x, y, ...z) {
  console.log( x, y, z);
}
foo(1, 2, 3, 4, 5);   // 1 2 [3,4,5]

// 没有命名参数，就会收集所有的参数
function foo(...args) {
  console.log(args);
}
foo(1, 2, 3, 4, 5);   // [1,2,3,4,5]
```

### 默认参数值
---
#### 参数默认值——普通赋值
```js
// ES5设置参数默认值和ES6设置参数默认值
function foo(x,y){
  x = x || 11;
  y = y || 22;
  console.log(x+y);
}
foo();            // 输出33
foo(5,undefined); // 输出27
foo(undefined,6); // 输出17
foo(null,6);      // 输出17
foo(0,10);        // 弊端：参数无法传递0，输出21

// ES5改进
function bar(x,y) {
  x = (x!=undefined) ? x : 11;
  y = (y!=undefined) ? y : 22;
  console.log(x+y);
}
bar();            // 输出33
bar(5,undefined); // 输出27
bar(undefined,6); // 输出17
bar(null,6);      // 输出17
bar(0,10);        // 输出10

// ES6方法
function baz(x=11,y=22){
  console.log(x+y);
}
baz();            // 输出33
baz(5,undefined); // 输出27
baz(undefined,6); // 输出17
baz(null,6);      // 输出6(与预期结果不一致，是因为null被强制转换成了0，实际baz(0,6))
baz(0,10);        // 输出10
```

#### 参数默认值——表达式和函数调用
```js
function bar(val) {
  return y + val;
}

function foo(x = y + 3, z = bar(x)) {
  console.log(x, z);
}

var y = 5;
foo();             // 输出8 13
foo(undefined, 10)  // 输出8 10
```

#### 形式参数作用域
- 可以看作就在函数声明包裹的() 的作用域中，而不是函数体作用域中
- 默认值表达式中的标识符引用首先匹配带形式参数作用域，再搜索外层作用域

```js
var w = 1, z = 2;
function foo(x = w + 1, y = x + 1, z = z + 1) {
  console.log(x, y, z);
}
foo();    // ReferenceError
// w + 1中 w 引用在形式参数列表作用域没有找到，使用外层作用域的w
// x + 1中 x 引用在形式参数列表作用域中找到并使用
// z + 1中 z 引用在形式参数列表作用域中找到，但是还未初始化的参数变量，报错TDZReferenceError错误
```

### 解构
---
#### 结构化赋值
把数组或者对象属性中带索引的值手动赋值看作**结构化赋值**
```js
function foo() {
  return [1, 2, 3 ];
}
var tmp1 = foo(), a = tmp1[0], b = tmp1[1], c = tmp1[2];
console.log(a, b, c)

function bar() {
  return {
    x: 4,
    y: 5,
    z: 6
  };
}
var tmp2 = bar(), x = tmp2.x, y = tmp2.y, z = tmp2.z;
console.log(x, y, z)
```

#### ① 数组解构和对象解构
使结构化赋值代码更简洁
```js
function foo() {
  return [1, 2, 3 ];
}
function bar() {
  return {
    x: 4,
    y: 5,
    z: 6
  };
}
var [a, b, c] = foo();
var {x: x, y: y, z: z} = bar()

console.log(a, b, c);
console.log(x, y, z);
```

#### ② 对象赋值模式
```js
// 属性名和要赋值的变量名相同，可以省略 x: 部分
function bar() {
  return {
    x: 4,
    y: 5,
    z: 6
  };
}
var {x, y, z} = bar();
console.log(x, y, z)
```
```js
function bar() {
  return {
    x: 4,
    y: 5,
    z: 6
  };
}
// x y z 表示源值，bam baz bap 表示要赋值的目标变量
var {x: bam, y: baz, z: bap} = bar();
console.log(bam, baz, bap);   //  4 5 6
console.log(x, y, z);         // ReferenceError
```

#### ③ 对象和数字之间映射/变换
```js
// 对象映射
var o1 = {a: 1, b: 2, c: 3}
var o2 = {};
({a: o2.x, b: o2.y, c: o2.z} = o1);
console.log(o2)

// 对象映射为数组
var q1 = {a: 1, b: 2, c: 3}
var q2 = [];
({a: q2[0], b: q2[1], c: q2[2]} = o1);
console.log(q2)

// 数组映射为对象
var z1 = [1, 2, 3]
var z2 = {};
[z2.x, z2.y, z2.z]= z1;
console.log(z2)

// 数组重排
var a1 = [1, 2, 3];
var a2 = [];
[a2[2], a2[0], a2[1]] = a1;
console.log(a2);    // [2,3,1]

// 交换变量
var x = 10, y = 20;
[y, x] = [x, y]
console.log(x, y);    // 20 10
```

#### ④ 重复赋值
```js
var {a: {x: w, x: z}, a} = {a: {x: 1}};
console.log(w);   // 1
console.log(z);   // 1
console.log(a);   // {x: 1}
```


#### ⑤ 解构赋值表达式
对象或者数组解构的赋值表达式的完成值是所有右侧对象/数组的值
```js
var o = {a: 1, b: 2, c: 3},
    p = [4, 5, 6],
    a, b, c, x, y, z;

({a} = {b, c} = o);
[x, y] = [z] = p;
console.log(a, b, c);
console.log(x, y, z);
```

#### ⑥ 按需取值
```js
function foo() {
  return [1, 2, 3 ];
}
function bar() {
  return {
    x: 4,
    y: 5,
    z: 6
  };
}

var [,b] = foo();
var {x, z} = bar();
console.log(b, x, z);   // 2 4 6

// 解构出来多的变量，会被赋为undefined
var {w, d} = bar()
console.log(w, d);    // undefined  undefined

// 扩展运算符的集合操作
var a = [2,3,4];
var [b, ...c] = a;
console.log(b, c)
```

#### ⑦ 默认值赋值
```js
function foo() {
  return [1, 2, 3 ];
}
function bar() {
  return {
    x: 4,
    y: 5,
    z: 6
  };
}

var [a = 3, b = 6, c = 9, d = 12] = foo();
var {x = 5, y = 10, z = 15, w = 20} = bar();

console.log(a, b, c, d);    // 1 2 3 12
console.log(x, y, z, w);    // 4 5 6 20
```

#### ⑧ 解构参数
```js
// 数组和对象的解构参数一样
function foo([x, y]) {
  console.log(x, y);
}
foo([1, 2]);    // 1 2
foo([1]);       // 1 undefined
foo([]);        // undefined undefined
```

### 对象字面量扩展
---

#### ① 简洁属性
```js
var x = 2, y = 3, 
    o = {
      x: x,
      y: y
    };

// ES6 扩展
var x = 2, y = 3, 
    o = {
      x,
      y
    };
```

#### ② 简洁方法
```js
var o = {
  x: function() {
    // ..
  },
  y: function() {
    // ..
  }
}

// ES6 扩展
var o = {
  x() {
    // ..
  },
  y() {
    // ..
  }
}
```

#### ③ 计算属性名
```js
var perfix = 'user_';
var o = {
  baz: function() {},
  [perfix + 'foo']: function(){},
  [perfix + 'bar']: function(){}
}
```

### 模板字面量
---
ES6 引入新的字符串字面量 ` ，支持嵌入基本的字符串插入表达式，会被自动解析和求值
- `${..}` 形式的表达式都会被立即在线解析求值
- 字符串字面量表达式的结果就是普通的字符串
```js
var name = 'Kyle';
var greeting = `Hello ${name}`;
console.log(greeting);
console.log(typeof greeting)
```

#### ① 换行书写
```js
var text = `Now is the time for all good men
to come to the aid of their
country!`;
console.log(text);
// Now is the time for all good men
// to come to the aid of their
// country!
```

#### ② 插入表达式
`${..}` 内可以出现任何合法的表达式，包括函数调用、嵌套模板字面量 
```js
function upper(x) {
  return x.toUpperCase();
}
var x = 'world'; 
var y = `Hello ${upper(`${x}`)}`;

console.log(y);   // Hello WORLD
```

#### ③ 表达式作用域
模板字面量的`${..}`的作用域绑定于所在的**词法作用域**
```js
function foo(str) {
  var name = 'foo';
  console.log(str);
}
function bar() {
  var name = 'bar';
  foo(`Hello from ${name}!`);
}
var name = 'global';
bar(); // 'Hello form bar!'
```

### 箭头函数
---
箭头函数的主要设计目的就是以特定的方式改变this的行为特性
```js
var f1 = () => 12;
var f2 = x => x * 2;
var f3 = (x, y) => {
  var z = x * 2 + y;
} 
```

#### 箭头函数的this
箭头函数内部，this绑定不是动态的，而是词法的，指向父级作用域
```js
var controller = {
  makeRequest: function() {
    btn.addEventListener('click', () => {
      this.makeRequest();
    }, false)
  }
}
```
```js
var controller = {
  makeRequest: () => {
    this.helper();
  },
  helper: () => {
    // ..
  }
}
controller.makeRequest(); // this.helper 引用会失败，this指向全局作用域
```

:::tip 箭头函数使用规则
- 如果只是一个简单的计算并且return计算结果，那么可以使用箭头函数
- 如果主要依赖于var self = this中的self来工作
- 其他复杂的情况，慎用箭头函数
:::

### for..of 循环
---
for..of 和 for..in 的区别
```js
// for..in 在键/索引上循环
var a = ['a', 'b', 'c', 'd', 'e'];
for(var idx in a) {
  console.log(idx);   
}
// 0 1 2 3 4

// for..of 在值上循环
for(var val of a) {
  console.log(val)
}
// 'a' 'b' 'c' 'd' 'e'
```

### 模块
---
唯一最重要的代码组织模式是**模块**

#### 传统模块模式
基于一个带有内部变量和函数的外层函数
```js
// 调用Hello模块可以产生多个实例
function Hello(name) {
  function greeting() {
    console.log('Hello' + name + '!')
  }
  return {
    greeting: greeting
  }
}
var me = Hello('Kyle');
me.greeting();
```

```js
// 模块只作为单例
var me = (function Hello(name) {
  function greeting() {
    console.log('Hello' + name + '!');
  }
  return {
    greeting: greeting
  }
})('Kyle')
me.greeting();
```

#### ES6 模块与传统处理模块的区别
- ES6 基于文件模块，一个文件一个模块
- ES6 模块的API是静态的，它对外的API只是一种静态的定义，在代码静态解析阶段就会生产
- ES6 模块是单例，每次向其他模块导入这个模块，得到的是对单个中心实例的引用
- ES6是对模块的一个只读引用，原始值变了，加载的值也会跟着变

#### 新方法
支撑 ES6 模块的两个主要新关键词是 `import` 和 `export`
- 都必须出现在使用它们的最顶层作用域

##### export 导出
- 没有用**export标示**的一切都在模块作用域内部保持私有
- 模块的顶层作用域是模块本身，在模块内没有全局作用域
- 模块可以访问window和所有的全局变量，只是不作为词法上的顶层作用域
```js
// 命名导出：因为导出变量/函数等的名称绑定
export function foo() {
  // ..
}
export var awesome = 42;
export bar = [1,2,3];
export {bar};
```
<br/>

重命名
```js
function foo() {..}
export {foo as bar}
```
<br/>

值的引用
```js
var awesome = 42;
export { awesome };
awesome = 100;
// 一旦赋值发生，导入的绑定就会决议到100而不是42
```
<br/>

##### import 导入
```js
import { foo, bar, baz } from 'foo';
```
- foo、bar、baz 必须匹配模块API的命名导出；会在当前作用域绑定 为顶层标识符
- 'foo' 称为**模块指定符**，必须是字符串字面值，而不是持有字符串值的变量
<br/>

命名空间导入
```js
// foo模块
export function bar() {..};
export var x = 42;
export function baz() [..];

// baz模块
import * as foo from 'foo'
```
