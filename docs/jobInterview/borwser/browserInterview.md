# 浏览器相关面试题
## 事件机制
:::tip 注册事件
注册事件，我们一般使用 `addEventListener(name, callback, boolean)` 函数，该函数支持三个参数，参数说明如下：
- `name`：代表待注册事件的名字，例如：`click` 或者 `mouseover`
- `callback`：代表注册事件的回调函数
- `boolean`：一个 `boolean` 值，为 `true` 代表事件捕获时触发，为 `false` 时代表事件冒泡时触发。参数缺省时默认为 `false`
:::
```js
// 一个注册事件的案例
// 点击DOM元素时。顺序打印出：捕获时触发 冒泡时触发
var box = document.getElementById('box');
box.addEventListener('click', () => {
  console.log('捕获时触发');
}, true);
box.addEventListener('click',() => {
  console.log('冒泡时触发');
}, false);
```

### 事件触发顺序
在浏览器中，事件的触发顺序一般而言依据：**捕获->目标阶段->冒泡**三个顺序。但事件的触发顺序并不总是按以上顺序执行，当我们给同一个DOM元素同时注册捕获和冒泡事件时，事件的触发顺序是按你注册事件的顺序来执行的。
```js
// 点击DOM元素时。顺序打印出：冒泡时触发 捕获时触发
var box = document.getElementById('box');
box.addEventListener('click',() => {
  console.log('冒泡时触发');
}, false);
box.addEventListener('click', () => {
  console.log('捕获时触发');
}, true);
```
**阻止事件冒泡：** stopPropagation()和stopImmediaPropagation()方法都能阻止事件的向上冒泡，但这两者是有区别的：stopImmediaPropagation()还能阻止目标执行别的注册事件。
```js
// 阻止事件冒泡
// 1. 当不阻止冒泡时，window的click会触发
// 2. 当使用stopPropagation()时，window的click不会被触发
// 3. 当使用stopImmediatePropagation()时，DOM的捕获事件不会触发，window的click不会触发
var box = document.getElementById('box');
box.addEventListener('click',(event) => {
  console.log('冒泡时触发');
  // event.stopPropagation();
  // event.stopImmediatePropagation();
}, false);
box.addEventListener('click', (event) => {
  console.log('捕获时触发');
}, true);
window.addEventListener('click', (event) => {
  console.log('子元素点击事件向上冒泡时触发');
})
```

## 跨域
:::tip 同源策略
同源策略是指，一个源的客户端脚本在没有明确授权的情况下，不能访问另一个源的客户端脚本。当一个URL和另一个URL，只要协议、域名或者端口号有一个不同，则就会出现跨域。 解决跨域常用方法有：
1. JSONP
2. CORS
3. document.domain
4. postMessage
:::

### 1. JSONP实现跨域

:::tip 原理
JSONP实现跨域的原理是利用 `script` 标签没有跨域限制，通过 `src` 指向一个 `ajax` 的URL，最后跟一个回调函数 `callback`
:::
```js
// 一个JSONP跨域的案例
<script src="http://www.baidu.com/getUserInfo?name=张三&callback=jsonp"></script>
function jsonp() {
  console.log('JSONP实现跨域');
}
```
```js
// 实现自己的JSONP
var jsonp = function (url, data, callback) {
  var cbName = 'callback_' + new Date().getTime();
  var queryString = url.indexOf('?') == -1 ? '?' : '&';
  for (var k in data) {
    queryString += k + '=' + data[k] + '&';
  }
  queryString += 'callback=' + cbName;
  var script = document.createElement('script');
  script.src = url + queryString;
  window[cbName] = function (data) {
    callback(data);
    document.body.removeChild(script);
  };
  document.body.appendChild(script);
}
// 实测
jsonp('http://api.douban.com/v2/movie/in_theaters', {'count': 1}, function (data) {
  console.log(data)
})
```

### 2. CORS实现跨域
:::tip
CORS：`CORS` 需要浏览器和后端同时配合才能生效，后端通过设置 `Access-Control-Allow-Origin` 就可以开启哪些域名可以使用 `CORS` 跨域，在进行 `CORS` 跨域请求时，会出现简单请求或者复杂请求
- **CORS简单请求：** 当请求方式为`get`、`head`、`post`之一并且`Content-Type`为 `text/plain` 、`multipart/form-data`、`application/x-www-form-urlencoded`三种之一时，就是简单请求。
- **CORS复杂请求：**  当不符合简单请求时，就是复杂请求，对于复杂请求来说，首先会发送一个option请求，用于知道服务器是否允许跨域请求
:::

### 3. document.domain实现跨域
:::tip 
`document.domain`只能用于二级域名相同的情况下
:::
```js
// 域名a.test.com 和域名b.test.com
// 设置如下代码后，二级域名为test.com的网站都能实现跨域
document.domain = 'test.com'
```

### 4. postMessage
:::tip 
`postMessage` 一般用于获取嵌套在页面中的第三方页面的数据，一个页面发送请求，另外一个页面判断来源并接受请求。
:::
```html
<body>
  <iframe src="https://www.baidu.com" frameborder="0"></iframe>
</body>
```

```js
// 父页面发送请求
window.frames[0].postMessage('getcolor','*');
// 父页面接受请求
window.addEventListener('message',function(e){
  console.log(e.data); // 打印red
},false);

// 子页面发送请求
window.addEventListener('message',function(e){
  window.parent.postMessage('red','*');
},false);
```

## 浏览器存储
:::tip 
浏览器存储有如下四种方法，每种方法都有不同支持，具体特性请参考表格
1. cookie
2. localStorage
3. sessionStorage
4. indexDB
:::
![img](../image/storage.png)

### 1. Cookie
#### 设置cookie
```js
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}
setCookie('name', 'why', 30);
```

#### 获取cookie
```js
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}
setCookie('name', 'why', 30);
console.log(getCookie('name')); // 打印why
```

### 2. localStorage 和 sessionStorage
#### 设置localStorage和sessionStorage
```js
localStorage.setItem('name','why');
sessionStorage.setItem('age',23);
```

#### 获取localStorage和sessionStorage
```js
localStorage.setItem('name','why');
console.log(localStorage.getItem('name')); // 打印why
sessionStorage.setItem('age',23);
console.log(sessionStorage.getItem('age'));// 打印23
```

### indexDB
`IndexedDB` 就是浏览器提供的本地数据库，它可以被网页脚本创建和操作。`IndexedDB` 允许储存大量数据，提供查找接口，还能建立索引
:::tip 对象接口
- 数据库：IDBDatabase 对象
- 对象仓库：IDBObjectStore 对象
- 索引： IDBIndex 对象
- 事务： IDBTransaction 对象
- 操作请求：IDBRequest 对象
- 指针： IDBCursor 对象
- 主键集合：IDBKeyRange 对象
:::
详细内容参考：[阮一峰--浏览器数据库 IndexedDB 入门教程](http://www.ruanyifeng.com/blog/2018/07/indexeddb.html)