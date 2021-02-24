

# Vue 源码的一些函数
### 1. 数据类型的判断
`Object.prototype.toString.call()`返回的数据格式为 `[object Object]` 类型，然后用 `slice` 截取第8位到倒一位，得到结果为 `Object`
```js
var _toString = Object.prototype.toString;
function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}
```
运行结果：
```js
toRawType({}) //  Object 
toRawType([])  // Array    
toRawType(true) // Boolean
toRawType(undefined) // Undefined
toRawType(null) // Null
toRawType(function(){}) // Function
```

### 2. 二维数组扁平化
关键点在于 `apply` 方法，将参数的数组平铺，从而把二维数组扁平化
```js
// vue中
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 使用 ES6 简写
function simpleNormalizeChildren (children) {
   return [].concat(...children)
}
```

### 3. 利用闭包构造map缓存数据
vue中判断我们写的组件名是不是html内置标签的时候，如果用数组类遍历那么将要循环很多次获取结果，如果把数组转为对象，把标签名设置为对象的key，那么不用依次遍历查找，只需要查找一次就能获取结果，提高了查找效率。
```js
function makeMap (str, expectsLowerCase) {
    // 构建闭包集合map
    var map = Object.create(null);
    var list = str.split(',');
    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }
    return expectsLowerCase
      ? function (val) { return map[val.toLowerCase()]; }
      : function (val) { return map[val]; }
}
// 利用闭包，每次判断是否是内置标签只需调用isHTMLTag
var isHTMLTag = makeMap('html,body,base,head,link,meta,style,title')
console.log('res', isHTMLTag('body')) // true
```

### 4. 方法拦截
vue中利用 `Object.defineProperty` 收集依赖，从而触发更新视图，但是数组却无法监测到数据的变化，但是为什么数组在使用push pop等方法的时候可以触发页面更新呢，那是因为vue内部拦截了这些方法。
```js
 // 重写push等方法，然后再把原型指回原方法
  var ARRAY_METHOD = [ 'push', 'pop', 'shift', 'unshift', 'reverse',  'sort', 'splice' ];
  var array_methods = Object.create(Array.prototype);
  ARRAY_METHOD.forEach(method => {
    array_methods[method] = function () {
      // 拦截方法
      console.log('调用的是拦截的 ' + method + ' 方法，进行依赖收集');
      return Array.prototype[method].apply(this, arguments);
    }
  });
```
运行结果测试：
```js
var arr = [1,2,3]
arr.__proto__ = array_methods // 改变arr的原型
arr.unshift(6) // 打印结果: 调用的是拦截的 unshift 方法，进行依赖收集
```






