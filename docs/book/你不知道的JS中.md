---
sidebar: auto
# sidebarDepth: 4
---
# 你不知道的JS中
## 类型和语法
### 类型
---
类型是值内部特征，它定义了值得行为，以使其区别与其他值
> 例如，语言引擎和开发人员对42(数字)和'42'(字符串)采取不同的处理方式

### 内置类型
---
:::tip JavaScript 有七种内置类型:

- 空值(null)
- 未定义(undefined)
- 布尔值(boolean)
- 数字(number)
- 字符串(string)
- 对象(object)
- 符号(symbol，ES6中新增)
:::

#### 查看值的类型
类型和它们的字符串值对应，除了null
```js
typeof undefined === 'undefined';   // true
typeof true === 'boolean';          // true
typeof 42 === 'number';             // true
typeof '42' === 'string';           // true
typeof {life: 42} === 'object';     // true
typeof Symbol() === 'symbol';       // true
```
#### 特殊的null
唯一一个用typeof 检测会返回 'object' 的基本类型
```js
typeof null === 'object';   // true

// 复合条件来检测 null 值得类型
var a = null;
(!a && typeof a === 'object');    // true
```

### 值和类型
---
JavaScript 中的变量是没有类型的，只有值才有，变量可以随时持有任何类型的值

### undefined 和 undeclared
---
:::tip 区别
- **undefined:** 作用域中声明但还没有赋值的变量
- **undeclared:** 作用域中未声明过的变量
:::
```js
var a;
a;          // undefined
b;          // ReferenceError: b is not defined

// 注意 undeclared 变量，typeof 照样返回 undefined
typeof a;   // undefined
typeof b;   // undefined
```

### 数组
---
数组可以容纳任何类型的值，可以是**字符串、数字、对象、数字**

:::tip 稀疏数组
含有空白或空缺单元的数组
:::
```js
// 数组也是对象，所以也可以包含字符串键值和属性，但不计算在数组长度内
var a = [];
a[0] = 1;
a['foobar'] = 2;

a.length;     // 1
a['foobar'];  // 2
a.footer;     // 2

// 字符串键值能够被强制类型转换为十进制数字的话，会被当作数字索引处理
var b = [];
a['13'] = 42;
a.length;   //14
```
<br/>

:::tip 类数组
与数组的结果类似，但并不是真正的数组

转换成真正数组：
- Array.prototype.slice() 工具函数转
- Array.from() ES6新方法转
:::
```js
function foo(){
  var arr = Array.prototype.slice.call(arguments);
  var arr2 = Array.from(arguments);
  arr.push(3);
  arr2.push(4);
  // 输出[1, 2, 3]
  console.log(arr);
  // 输出[1, 2, 4]
  console.log(arr2);
}
foo(1,2);
```

### 字符串
---
字符串是类数组：
- 有length属性
- 有indexOf()和concat()方法
```js
// 字符串和数组的相似之处
var a = "foo";
var b = ['f','o','o'];
console.log(a.length); // 输出3
console.log(b.length); // 输出3

console.log(a.indexOf('o')); // 输出1
console.log(b.indexOf('o')); // 输出1

var c = a.concat('bar');
var d = b.concat(['b','a','r']);
console.log(c); // 输出foobar
console.log(d); // 输出['f','o','o','b','a','r']
```
<br/>

:::tip 字符串的不可变性
字符串的成员函数不会改变原始的值，而是创建并返回一个新的字符串
:::
```js
// 字符串的不可变性
var a = 'foo';
var b = a.concat('bar');
console.log(b); // 输出foobar
console.log(a); // 输出foo，不变

var c = a.toUpperCase();
console.log(c); // 输出FOO
console.log(a); // 输出foo，不变
```

#### 字符串借用数组的方法
```js
// 字符串借用数组的方法
var a = 'foo';
var b = Array.prototype.join.call(a,'-');
console.log(b); // 输出f-o-o
var c = Array.prototype.map.call(a,function(v){
  return v.toUpperCase()+'.';
}).join('');
console.log(c); // 输出F.O.O.
```

#### 字符串借用数组方法反转
```js

var a = 'abc';
var b = a.split('').reverse().join('');
console.log(b); // 输出abc
```

### 数字的语法
---
```js
// JavaScript 中的数字字面量一般用十进制表示
var a = 42;
var b = 42.3;

// 小数点前面的0可以省略
var a = 0.42;
var b = .42;

// 小数部分后面的0也可以省略
var a = 42.0;
var b = 42.;
```

### 较小的数值
---
二进制浮点数最大的问题：
```js
console.log(0.1 + 0.2 === 0.3) // false
```

#### 怎么来判断0.1+0.2与0.3是否相等呢？
设置一个误差范围值：2^-52(2.220446049250313e-16)，该值定义在 Number.EPSILON 中
```js
// 比较两个数字是否相等
function num(n1, n2) {
  return Math.abs(n1 - n2) < Number.EPSILON
}

var a = 0.1 + 0.2;
var b = 0.3;

console.log(num(a,b));                     // true
console.log(num(0.0000001, 0.0000002));    // false
```
### 整数的安全范围
---
- 最大整数是2^52 - 1，即9007199254740991，ES6定义为Number.MAX_SAFE_INTEGER
- 最小整数是-9007199254740991，ES6定义为Number.MIN_SAFE_INTEGER

### 整数检测
---
```js
// Number.isInteger() 方法
Number.isInteger(42);       // true
Number.isInteger(42.000);   // true
Number.isInteger(42.3);     // false
```

#### 检测值是否是安全整数
```js
// Number.isSafeInteger() 方法
Number.isSafeInteger(Number.MAX_SAFE_INTEGER);    // true
Number.inSafeInteger(Math.pow(2, 53));            // false
Number.inSafeInteger(Math.pow(2, 53) - 1);        // true
```

### 特殊数值
---
:::tip 不是值的值
- null 指空值，从未赋值
- undefined 指没有值，曾赋过值，但是目前没有值
:::
```js
// void 运算符
var a = 42;
console.log(void a; a); // undefined 42
```

#### 特殊的数字
:::tip NaN
- 是一个“警戒值”(有特殊用途的常规值)。执行数学运算没有成功，失败后返回的结果
- 它和自身不相等
:::

#### isNaN 判断值是否是 NaN
```js
var a = 2 / 'foo';
var b = 'foo'
isNaN(a);   // true
isNaN(b);   // true，缺陷：只是检查参数是否不是NaN，也不是数字

```
```js
// 可靠的方法
if(!Number.isNaN) {
  Number.isNaN = function(n) {
    return n !== n;
  }
}
```
### 值和引用
---
JavaScript 的引用指向的是值本身而非变量
:::tip 
- 简单值(基本类型值)：通过值复制的方式来赋值/传递
- 复合值：通过引用复制的方式来赋值/传递
:::
```js
var a = 2;
var b = a;
b++;
console.log(a);   // 2
console.log(b);   // 3

var c = [1, 2, 3];
var d = c;
d.push(4);
console.log(c);   // [1, 2, 3, 4]
console.log(d);   // [1, 2, 3, 4]
```
- 变量b持有变量a的一个复本，变量b改变时，变量a的值保持不变
- 变量c和变量d则分别指向同一个复合值[1, 2, 3] 的两个不同引用

#### 函数参数
向函数传递复合类型值，只是复制一份引用给函数
```js
function foo(x) {
  x.push(4);
  consolog.log(x);  // [1,2,3,4]

  x = [4,5,6];
  x.psuh(7);
  consolog.log(x);  // [4,5,6,7]
}
```

### 原生函数
---
:::tip 常用的原生函数
- String()
- Number()
- Boolean()
- Array()
- Object()
- Function()
- RegExp()
- Date()
- Error()
- Symbol()
:::

构造函数创建出来的是封装了基本类型值的封装对象
```js
var a = new String('abc');
console.log(typeof a);              // 是object，不是String
console.log(a instanceof String);   // true
Object.prototype.toString.call(a);  // '[object String]'
```
new String('abc') 创建的是字符串 'abc' 的封装对象，而非基本类型值 'abc'

### 内部属性[[Class]]
---
- 所有 typeof 返回值为 'object' 的对象都包含一个内部属性
- 通过 Object.prototype.toString.call() 查看
```js
Object.prototype.toString.call([1,2,3]);               // '[object, Array]' 
Object.prototype.toString.call( /regex-literal/i );    // '[object, RegExp]'
```

```js
Object.prototype.toString.call(null);           // '[object, null]'             
Object.prototype.toString.call( undefined );    // '[object, undefined]' 
```

```js
// 
Object.prototype.toString.call('abc');     // '[object, String]'             
Object.prototype.toString.call( 42 );      // '[object, Number]' 
Object.prototype.toString.call( true );    // '[object, Boolean]'
```
### 封装对象包装
---
JavaScript 会自动为基本类型值包装一个封装对象
```js
// 基本类型值没有 .length 和 .toString 这样的属性和方法，通过封装对象才能访问
var a = 'abc';
a.length;       //  3
a.toUpperCase   //  'ABC'
```
```js
// false 创建了一个封装对象，对象是真值，总是返回true
var a = new Boolean(false);
if(!a) {
  console.log('ABC');   // 执行不到这里
}
```

#### 拆封
```js
var a = new String('abc');
var b = new Number(42);
var c = new Boolean(true);

a.valueOf();    // 'abc'
b.valueOf();    // 42
c.valueOf();    // true
```

### 强制类型转换
---
- 类型转换(显式)：发生在静态类型语言的编译阶段
- 强制类型转换(隐式)：发生在动态类型语言的运行时

:::tip JavaScript 统称为强制类型转换
- 隐式强制类型转换
- 显式强制类型转换
> 非JavaScript 规范的标准，区分用于理解
:::
```js
var a = 42;
var b = a + '';     // 隐式强制类型转换
var c = String(a);  // 显式强制类型转换
```
---
---
#### ToString
:::tip 转换规则
- 数字按照规则转换成对应的字符串格式
- null转换成字符串null
- undefined转换成字符串undefined
- 布尔值转换成对应的字符串格式，true转换成字符串true,false转换成字符串false
- 数组，将所有单元以,号连接起来
- 对象，如果对象没有重新定义其toString()方法，返回其对应的内部属性[[CLASS]]的值，如[object Object]
:::
```js
// ToString类型转换的规则
var a = 42;
var b = null;
var c = undefined;
var d = true;
var e = [1,2,3];
var f = {
  name: 'www',
  age: 12,
  toString: function(){
    return this.age
  }
}
var h = {
  name: 'AAA',
  age: 11
}

console.log(a.toString());  // 输出42
console.log(b.toString());  // 输出null 
console.log(c.toString());  // 输出undefined
console.log(d.toString());  // 输出true
console.log(e.toString());  // 输出1,2,3
console.log(f.toString());  // 输出12，f对象重新定义了toString()方法
console.log(h.toString());  // 输出[object Object]，返回的是h对象的内部属性[[CLASS]]的值
```
---
---
#### JSON 字符串化
:::tip 转换规则
- 数字字符串化为其对应的字符串格式
- 字符串字符串化为其对应的字符串格式，但有两对引号，其中一对是字符串本身的
- 布尔字符串为其对应的字符串格式
- null 字符串化为 "null"
- undefined 自动忽略
- 数组字符串化为其对应的字符串化格式，例如[1,2,3]字符串化为"[1,2,3]"
- undefined、function和symbol，对象中会自动忽略；数组中则返回null以保证数组中单元位置不变
:::
```js
var a = 42;
var b = 'abc';
var c = true;
var d = null;
var e = [1,2,3]
console.log(JSON.stringify(a)); // 输出"42"
console.log(JSON.stringify(b)); // 输出""abc""
console.log(JSON.stringify(c)); // 输出"true"
console.log(JSON.stringify(d)); // 输出"null"
console.log(JSON.stringify(e)); // 输出"[1,2,3]"

var f = undefined;
var h = [1,undefined,function(){},4];
var i = {
  name:'why',
  age: 12,
  sayHello: function(){
    consoel.log(this.age)
  },
  a: undefined
}

console.log(JSON.stringify(f)); // 忽略，变成undefined
console.log(JSON.stringify(h)); // 忽略数组第二项，第三项 输出"[1,null,null,4]"
console.log(JSON.stringify(i)); // 忽略对象中的方法，sayHello属性不字符串化，输出"{"name":'why',"age": 12}"
```
<br/>

:::tip JSON字符串对象
- 未定义其toJSON方法，则按正常规则进行序列化
- 定义了其toJSON方法，则按具体定义toJSON()方法的返回值来进行序列化
> 对象的字符串化方法toJSON()并不是直接返回字符串化的值，而是返回一个能够被JSON字符串化的一个JSON安全的值，最后通过JSON.stringify()来字符串化
:::
```js
var obj1 = {
  name: 'why',
  age: 12
}
var obj2 = {
  name: 'why',
  age: 12,
  toJSON: function(){
    // 只字符串化name属性，age属性不
    return {
      name:this.name
    };
  }
}

console.log(JSON.stringify(obj1)); // 输出{"name":"why","age":12}
console.log(JSON.stringify(obj2)); // 输出{"name":"why"}
```
<br/>

:::tip JSON字符串化参数运用
- 第一个可选参数：可以是一个数组或者一个函数，用来指定对象序列化过程中，哪些属性应该被处理，哪些属性应该被排斥。当参数为数组时，只序列化数组中的属性；当参数为函数时，函数返回什么就序列化什么。
- 第二个可选参数：用来指定输出的缩进格式
:::
```js
var obj = {
  a: 42,
  b: '42',
  c: true,
  d: [1,2,3]
}
var result1 = JSON.stringify(obj,['a','b','d']);
var result2 = JSON.stringify(obj,function(key,value){
  if(key!=='c'){
    return value;
  }
})

console.log(result1); // 打印{"a":"42","b":"42","d":"[1,2,3]"}}(给什么输出什么)
console.log(result2); // 打印{"a":"42","b":"42","d":"[1,2,3]"}}(返回什么输出什么)
```
---
---
#### ToNumber
:::tip 转换规则
- true转换为1
- false转换为0
- 空字符串转换为0，非空字符串转换为1
- null转换为0，undefined转换为NaN
- 对象或者数组，先查找valueOf()再查找toString()，都没有则报TypeError错误
:::
```js
var a = true;
var b = false;
var c = null;
var d = undefined;
var e = {
  a: 42,
  valueOf: function(){
    return this.a;
  },
  toString: function(){
    return 24;
  }
}
var f = {
  a: 42,
  toString: function(){
    return this.a;
  }
}
var h = [1,2,3];
h.toString = function(){
  return this.join('');
}

console.log(Number(a)); // 输出1
console.log(Number(b)); // 输出0
console.log(Number(c)); // 输出0
console.log(Number(d)); // 输出NaN
console.log(Number(e)); // 输出42，先判断valueOf()
console.log(Number(f)); // 输出42,没有valueOf()时，判断toString()
console.log(Number(h)); // 输出123
```
---
---
#### ToBoolean
:::tip 转换规则
- 假值：可以被强制类型转换为false的值
- 真值：除了假值的转换为true
> **JS规范假值表：** 
> - undefined
> - null
> - false
> - +0、-0和NaN
> - 空字符串
:::
```js
var a = Boolean(42);
var b = Boolean(0);
var c = Boolean(null);
var d = Boolean(undefined);
var e = Boolean('');
var f = Boolean('0');
var g = Boolean('false');
var h = Boolean(NaN);
var i = Boolean([]);
var j = Boolean({});
var k = Boolean(function(){console.log('k')});

console.log(a);   // 输出true
console.log(b);   // 输出false
console.log(c);   // 输出false
console.log(d);   // 输出false
console.log(e);   // 输出false
console.log(f);   // 输出true
console.log(g);   // 输出true
console.log(h);   // 输出fasle
console.log(i);   // 输出true
console.log(j);   // 输出true
console.log(k);   // 输出true
```
---
---
#### 显示强制类型转换(字符串与数字之间)
:::tip 
- 数字转字符串用String()方法，没有使用new
- 字符串转数字用Number()方法，没有使用new
- 其他方法
:::
```js
// String()方法和Number()方法
var a = 42;
var b = String(a);

var c = "3.14";
var d = Number(c);

console.log(b); // 输出"42"
console.log(d); // 输出3.14
```
```js
// 字符串与数字之间转换的其他方法
var a = 42;
var b = a.toString(); // 隐式类型转换，创建一个封装对象

var c = "3.14";
var d = +c; // 一元运算符，显示转换为数字类型

console.log(b); // 输出"42"
console.log(d); // 输出3.14
```
---
---
#### 显示强制类型转换(显式解析数字字符串)
解析字符串中的数字和将字符串强制类型转换为数字的返回结果都是数字，但解析和转换有所区别
```js
var a = '42';
var b = '42px';
Number(a);    // 42
parseInt(a);  // 42

Number(b);    // NaN
parseInt(b);  // 42
```
