# html 相关面试题
[[toc]]

## ● 说说你对语义化的理解？
1. 去掉或者丢失样式的时候能够让页面呈现出清晰的结构
2. 有利于SEO：和搜索引擎建立良好沟通，有助于爬虫抓取更多的有效信息：爬虫依赖于标签来确定上下文和各个关键字的权重；
3. 方便其他设备解析（如屏幕阅读器、盲人阅读器、移动设备）以意义的方式来渲染网页；
4. 便于团队开发和维护，语义化更具可读性，是下一步吧网页的重要动向，遵循W3C标准的团队都遵循这个标准，可以减少差异化。


## ● XML和JSON的区别？
- 数据体积方面
    - `JSON` 相对于 `XML` 来讲，数据的体积小

- 数据交互方面
    - `JSON` 与 `JavaScript` 的交互更加方便，更容易解析处理，更好的数据交互

- 数据描述方面
    - `JSON` 对数据的描述性比 `XML` 较差

- 传输速度方面
    - `JSON` 的速度要远远快于 `XML`


## ● Doctype 作用? 严格模式与混杂模式如何区分？它们有何意义?
1. `<!DOCTYPE>` 声明位于文档中的最前面，处于 `<html>` 标签之前。告知浏览器以何种模式来渲染文档
2. 严格模式的排版和 JS 运作模式是  以该浏览器支持的最高标准运行
3. 在混杂模式中，页面以宽松的向后兼容的方式显示。模拟老式浏览器的行为以防止站点无法工作
4. `DOCTYPE` 不存在或格式不正确会导致文档以混杂模式呈现。


## ● 浮动元素引起的问题和解决办法
浮动元素引起的问题：
1. 父元素的高度无法被撑开，影响与父元素同级的元素
2. 与浮动元素同级的非浮动元素（内联元素）会跟随其后
3. 若非第一个元素浮动，则该元素之前的元素也需要浮动，否则会影响页面显示的结构

## ● <meta> 标签的理解 
`meta` 标签共有两个属性，分别是 `http-equiv` 属性和 `name` 属性
 
`content` 中的内容是对 `name` 填入类型的具体描述

### name 属性的值
#### keywords 关键字
用于告诉搜索引擎，你网页的关键字
```html
<meta name="keywords" content="Lxxyx,博客，文科生，前端">
```

#### description 网站内容的描述
用于告诉搜索引擎，你网站的主要内容
```html
<meta name="description" content="文科生，热爱前端与编程。目前大二，这是我的前端博客">
```

#### viewport 移动端的窗口
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

#### robots
`robots` 用来告诉爬虫哪些页面需要索引，哪些页面不需要索引。`content` 的参数有all,none,index,noindex,follow,nofollow。默认是all。

### http-equiv 属性的值

#### content-Type
用于设定网页字符集，便于浏览器解析与渲染页面举例：
```html
<meta http-equiv="content-Type" content="text/html;charset=utf-8">  //旧的HTML，不推荐

<meta charset="utf-8"> //HTML5设定网页字符集的方式，推荐使用UTF-8
```

#### X-UA-Compatible
用于告知浏览器以何种版本来渲染页面

详细内容请看下面的参考文章

参考文献：[HTML中的meta标签及其使用方法](https://www.cnblogs.com/chenqiBlog/p/9517619.html)






















