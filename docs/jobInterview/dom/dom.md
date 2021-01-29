---
sidebarDepth: 1
---

# DOM 相关面试题

## 事件冒泡、捕获等理解
`事件冒泡` 和 `事件捕获` 分别由微软和网景公司提出，这两个概念都是为了解决页面中`事件流`（事件发生顺序）的问题。
### 事件冒泡
事件会从最内层的元素开始发生，一直向上传播，直到 `document` 对象。

### 事件捕获
与事件冒泡相反，事件会从最外层开始发生，直到最具体的元素。

### addEventListener 的第三个参数
DOM2级事件”中规定的事件流同时支持了事件捕获阶段和事件冒泡阶段

`addEventListener` 方法用来为一个特定的元素绑定一个事件处理函数，是 `JavaScript` 中的常用方法。`addEventListener`有三个参数：
```js
element.addEventListener(event, function, useCapture)
```

| 参数        | 描述           |
| ------------- |:------------- |
| event      | 必须。字符串，指定事件名 |
| function      | 必须。指定要事件触发时执行的函数 |
| useCapture | 可选值:true - 事件句柄在捕获阶段执行（即在事件捕获阶段调用处理函数）；false- 默认。事件句柄在冒泡阶段执行（即表示在事件冒泡的阶段调用事件处理函数） |

### 事件代理
在实际的开发当中，利用事件流的特性，我们可以使用一种叫做事件代理的方法。
```html
<ul class="color_list">        
    <li>red</li>        
    <li>orange</li>        
    <li>yellow</li>        
    <li>green</li>        
    <li>blue</li>        
    <li>purple</li>    
</ul>
<div class="box"></div>
```
```js
function colorChange(e){                
    var e=e||window.event;//兼容性的处理         
    if(e.target.nodeName.toLowerCase()==="li"){                    
        box.innerHTML="该颜色为 "+e.target.innerHTML;                
    }                            
}            
color_list.addEventListener("click",colorChange,false)
```
由于事件冒泡机制，点击了 `li` 后会冒泡到 `ul`，此时就会触发绑定在 ul 上的点击事件，再利用 target 找到事件实际发生的元素，就可以达到预期的效果。

### 阻止事件冒泡
1. 给子级加 event.stopPropagation()
```js
$("#div1").mousedown(function(e){
    var e=event||window.event;
    event.stopPropagation();
});
```
2. 在事件处理函数中返回 false
```js
$("#div1").mousedown(function(event){
    var e=e||window.event;
    return false;
});
```
但是这两种方式是有区别的。`return false` 不仅阻止了事件往上冒泡，而且阻止了事件本身(默认事件)。`event.stopPropagation()` 则只阻止事件往上冒泡，不阻止事件本身。












