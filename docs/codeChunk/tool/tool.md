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



