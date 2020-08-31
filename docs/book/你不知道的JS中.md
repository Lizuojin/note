---
sidebar: auto

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