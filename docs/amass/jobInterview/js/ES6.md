---
sidebarDepth: 1
---
# ES6 面试题
[[toc]]

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

## ● 什么时候不能使用箭头函数
### 1. 定义对象方法
#### 定义字面量方法
```js
const calculator = {
    array: [1, 2, 3],
    sum: () => {
        console.log(this === window); // => true
        return this.array.reduce((result, item) => result + item);
    }
};

calculator.sum();   // Throws "TypeError: Cannot read property 'reduce' of undefined"
```
上面代码，定义对象方法的时候使用箭头函数，调用方法的时候执行上下文的 `this` 指向 `window`，就会访问不到对象里的属性

**解决办法**：使用`函数表达式`或者 `方法简写` 来定义方法，这样能确保 `this` 是在运行时是由包含它的上下文决定的
```js
const calculator = {
    array: [1, 2, 3],
    sum() {
        console.log(this === calculator); // => true
        return this.array.reduce((result, item) => result + item);
    }
};
calculator.sum(); // => 6
```

#### 定义原型方法
同样的规则适用于原型方法（prototype method）的定义，使用箭头函数会导致运行时的执行上下文错误
```js
function Cat(name) {
    this.name = name;
}

Cat.prototype.sayCatName = () => {
    console.log(this === window); // => true
    return this.name;
};

const cat = new Cat('Mew');
cat.sayCatName(); // => undefined

```

### 2. 定义事件回调函数
```js
const button = document.getElementById('myButton');
button.addEventListener('click', () => {
    console.log(this === window); // => true
    this.innerHTML = 'Clicked button';
});
```
客户端编程中常见的 `DOM` 事件回调函数（event listenner）绑定，触发回调函数时 `this` 指向当前发生事件的 `DOM` 节点，而动态上下文这个时候就非常有用

而在上面的代码中浏览器会尝试用 `button` 作为上下文来执行事件回调函数，但是箭头函数预定义的上下文是不能被修改的，这样 `this.innerHTML` 就等价于 `window.innerHTML`，而后者是没有任何意义的。

### 3. 定义构造函数
构造函数中的 `this` 指向新创建的对象，当执行 `new Car()` 的时候，构造函数 `Car` 的上下文就是新创建的对象，也就是说 `this instanceof Car === true`。显然，箭头函数是不能用来做构造函数， 实际上 `JS` 会禁止你这么做，如果你这么做了，它就会抛出异常。
```js
const Message = (text) => {
    this.text = text;
};
// Throws "TypeError: Message is not a constructor"
const helloMessage = new Message('Hello World!');
```

### 4. 追求过短的代码
压缩了太多逻辑的简短代码，阅读起来就没有那么直观，可读性差
```js
const multiply = (a, b) => b === undefined ? b => a * b : a * b;
const double = multiply(2);
double(3);      // => 6
multiply(2, 3); // => 6
```
使用普通函数更直观
```js
function multiply(a, b) {
    if (b === undefined) {
        return function (b) {
            return a * b;
        }
    }
    return a * b;
}

const double = multiply(2);
double(3); // => 6
multiply(2, 3); // => 6
```




