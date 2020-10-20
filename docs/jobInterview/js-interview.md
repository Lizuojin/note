---
# sidebar: auto
sidebarDepth: 1
---
# JavaScript基础知识面试题

## 对象类型
:::tip
在 `JavaScript` 中，除了原始类型，其他的都是对象类型，对象类型存储的是地址，而原始类型存储的是值。
:::
```js
var a = [];
var b = a;
a.push(1);
console.log(b); // 输出[1]
```
**代码分析：**<br/>

在以上代码中，创建了一个对象类型 `a` (数组)，再把 `a` 的地址赋值给了变量 `b` ，最后改变 `a` 的值，打印 `b` 时，`b` 的值也同步发生了改变，因为它们在内存中使用的是同一个地址，改变其中任何一变量的值，都会影响到其他变量。

### 对象当做函数参数
```js
function testPerson(person) {
  person.age = 52;
  person = {
    name: '李四',
    age: 18
  }
  return person;
}
var p1 = {
  name: '张三',
  age: 23
}
var p2 = testPerson(p1);
console.log(p1.age);  // 输出52
console.log(p2.age);  // 输出18
```
**代码分析：**<br/>

1. `testPerson` 函数中，`person` 传递的是对象 `p1` 的指针副本
2. 在函数内部，改变 `person` 的属性，会同步反映到对象 `p1` 上，`p1` 对象中的 `age` 属性发生了改变，即值为52
3. `testPerson` 函数又返回了一个新的对象，这个对象此时和参数 `person` 没有任何关系，因为它分配了一个新的内存地址

## typeof 和 instanceof
:::tip typeof
`typeof` 能准确判断除 `null` 以外的原始类型的值，对于对象类型，除了函数会判断成 `function`，其他对象类型一律返回 `object`
:::
```js
typeof 1            // number
typeof '1'          // string
typeof true         // boolean
typeof undefined    // undefined
typeof Symbol()     // symbol

typeof []           // object
typeof {}           // object
typeof function() {}  // function
```

:::tip instanceof
`instanceof` 通过原型链可以判断出对象的类型，
:::
```js
function Person(name) {
  this.name = name;
}
var p1 = new Person();
console.log(p1 instanceof Person) // true

var str = new String('abc');
console.log(str instanceof String)// true
```

## 对象类型
`JavaScript` 中，类型转换只有三种：
1. 转换成数字
2. 转换成布尔值
3. 转换成字符串

### 经典面试题
```js
console.log([]==![])  // true
```

**代码分析**<br/>
1. 左侧是一个对象(数组)
2. 右侧是一个布尔值，对象`[]`转换成布尔值 `true`，因为除了 `null` 所有对象都转换成布尔值，所以 `![]` 结果为false
3. 此时相当于`对象==布尔值`，依据类型转换规则，转换成数字类型进行比较
4. 对象(空数组)转换成 `0`，`0` 转换成布尔值 `false` 
5. 即 `0==0`，返回 `true`

类型转换规则，如下图：
![img](../.vuepress/public/img/type.png)

## == 和 ===
:::tip === 严格相等
`===` 叫做严格相等，是指：左右两边不仅值要相等，类型也要相等，例如 `'1'===1` 的结果是 `false`，因为一边是 `string`，另一边是 `number`。
:::

```js
console.log('1'===1); // 输出false
```

:::tip == 不严格相等
`==` 只要值相等，就返回 `true`，但 `==` 还涉及一些类型转换，它的转换规则如下：
- 两边的类型是否相同，相同的话就比较值的大小，例如 `1==2`，返回 `false`
- 判断其中一方是否是 `Boolean`，是的话就把 `Boolean` 转换成 `Number`，再进行比较
- 除了 `undefined`、`null`、`false`、`0`、`-0`、`NaN`和 `空字符串` 转换成 `false` 以外，其他所有值都转换成 `true`，包括所有对象。
:::

## new构造调用的过程
1. 创建一个全新的对象
2. 新对象会被执行原型连接
3. 这个新对象会绑定到函数调用的this
4. 返回新对象

## this全面解析
`JavaScript` 中的 `this` 只有如下几种情况，并按他们的优先级从低到高划分如下：
1. 独立函数调用，例如 `getUserInfo()`，此时 `this` 指向全局对象 `window`
2. 对象调用，例如 `stu.getStudentName()`，此时 `this` 指向调用的对象 `stu`
3. `call()`、`apply()` 和 `bind()` 改变上下文的方法，`this` 指向取决于这些方法的第一个参数，当第一个参数为 `null` 时，`this` 指向全局对象 `window`
4. 箭头函数没有 `this`，箭头函数里面的 `this` 只取决于包裹箭头函数的第一个普通函数的 `this`
5. new构造函数调用，`this`永远指向构造函数返回的实例上，优先级最高。
```js
var name = 'global name';
var foo = function() {
  console.log(this.name);
}
var Person = function(name) {
  this.name = name;
}
Person.prototype.getName = function() {
  console.log(this.name);
}
var obj = {
  name: 'obj name',
  foo: foo
}
var obj1 = {
  name: 'obj1 name'
}

// 独立函数调用，输出：global name
foo();
// 对象调用，输出：obj name
obj.foo();
// apply()，输出：obj1 name
obj.foo.apply(obj1);
// new 构造函数调用，输出：p1 name
var p1 = new Person('p1 name');
p1.getName();
```

## 闭包
当一个函数能够记住并访问它所在的词法作用域的时候，就产生了闭包，即使函数式在词法作用域之外执行

:::tip 闭包的几种表现形式
1. 返回一个函数
2. 作为函数参数传递
3. 回调函数
4. 非典型闭包IIFE(立即执行函数表达式)
:::

**返回一个函数：** 这种形式的闭包在JavaScript的代码编写中，是非常常见的一种方式。
```js
var a  = 1;
function foo(){
  var a = 2;
  // 这就是闭包
  return function(){
    console.log(a);
  }
}
var bar = foo();
// 输出2，而不是1
bar();
```
**作为函数参数传递：** 无论通过何种手段将内部函数传递到它所在词法作用域之外，它都会持有对原始作用域的引用，无论在何处执行这个函数，都会产生闭包。
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
**回调函数：** 在定时器、事件监听、Ajax请求、跨窗口通信、Web Workers或者任何异步中，只要使用了回调函数，实际上就是在使用闭包。
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
**IIFE：** IIFE(立即执行函数表达式)并不是一个典型的闭包，但它确实创建了一个闭包。
```js
var a = 2;
(function IIFE(){
  // 输出2
  console.log(a);
})();
```
代码分析：<br/>
1. `for`循环创建了5个定时器，并且定时器是在循环结束后才开始执行
2. `for` 循环结束后，用 `var i` 定义的变量 `i` 此时等于6
3. 依次执行五个定时器，都打印变量 `i`，所以结果是打印5次6

**第一种改进方法：** 利用 `IIFE(立即执行函数表达式)` 当每次 `for` 循环时，把此时的 `i` 变量传递到定时器中
```js
for(var i=1;i<=5;i++){
  (function(j){
    setTimeout(function timer(){
      console.log(j)
    }, i*1000)
  })(i)
}
```

**第二种方法：** `setTimeout` 函数的第三个参数，可以作为定时器执行时的变量进行使用
```js
for(var i=1;i<=5;i++){
  setTimeout(function timer(j){
    console.log(j)
  }, i*1000, i)
}
```

**第三种方法(推荐)：** 在循环中使用 `let i` 代替 `var i`
```js
for(let i=1;i<=5;i++){
  setTimeout(function timer(){
    console.log(i)
  }, i*1000)
}
```

## 浅拷贝与深拷贝
由于 `JavaScript` 中对象是引用类型，保存的是地址，深、浅拷贝的区别是：当拷贝结束后，在一定程度上改变原对象中的某一个引用类型属性的值，新拷贝出来的对象依然受影响的话，就是浅拷贝，反之就是深拷贝。
:::tip 浅拷贝的几种实现方法
1. 利用 `Object.assign()` 方法
2. 利用 `...` 扩展运算符
:::
**第一种方法：** Object.assign()会拷贝原始对象中的所有属性到一个新对象上，如果属性为对象，则拷贝的是对象的地址，改变对象中的属性值，新拷贝出来的对象依然会受影响。
```js
var obj = {
  name: '张三',
  age: 23,
  isStudent: false,
  job: {
    name: 'FE',
    money: 12
  }
}
var newObj = Object.assign({}, obj);
obj.job.money = 21;
console.log(newObj.name);     // 输出张三
console.log(newObj.age);      // 输出23
console.log(newObj.job.money);// 输出21，受影响
```
**第二种方法：** `...` 扩展运算符是 `ES6` 新增加的内容
```js
var obj = {
  name: '张三',
  age: 23,
  isStudent: false,
  job: {
    name: 'FE',
    money: 12
  }
}
var newObj = {...obj};
obj.job.money = 21;
console.log(newObj.name);     // 输出张三
console.log(newObj.age);      // 输出23
console.log(newObj.job.money);// 输出21，受影响
```

:::tip 深拷贝几种实现方式
1. 配合使用 `JSON.parse()` 和 `JSON.stringify()` 两个函数(局限性比较大)
2. 实现自己的简易深拷贝方法
3. `lodash` 第三方库实现深拷贝
:::

**第一种方法：** 利用JSON的序列化和反序列化方法，可以实现简易对象深拷贝，但此种方法有较大的限制：
1. 会忽略属性值为undefined的属性
2. 会忽略属性为Symbol的属性
3. 不会序列化函数
4. 不能解决循环引用的问题，直接报错
```js
var obj = {
  name: '张三',
  age: 23,
  address: undefined,
  sayHello: function() {
    console.log('Hello');
  },
  isStudent: false,
  job: {
    name: 'FE',
    money: 12
  }
}
var newObj = JSON.parse(JSON.stringify(obj));
obj.job.money = 21;
console.log(newObj.name);      // 输出张三
console.log(newObj.age);       // 输出23
console.log(newObj.job.money); // 输出12

console.log(newObj.address);   // 报错
console.log(newObj.sayHello());// 报错
```

**第二种：** 实现自己简易的深拷贝函数
```js
function deepClone(obj) {
  function isObject(o) {
    return (typeof o === 'object' || typeof o === 'function') && o !== null;
  }
  if(!isObject(obj)) {
    throw new Error('非对象');
  }
  var isArray = Array.isArray(obj);
  var newObj = isArray ? [...obj] : {...obj};
  Reflect.ownKeys(newObj).forEach(key => {
    newObj[key] = isObject(newObj[key]) ? deepClone(newObj[key]) : newObj[key];
  })
  return newObj;
}
var obj = {
  name: 'AAA',
  age: 23,
  job: {
    name: 'FE',
    money: 12000
  }
}
var cloneObj = deepClone(obj);
obj.job.money = 13000;
console.log(obj.job.money);     // 输出13000
console.log(cloneObj.job.money);// 输出12000
```

**第三种方法：** 使用[lodash](https://lodash.com/docs#cloneDeep)第三方函数库实现(需要先引入lodash.js)
```js
var obj = {
  name: '张三',
  age: 23,
  isStudent: false,
  job: {
    name: 'FE',
    money: 12
  }
}
var newObj = _.cloneDeep(obj);
obj.job.money = 21;
console.log(newObj.name);     // 输出张三
console.log(newObj.age);      // 输出23
console.log(newObj.job.money);// 输出12，不受影响
```

## 继承
在 JavaScript `ES6`之前，实现继承需要依赖原型、原型链和构造函数等等技术手段组合使用，在 `ES6` 之后，可以使用Class类继承(并没有真正的类，只是一个语法糖，实质依然是函数)

:::tip 继承的几种方式
1. 原型链实现继承
2. 借用构造函数实现继承
3. 组合继承
4. 寄生组合继承
5. 类继承
:::

### 1. 原型链继承
:::tip
利用原型让一个引用类型继承另一个引用类型的属性和方法，这种方式实现的继承，创建出来的实例既是子类的实例，又是父类的实例。它有如下几种缺陷：
1. 不能向父类构造函数传参
2. 父类上的引用类型属性会被所有实例共享，其中一个实例改变时，会影响其他实例
:::
```js
function Super() {
  this.colors = ['red','blue'];
}
function Sub(name) {
  this.name = name;
}
Sub.prototype = new Super();

var Sub1 = new Sub('旺财');
var Sub2 = new Sub('钢镚');
Sub2.colors.push('yellow');
console.log(Sub1.colors); // ["red", "blue", "yellow"]
console.log(Sub2.colors); // ["red", "blue", "yellow"]

console.log(Sub1 instanceof Sub);     // true
console.log(Sub1 instanceof Super);   // true
```
继承是通过创建 `Super` 的实例，并将该实例赋给 `Sub.prototype` 实现的。实现的本质是重写原型对象

### 2. 借用构造函数继承
:::tip 
借用构造函数实现继承，通过在子类中使用call()方法，实现借用父类构造函数并向父类构造函数传参的目的。但这种方法的缺陷：
- 无法继承父类原型对象上的属性和方法。
:::
```js
function Super(){ 
 this.colors = ["red", "blue", "green"]; 
} 
function Sub(){ 
 //继承了 Super 
 Super.call(this); 
} 
var instance1 = new Sub(); 
instance1.colors.push("black"); 
console.log(instance1.colors);      //"red,blue,green,black" 
var instance2 = new Sub(); 
console.log(instance2.colors);      //"red,blue,green" 

```

### 3. 组合继承
:::tip 
将原型链和借用构造函数的技术组合到一块，从而发挥二者之长的一种继承模式
:::
```js
function Super() {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}
Super.prototype.sayName = function() {
  console.log(this.name);
}
function Sub(name, age) {
  // 继承属性
  Super.call(this, name);
  this.age = age;
}

//继承方法
Sub.prototype = new Super();
Sub.prototype = constructor = Subtype;
Sub.prototype.sayAge = function() {
  console.log(this.age);
}
var instance1 = new Sub('Nicholas', 29)
instance1.colors.push("black"); 
alert(instance1.colors); //"red,blue,green,black" 
instance1.sayName(); //"Nicholas"; 
instance1.sayAge(); //29 

var instance2 = new SubType("Greg", 27); 
alert(instance2.colors); //"red,blue,green" 
instance2.sayName(); //"Greg"; 
instance2.sayAge(); //27 
```

### 4. 寄生式继承
:::tip 
创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后再像真地是它做了所有工作一样返回对象，缺陷：
- 会共享作为新对象基础的对象属性为引用类型的值
:::
```js
function object(o){ 
  function F(){} 
  F.prototype = o; 
  return new F(); 
} 

function createAnother(original){ 
  var clone = object(original); //通过调用函数创建一个新对象
  clone.sayHi = function(){ //以某种方式来增强这个对象
    console.log("hi"); 
  }; 
  return clone; //返回这个对象
} 

var person = { 
  name: "Nicholas", 
  friends: ["Shelby", "Court", "Van"] 
}; 
var anotherPerson = createAnother(person); 
var yetAnotherPerson = createAnother(person);
yetAnotherPerson.friends.push('casa')

console.log(anotherPerson.friends);
console.log(yetAnotherPerson.friends);
anotherPerson.sayHi();  //"hi" 

```











