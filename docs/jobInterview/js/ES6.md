---
sidebarDepth: 1
---
# ES6 面试题

## ● var、let 和 const 的区别
:::tip
1. `var` 声明的变量会提升到作用域的顶部，而 `let` 和 `const` 不会进行提升
2. `var` 声明的全局变量会被挂载到全局 `window` 对象上，而 `let` 和 `const` 不会
3. `var` 可以重复声明同一个变量，而 `let` 和 `const` 不会
4. `var` 声明的变量作用域范围是函数作用域，而 `let` 和 `const` 声明的变量作用域范围是块级作用域。
5. `const` 声明的常量，一旦声明则不能再次赋值，再次赋值会报错(更改对象属性不会，因为对象地址没有变)
:::

#### 作用域提升：
```js
console.log(a);  // 输出undefined
console.log(b);  // 报错
console.log(PI); // 报错
var a = 'abc';
let b = 'ABC';
const PI = 3.1415;
```

#### 挂载到全局变量：
```js
var a = 'abc';
let b = 'ABC';
const PI = 3.1415;

console.log(window.a);  // 输出abc
console.log(window.b);  // 输出undefined
console.log(window.PI); // 输出undefined
```

#### 重复声明变量：
```js
var a = 'abc';
var a;
console.log(a); // 输出abc

let b = 'ABC';
let b;// 报错
```

#### 变量的作用域范围：
```js
function foo() {
  var flag = true;
  if(flag) {
    var a = 'abc';
    let b = 'ABC';
    console.log(a); // 输出abc
    console.log(b); // 输出ABC
  }
  console.log(a); // 输出abc
  console.log(b); // 报错
}
foo();
```

#### const 常量
```js
const PI = 3.1415;
PI = 3.1415926; // 报错

const obj = {
  a: 1,
  b: 2
}
obj.a = 3

console.log(obj)   //{a: 3, b: 2}
```

## ● 扩展/收缩符
:::tip
ES6新增加的运算符 `...`，称为扩展或者收缩，具体作用取决于到底如何使用。
:::
```js
// ...的扩展
function foo(x,y,z) {
  console.log(x,y,z); // 输出1,2,3
}
var arr = [1,2,3];
foo(...arr);          // 扩展数组：ES6写法
foo.apply(null,arr);  // 扩展数组：ES5写法


// ...的收缩
// 1.收集参数：ES6写法
function bar(...arr) {
  console.log(arr);   // 输出[1,2,3,4,5]
}
// 2.收集参数：ES5写法
function foo(){
  var args = Array.prototype.slice.call(arguments);
  console.log(args);  // 输出[1,2,3,4,5]
}
bar(1,2,3,4,5);
foo(1,2,3,4,5)
```
