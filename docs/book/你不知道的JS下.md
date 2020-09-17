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

#### 数组解构和对象解构
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

#### 对象赋值模式
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
