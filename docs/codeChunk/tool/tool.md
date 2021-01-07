---
sidebarDepth: 1
---

# 代码片段

## ● 判断变量是否未定义
```js
function isUndef (v: any):boolean{
  return v === undefined || v === null
}
```

## ● 判断变量是否是原始类型值
```js
 function isPrimitive (value: any): boolean{
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}
```

## ● 数据类型判断
`Object.prototype.toString.call()` 返回的数据格式为 `[object Object]` 类型，然后用 `slice` 截取`第 8 位到倒 1 位`，得到结果为 `Object`
```js
var _toString = Object.prototype.toString;
function toRawType (value) {
    return _toString.call(value).slice(8, -1)
}

// 运行结果
toRawType({})           //  Object 
toRawType([])           // Array    
toRawType(true)         // Boolean
toRawType(undefined)    // Undefined
toRawType(null)         // Null
toRawType(function(){}) // Function
```

## ● 利用闭包构造 map 缓存数据
vue 中判断我们写的组件名是不是 `html` 内置标签的时候，如果用数组类遍历那么将要循环很多次获取结果，如果把数组转为对象，把标签名设置为对象的 `key`，那么不用依次遍历查找，只需要查找一次就能获取结果，提高了查找效率
```js
// expectsLowerCase参数: 是否用toLowerCase()方法，默认不用
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

## 二维数组扁平化
```js
// 先看lodash中的flatten
_.flatten([1, [2, [3, [4]], 5]])
// 得到结果为  [1, 2, [3, [4]], 5]

// vue中
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// es6中 等价于
function simpleNormalizeChildren (children) {
   return [].concat(...children)
}
```
