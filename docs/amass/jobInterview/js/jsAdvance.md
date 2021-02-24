---
# sidebar: auto
sidebarDepth: 1
---
# JavaScript 进阶知识面试题
[[toc]]
## ● new 的实现原理
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

## ● 函数防抖
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

## ● 函数节流
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

## ● 手写一个 `jsonp`
```js
var jsonp = function(url,param,callback){
	//处理url地址,查找？，如果没有？这个变量就有一个"?"，有？这个变量接收一个&
	var querystring = url.indexOf("?") == -1 ? "?" : "&";

	//处理参数{xx:xx}
	for(var k in param) {
		querystring += k + "=" + param[k] + '&';//?k=para[k]
	}

	//处理回调函数名
	var random = Math.random().toString().replace(".","");
	var cbval = "my_jsonp" + random;
	var cb = "callback="+cbval;

	querystring += cb;

	var script = document.createElement("script");
	script.src = url + querystring;

	//把回调函数的名字附给window
	window[cbval] = function(param) {
		//这里执行回调的操作，用回调来处理参数
		callback(param);
		//拿到了就删掉这个script
		document.body.removeChild(script);
	};
	document.body.appendChild(script);
}

jsonp(
	"https://www.baidu.com",
	{aa:11},
	function(){
		console.log(param);
	}
);
```

## ● 两个数组找重复的值
使用 `filter()` 遍历方法结合 `indexOf()` 
```js
var array1 = [1, 2];
var array2 = [2, 3];

var newArr = array1.filter(function(n) {
    return array2.indexOf(n) != -1
});
console.log(newArr); // [2]
```

## ● 手写一个 Promise
结合 Promise/A+ 规范，我们可以分析出 `Promise` 的基本特征：
1. promise 有三个状态：pending，fulfilled，or rejected；「规范 Promise/A+ 2.1」
2. new promise时， 需要传递一个executor()执行器，执行器立即执行；
3. executor接受两个参数，分别是resolve和reject；
4. promise  的默认状态是 pending；
5. promise 有一个value保存成功状态的值，可以是undefined/thenable/promise；「规范 Promise/A+ 1.3」
6. promise 有一个reason保存失败状态的值；「规范 Promise/A+ 1.5」
7. promise 只能从pending到rejected, 或者从pending到fulfilled，状态一旦确认，就不会再改变；
8. promise 必须有一个then方法，then 接收两个参数，分别是 promise 成功的回调 onFulfilled, 和 promise 失败的回调 onRejected；「规范 Promise/A+ 2.2」
9. 如果调用 then 时，promise 已经成功，则执行onFulfilled，参数是promise的value；
10. 如果调用 then 时，promise 已经失败，那么执行onRejected, 参数是promise的reason；
11. 如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 then 的失败的回调onRejected；

```js
const PENDING = 'PENDING';
const FUFILLED = 'FUFILLED';
const REJECTED = 'REJECTED';

class Promise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];

        let resolve = (value) => {
            if(this.status === PENDING) {
                this.status = FUFILLED;
                this.value = value;
                this.onResolvedCallbacks.forEach(fn => fn())
            }
        }

        let reject = (reson) => {
            if(this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }

        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }

    then(onFufilled, onRejected) {
        if(this.status === FUFILLED) {
            onFufilled(this.value)
        }
        if(this.status == REJECTED) {
            onRejected(this.reason)
        }
        if(this.status === PENDING) {
            this.onResolvedCallbacks.push(() => {
                onFufilled(this.value)
            })
            this.onRejectedCallbacks.push(() => {
                onRejected(this.reson)
            })
        }
    }
}
```
测试一下：
```js
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('成功');
    },1000);
}).then(
    (data) => {
        console.log('success', data)
    },
    (err) => {
        console.log('faild', err)
    }
)

```