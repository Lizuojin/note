---
# sidebar: auto
sidebarDepth: 1
---
# JavaScript基础知识面试题

## new 的实现原理
1. 创建一个新对象
2. 新对象的 `__proto__` 指向构造函数的 prototype 原型对象上，并继承原型上的属性和方法
3. 执行构造函数，构造函数的 this 指向新对象
4. 如果构造方法返回了一个对象，那么返回该对象，否则返回第一步创建的新对象
```js
function _new(fn, ...args) {
  const obj = Object.create(fn.prototype);
  const result = fn.apply(obj, args)
  return typeof reslut === 'object' && reslut !== null ? reslut : obj 
}
```

## 函数防抖
动作停止后的时间超过设定的时间时执行一次函数，核心思路是利用 `setTimeout` 延迟执行某个方法，最常见的函数防抖就是，搜索框只有用户在输入完毕后才去服务器执行查询
```js
function debounce(fn, delay) {
  var timer = null;
  return function() {
    var context = this;
    if(timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.call(context, ...arguments)
    }, delay || 500);
  }
}
window.onresize = debounce(function() {
  console.log('window onresize end');
}, 1000)
```

## 函数节流
一定时间内执行的操作只会执行一次，间隔执行
```js
function throttle(fn, delay) {
  let flag = true;
  return function() {
    if(!flag) return;
    flag = false;
    setTimeout(function() {
      fn();
      flag = true;
    }, delay || 500)
  }
}

window.onresize = throttle(function() {
  console.log('window onresize end');
}, 1000)
```








