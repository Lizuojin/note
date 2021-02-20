---
sidebar: auto
# sidebarDepth: 2
---
# 你不知道的JS(上)
[[toc]]
## 作用域和闭包
### 作用域是什么
---
存储变量与查找变量的一套规则

### 编译原理
---
传统编译语言的编译流程：
- 分词/词法分析

将源代码分解成**词法单元**
```js
var a = 2
// 分解成var、a、=、2、;
```
- 解析/语法分析

将词法单元流装换成**抽象语法树(AST)**

- 代码生成

将抽象语法树(AST)转换为可执行代码的过程(转化为一组机器指令)

::: tip
JavaScript 的编译过程要复杂得多，会对性能、冗余元素进行优化；

使用JIT，延迟编译甚至实施重编译保证性能最佳

编译通常在执行前的几微妙
:::

### 理解作用域
---
三个知识点的解释：
- **引擎：** 负责整个JavaScript 程序的编译及执行过程

- **编译器：** 负责语法分析及代码生成

- **作用域：** 负责收集并维护由所有声明的标识符(变量)组成的一系列查询，确定当前执行的代码对这些标识符的访问权限

作用域与引擎、编译器之间的协作

变量的赋值操作会执行两个动作，首先编译器会在当前作用域中声明一个变量(如果之前没有声明过)，然后再运行时引擎在作用域中查找该变量，如果能够找到就会它赋值

### 变量查询
---
引擎对变量的分为：
- **LHS查询：** 变量容器的查询
```js
// 是LHS引用，为 a = 2 这个赋值操作找到一个目标，即查询这个赋值操作对应变量的容器
a = 2
```
- **RHS查询：** 变量源值得查询
```js
// 是RHS引用，console.log()引用了a变量，需要查找a变量的值
console.log(a)
```

### 作用域嵌套
---
当一个快或函数嵌套在另一个块或函数中时，就发生了作用域的嵌套
:::tip 查找规则
- 在当前作用域中无法找到某个变量时，
- 引擎就会在外层嵌套的作用域中继续查找，一直到最外层的作用域(全局作用域)为止，有则返回，无则报错
:::

### 查询异常
---
**LHS查询：** 找不到目标变量，在非严格模式下会自动隐式创建全局变量，在严格模式下，会抛出 ReferenceError 异常

**RHS查询：** 找不到目标变量，会抛出 ReferenceError 异常

### 词法作用域
---
作用域有两种工作模型：
- 词法作用域
- 动态作用域

**词法作用域：** 是写代码时将变量和作用域写在哪里决定的

**遮蔽效应：** 在多层的嵌套作用域中可以定义同名的标识符，作用域查找会在找到第一个匹配的标识符时停止，内部标识符遮蔽了外部的标识符 

<!-- ## 欺骗词法
欺骗词法作用域会导致性能下降 -->

### 函数中的作用域
---
**函数作用域：** 函数的全部变量可以在整个函数范围内使用及复用，内部作用域可以用外部作用域的变量

函数作用域隐藏内部变量和函数定义
```js
function foo(a) {
  var b = 2;
  function bar() {
    var c = 4;
    fn();
    console.log(a, b, c) 
    // 可以访问外部标识符(变量和函数)
  }
  function fn() {
    console.log('fn')
  }
  bar();
  console.log(a, b)    
  console.log(c)  // 报错，外部作用域不能访问内部作用域的变量
}
foo(1)
```

函数作用域隐藏内部变量和函数的问题

- 必须声明一个具名函数(foo)，意味着foo本身也污染了它所在的作用域。
- 必须显示的调用这个具名函数，才能运行其中的代码。

解决办法：**立即执行函数(IIFE)**
```js
// 此处为函数表达式，不是一个函数声明
(function foo(){
  var a = 3;
  // 输出3
  console.log(a);
})();
```
IIFE进阶用法
```js
// IIFE进阶用法：函数传参
var a = 2;
(function IIFE(window){
  var a = 3;
  console.log(a); // 输出3
  console.log(window.a);  // 输出2
})(window);
console.log(a); // 输出2
```

#### 匿名函数的缺点
- 匿名函数在栈追踪中不会显示出有意义的函数名，使得调试很困难。
- 因为没有函数名，当引用自身时，会比较麻烦。
- 没有函数名，可读性变差了

### 块作用域
---
#### 1. with块作用域
with从对象中创建出来的作用域仅在with声明中而非外部作用域中有效

#### 2. try/catch块作用域
```js
try{
  undefined();
} catch(err) {
  // err只在catch中有效
  console.log(err);
}
// 报错
console.log(err);
```

#### 3. let和const块作用域
```js
var flag = true;
if(flag){
  let bar = 1;
  console.log(bar*2); // 输出2
}
console.log(bar); // 报错

for(let i=0;i<10;i++){
  console.log(i);
}
console.log(i); // 报错，访问不到i
```

### 变量与函数的提升
**变量**和**函数**声明都会在任何代码被执行前“移动”到所在词法作用域顶部

```js
foo() // 正常执行
function foo() {
  console.log(a); // 打印 undefined，声明本身会被提升，而赋值或其他运行逻辑会留在原地
  var a = 2  
}
```
```js
foo();  // 报错
var foo = function bar() {
  // ...
}
```
不是ReferenceError，而是TypeError，因为foo()并未赋值(函数声明就会赋值)，对undefined 值进行函数调用会抛出TypeError异常

#### 函数优先
```js
foo();
var foo = function() {
  console.log(3);
}
function foo() {
  console.log(1);
}
function foo() {
  console.log(2);
}

```
foo()打印2，因为重复的声明，函数声明会被提升到变量声明之前，后面的函数声明会覆盖前面的

### 作用域闭包
---
内部函数传递到所在的词法作用域以外，并持有对原始函数定义时的作用域的引用，无论在何处执行这个函数都会使用闭包
```js
function foo() {
  var a = 2;
  function bar() {
    console.log(a);
  }
  return bar;
}
var baz = foo();
baz();
```

#### 函数传递形成闭包
无论通过何种手段将内部函数传递到它所在词法作用域之外，它都会持有队原始作用域的引用，无论在何处执行这个函数，都会产生闭包
```js
var a = 1;
function foo(){
  var a = 2;
  function baz(){
    console.log(a);
  }
  bar(baz);
}
function bar(fn){
  // 这就是闭包
  fn();
}
// 输出2，而不是1
foo();
```

#### 回调函数形成闭包
在定时器、事件监听、Ajax请求、跨窗口通信、Web Workers或者任何异步中，只要使用了回调函数，实际上就是在使用闭包

```js
// 定时器
setTimeout(function timeHandler(){
  console.log('timer');
}，100)

// 事件监听
$('#container').click(function(){
  console.log('DOM Listener');
})
```

### 循环和闭包
---
```js
for(var i=1;i<=5;i++){
  setTimeout(function timer(){
    console.log(i)
  }，i*1000)
}
// 预期；分别输出数字1~5，每秒一次，每次一个
// 实际；每秒一次的频率输出五次6
```
:::tip 原因
所有的回调函数是在循环结束后才会被执行，这时i的值是6，因此会每次输出6
:::

用立即执行函数IIFE创建作用域
```js
for(var i=1; i<=5; i++) {
  (function(){
    setTimeout(function timer(){
      console.log(i)
    },i*1000)
  })()
}
// 依然会每秒一次的频率输出五次6
```
:::tip 原因
IIFE的作用域是空的，会根据作用域链查找到变量i
:::
```js
// 改进
for(var i=1; i<=5; i++) {
  (function(j) {
    setTimeout(function timer(){
      console.log(j)
    },j*1000)
  })(i)
}
// 实现了分别输出数字1~5，每秒一次，每次一个

// 块作用域和闭包结合
for(var i=1; i<=5; i++) {
  setTimeout(function timer(){
    console.log(i)
  }, i*1000)
}
```

### 闭包模块模式
---
- 必须有外部的封闭函数，该函数至少被调用一次
- 封闭函数内部必须至少返回一个内部函数，这样才能在封闭函数作用域中形成闭包
```js
// 一个闭包模块的案例
function CoolModule() {
  var something = 'cool';
  var another = [1, 2, 3];
  function doSomething() {
    console.log(something)
  }
  function doAnother() {
    console.log(another.join('!'))
  }

  // 必要条件二：返回内部函数
  return {
    doSomething: doSomething,
    doAnother: doAnother
  }
}

// 必要条件一：被调用
var foo = CoolModule();
foo.doSomething(); // cool
foo.doAnother(); // 1！2！3
```

#### 闭包模块单例模式
```js
// 使用立即执行函数IIFE实现
var foo = (function CoolModule() {
  var something = 'cool';
  var another = [1, 2, 3];
  function doSomething() {
    console.log(something)
  }
  function doAnother() {
    console.log(another.join('!'))
  }

  // 必要条件二：返回内部函数
  return {
    doSomething: doSomething,
    doAnother: doAnother
  }
}) ();

foo.doSomething(); // cool
foo.doAnother(); // 1！2！3
```

## this和对象原型

### 关于this
this 实际上是在函数被调用时发生的绑定，它指向什么完全取决于函数在哪里被调用

### 绑定规则
---
#### 1. 默认绑定
独立函数调用，可以把这条规则看作是无法应用其他规则时的默认规则
```js
function foo() {
  console.log(this.a);
}
var a = 2;
foo();  //输出2
```

#### 2. 隐式绑定
在对象内部包含一个指向函数的属性，并通过这个属性间接引用函数，从而把this隐式绑定到这个对象上
```js
function foo() {
  console.log(this.a);
}
var myObject = {
  a: 2,
  foo: foo
}
myObject.foo();  // 输出2

```
<br/>

对象属性引用链中只有上一层或者说最后一层在调用位置中起作用
```js
function foo() {
  console.log(this.a);
}
var obj2 = {
  a: 3,
  foo: foo
}
var obj1 = {
  a: 2,
  obj2: obj2
}
obj1.obj2.foo();  // 输出3
```
<br/>

::: danger 隐式丢失
被隐式绑定的函数会丢失绑定对象，从而把this绑定到全局对象或者undefined上
:::
```js
function foo() {
  console.log(this.a)
}
var myObject = {
  a: 2,
  foo: foo
}
var bar = myObject.foo;
var a = 'oops, global';
bar();  // 输出 oops, global
```
bar是引用foo函数本身，因此bar()是一个不带任何修饰的函数引用，因此应用了默认绑定

<br/>

```js
function foo() {
  console.log(this.a)
}
function doFoo(fn) {
  fn()
}
var myObject = {
  a: 2,
  foo: foo
}

var a = 'oops, global';
doFoo(myObject.foo);  // 输出 oops, global
```
fn()的规则也是和上个例子一样

#### 3. 显示绑定 
通过call、apply、bind方法强制进行函数调用
```js
// call显示绑定this
function foo(){
  console.log(this.a)
}
var myObject = {
  a: 1，
  b: 2
}
foo.call(myObject);// 输出1
```
<br/>

硬绑定解决了this丢失问题
```js
// 硬绑定解决this丢失问题
function foo() {
  console.log(this.a)
}
function doFoo(fn) {
  fn();
}
var myObject = {
  a: 2
}
var bar = function(){
  foo.call(myObject)
}
var a = 3;
bar();// 输出2，而不是3
doFoo(bar);// 输出2，而不是3
```
<br/>
简单的辅助绑定函数

```js
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}
function bind(fn, myObject) {
  return function() {
    return fn.apply(myObject, arguments);
  }
}
var myObject = {
  a: 2
}
var bar = bind(foo, myObject);
var b = bar(3); //2 3
console.log(b); // 5
```

```js
// ES5提供了内置的方法Function.prototype.bind
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}
var myObject = {
  a: 2
}
var bar = foo.bind(myObject);
var b = bar(3);   // 2 3
console.log(b);   // 5
```

#### 4. new绑定
new绑定也可以影响函数调用时 this 绑定行为的方法
```js
function foo(a) {
  this.a = a;
}
var bar = new foo(2);
console.log(bar.a);   // 2
```
new调用foo()时，会构造新对象并把它绑定到foo()调用中的this上

### 绑定优先级
---
:::tip 隐式绑定与显式绑定
显式绑定优先级更高
:::
```js
function foo() {
  console.log(this.a);
}
var obj1 = {
  a: 2,
  foo: foo
}
var obj2 = {
  a: 3,
  foo: foo
}
obj1.foo();
obj2.foo();

obj1.foo.call(obj2);    // 3
obj2.foo.call(obj1);    // 2
```
<br/>

:::tip 隐式绑定与new绑定
new绑定优先级更高
:::
```js
// new绑定比显示绑定优先级高的例子
function foo(a) {
  this.a = a;
}
var myObject = {};

// 显示绑定
var bar = foo.bind(myObject);
bar(2);
console.log(myObject.a); // 输出2

// new绑定
var baz = new bar(4);
console.log(myObject.a); // 输出2
console.log(baz.a); // 输出4
```

### 判断 this
---
1. 函数是否在new中被调用，是则属于new绑定，this指向新创建的对象<br/>`var bar = new foo()`

2. 函数是否通过call，apply或者bind调用，是则属于显示绑定，this指向指定的对象<br/>`var bar = foo.call(myObject) `

3. 函数是否在某个上下文对象中调用，则则属于隐式绑定，this指向这个上下文对象<br/>`var bar = myObject.foo()`

4. 如果以上都不是，则使用默认绑定，严格模式下，绑定到undefined，否则绑定到全局对象window<br/>`var bar = foo()`


### 绑定例外
---
#### 1. 被忽略的this
null或者undefined作为this的绑定对象传入call、apply、bind时，在调用时会被忽略，实际应用的是默认绑定规则
```js
function foo() {
  console.log(this.a);
}
var a = 2;
foo.call(null);
```
```js
// 运用场景  
function foo(a, b) {
  console.log(a, b);
}
// 1.展开数组成参数
foo.apply(null, [2, 3]);    //2 3

// 2.使用bind()进行柯里化(预设一些参数)
var bar = foo.bind(null, 2);
bar(3);   // 2 3
```
```js
// 优化:
function foo(a, b) {
  console.log(a, b);
}
var o = Object.create(null);

foo.apply(o, [2, 3]);   // 2 3

var bar = foo.bind(o, 2);
bar(3);   // 2 3
```
### this词法
---
无法使用之前介绍的四条绑定规则的特殊函数：**箭头函数**
```js
function foo() {
  return a => {
    // this 继承foo()
    console.log(this.a);
  }
}
var obj1 = {
  a: 2
}
var obj2 = {
  a: 3
}
var bar = foo.call(obj1);
bar.call(obj2); // 2,不是3！
```

## 对象
### 语法
---
对象可以通过两种形式定义：
- 声明(文字)形式
- 构造形式
```js
// 声明形式(对象字面量)
var myObj = {
  key: value
}

// 构造形式
var myObj = new Object();
myObj.key = value;
```
两者区别：文字形式可以添加多个键/值对，而构造形式中必须逐个添加属性

### 类型
---
#### 基本类型
- string
- number
- boolean
- null
- undefined
- object

#### 内置对象
- String
- Number
- Boolean
- Object
- Function
- Array

#### 字面量隐式转换成对象
对字面量上执行一些操作，语言会自动把字面量转换成对应对象，也就是说不需要显式创建一个对象
```js
var str = 'ABC';
console.log(str.length);  // 打印 13
console.log(str.charAt(1));  // 打印 'B'

var number = 42.359
console.log(number.toFixed(2));   // 打印 42.36
```
在字面量上访问属性或者方法，引擎自动把字面量转换成对应的对象，所以可以访问属性和方法

:::tip
- 对于布尔字面量也是如此
- null 和 undefined 没有对应的构造形式，只有文字形式
- Date只有构造形式，没有对应的文字形式
- Object，Function，Array和RegExp这几种类型，无论使用文字形式还是构造形式，他们都是对象，不是字面量
:::

### 内容
---
存储在对象容器内部的是这些属性的名称，它们就像指针(引用)，指向值真正的存储位置
#### 两种属性访问方式：
```js
var myObject = {
  a: 2
}
// 属性访问
myObject.a;    // 2

// 键访问
myObject['a']  // 2  
```
#### 两种访问方式的区别：
- 属性访问：要求属性名满足标识符的命名规范
- 键访问：任意UTF-8/Unicode字符串

### 复制对象
---
准确表示对象的复制，判断它是浅复制还是深复制
#### 浅复制(拷贝)
拷贝一个对象，当值为基本类型会复制一份；值为复杂类型只是复制一份引用，指向同一个值，即当新旧两个对象的其中一个改变了复杂类型的值，另一个也会随之改变

**浅拷贝的实现：**<br/>
:::tip JSON格式化对象
此种方法要求对象满足能够被JSON安全的解析
例如如果对象中某一属性是一个函数的引用，则该属性解析结果是undefined，函数具体内容不会被解析出来
:::
```js
// JSON格式化对象实现浅拷贝
var myObject = {
  a: 1，
  b: 'AAA'，
  c: true，
  d: null，
  e: undefined，
  f: function(){console.log('this is function')}
}
var newObj = JSON.parse(JSON.stringify(myObject));
console.log(newObj.a); // 输出1
console.log(newObj.b); // 输出'AAA'
console.log(newObj.c); // 输出true
console.log(newObj.d); // 输出null
console.log(newObj.e); // 输出undefined
console.log(newObj.f); // 输出undefined，f属性中的函数引用不能被JSON安全的解析出来
```
:::tip Object.assign()
1. Object.assign()遍历源对象中所有可枚举的键，并使用=操作符赋值到目标对象
2. 对象中属性的特性(例如writable)，不能被复制到目标对象
:::
```js
// ES6 Object.assign() 实现浅拷贝
var myObject = {
  a: 1,
  b: 'AAA',
  c: true,
  d: null,
  e: undefined,
  f: function(){console.log('this is function')}
}
var newObj = Object.assign({}，obj);
console.log(newObj.a); // 输出1
console.log(newObj.b); // 输出'AAA'
console.log(newObj.c); // 输出true
console.log(newObj.d); // 输出null
console.log(newObj.e); // 输出undefined
console.log(newObj.f); // 输出ƒ (){console.log('this is function')}
```

#### 深复制(拷贝)
拷贝一个对象，不管对象属性的值是基本类型还是复制类型，都会复制一份新的，即两个新旧对象时互相独立的

### 属性描述符
---
可以使用Object.defineProperty() 添加属性、修改属性、设置特性
::: tip 三个特性
- writable(可写)
- enumerable(可枚举)
- configurable(可配置)
:::
<br/>

:::tip 1. writable(可写)
决定是否可以修改属性的值
:::
```js
// writable 
var myObject = {};
Object.defineProperty(myObject, 'a', {
  value: 2,
  writable: false,    // 不可写，
  configurable: true,
  enumerable: true
});
myObject.a = 3;
console.log(myObject.a);   //打印 2，严格模式下会报错 TypeError
```
<br/>

:::tip 2. configurable(可配置)
- configurable一旦设置成false，则无法撤销
- configurable为false时，会禁止delete删除该属性
- 不可配置的意思是：不能通过Object.defineProperty()来进行属性配置，但属性正常形式的赋值还是可以的
:::

```js
// configurable  
var myObject = {};
Object.defineProperty(myObject, 'a', {
  value: 2,
  writable: true,    
  configurable: false,    // 不可配置
  enumerable: true
});

myObject.a = 3;
console.log(myObject.a)    // 打印 3

myObject.a = 4;
delete myObject.a;
console.log(myObject.a);   // 打印 4

Object.defineProperty(myObject, 'a', {
  value: 6,
  writable: true,    
  configurable: true,
  enumerable: true
});   // 报错 TypeError

```

:::tip 3. enumerable(可枚举)
属性可枚举，比如能够通过for..in循环遍历到该属性，为true是可以遍历到，false时无法遍历
:::

```js
var myObject = {
  a: 1,
  b: 2,
}
Object.defineProperty(myObject, 'c', {
  value: 3,
  enumerable: false // 不可枚举
})

// 遍历对象
for(var key in myObject){
  console.log(myObject[key]); // 依次输出1 2
}
```

### 不变性
---
:::tip 对象常量属性
该属性不可修改，不可重定义或者不可被删除
:::
```js
var myObject = {};
Object.defineProperty(myObject, 'FAVORITE_NUMBER', {
  value: 42,
  writable: false,
  configurable: false
})
console.log(myObject.FAVORITE_NUMBER); // 输出42
myObject.FAVORITE_NUMBER = 45; 
delete myObject.FAVORITE_NUMBER 
console.log(myObject.FAVORITE_NUMBER); // 输出42，常量属性依然在
```

:::tip 禁止扩展
禁止一个对象添加属性并且保留已有属性，可以使用Object.preventExtensions()
:::
```js
var myObject = {
  a: 2
};
Object.preventExtensions(myObject)
myObject.b = 3;
console.log(myObject.b);   // undefined
```

:::tip 密封
- 对象密封后，不能添加新的属性，不能重新配置也不能删除现有属性
- 可以修改现有属性的值
- Object.seal()依次调用对象属性的Object.preventExtensions()方法
:::
```js
var myObject = {
  name: 'www',
  age: 23,
  sex: '女'
}
Object.seal(myObject);

console.log(delete myObject.name);    // 打印 false
console.log(myObject);                // 输出{name:'www'，age: 23，sex:'女'}，name属性依然存在


myObject.address = '广州';     // address属性添加失败，严格模式下报错TypeError
console.log(myObject);        // 输出{name:'www'，age: 23，sex:'女'}，address属性添加失败

// 报错，TypeError
Object.defineProperty(myObject, 'name', {
  configurable: true,
  writable: true,
  enumerable: true
})
```

:::tip 冻结
- 对象冻结后，不能修改对象属性上的值
- Object.freeze() 调用Object.seal()并把所有属性的writable修改为false
- 这是一个浅冻结，如果对象里还有对象，则对象的对象不收冻结影响
:::
```js
var myObject = {
  name: 'www',
  obj: {
    a: 1
  }
}
Object.freeze(myObject);

// 赋值失败，严格模式下，报错TypeError
myObject.name = 'AAA';
// 输出{name:'www'}
console.log(myObject);

myObject.obj.a = 2;
console.log(myObject);

// 报错TypeError
Object.defineProperty(myObject, 'name', {
  value: 'BBB'
})
```

### Getter 和 Setter
---
:::tip
- getter和setter是一个隐藏函数，分别在获取属性值和设置属性值时被调用
- 一旦设置了getter和setter，该属性的value和writable则自动忽略
- getter和setter通常是成对出现的
:::
```js
var myObject = {
  get a() {
    return 2;
  }
}
myObject.a = 3;
// 输出2，因为a属性只定义了getter，没有定义setter，赋值无效
console.log(myObject.a);

Object.defineProperty(myObject，'b'，{
  get: function(){
    return this._b_;
  }，
  set: function(val){
    this._b_ = val*3;
  }，
  enumerable: true
})
myObject.b = 3;
// 输出9，3*3
console.log(myObject.b);
```

### 存在性
---
:::tip 判断某个属性是否存在
in：判断某个属性是否存在对象以及对象的原型链上
hasOwnProperty：判断对象中是否存在某个属性
:::
```js
var myObject = {
  a: 2
}
console.log("a" in myObject);   // 输出true
console.log("b" in myObject);   // 输出false

console.log(myObject.hasOwnProperty('a'));    // 输出true
console.log(myObject.hasOwnProperty('b'));    // 输出false

var obj = Object.create(null); // obj没有进行[[Prototype]]原型委托，所以没有hasOwnProperty方法
obj.name = 'why';
console.log(obj.hasOwnProperty('name')); 
console.log(Object.prototype.hasOwnProperty.call(obj,'name')); // 输出 true
```
::: warning 
in 操作符检查的是某个属性名是否存在，4 in [2, 4, 6]返回false，因为数组[2, 4, 6]的属性名是0, 1, 2
:::

<!-- ## 混合对象“类”

### 类理论
#### 类/继承
- 代码的组织结构形式
- 软件中对真实世界中问题领域的建模方法

**数据结构：** 把数据以及和它相关的行为封装起来

**多态：** 父类的通用行为可以被子类用更特殊的行为重写 -->

