# 性能优化
[[toc]]
## 问题分析
优化方向有两个：
- HTTP 请求
- JS 加载

一般会在浏览器的网络，看下从拉取模板开始到首次渲染中间到底在加载什么，如果中间某些资源加载速度过慢，则可以从这方面入手；否则的话有可能是解析 js 速度过慢导致的

## 请求优化

### 1. 合理使用缓存
后端返回资源问题：设置`Cache-Control`、`Last-Modified`、`Etag` 等响应头

前端合理利用 `localStorage`

### 2. CDN 内容分发
将非核心的资源通过 CDN 的方式进行分发，例如使用的第三方库，可以有效减小请求包的体积，同时稳定高速的 CDN 服务器也可以加快请求的速度，CDN 通常会配合异步加载一起使用

### 3. 图片优化
图片优化就是尽可能的去寻求一个图片质量与性能之间的平衡点，并在不同业务场景下，做好图片方案的选型工作

#### 3-1. 图片优化之请求优化

##### 3-1-1. 图片懒加载
先不设置图片的 src 属性，将图片的真实路径放在一个浏览器不认识的属性中(比如data-src)，然后去监听 scroll 事件，当页面的 scrollTop 与浏览器的高度之和大于图片距页面顶端的 Y 时，说明图片已经进入可视区域，这时把 data-src 放到 src 中即可

社区成熟的轮子比比皆是：
- Lozad.js
- vue-lazyload
- react-lazyload

##### 3-1-2. 雪碧图
雪碧图是一种 CSS 图像合成技术，主要用于小图片显示。

在网页中，为了更好的展示效果，通常会采用一些小图标来替代文字。通常的方式包括 IconFonts、SVG Icons、小图片。其中 Icon Font支持单色，SVG Icons 需 IE9+。

> 如不考虑兼容性问题，推荐使用 SVG Icons，体积更小，显示效果更好。

如果采用小图片，需要考虑一个问题：每张小图片独立请求，加载时都会产生一个 HTTP 请求，而小图片的体积甚至比 HTTP 请求头等结构的体积还要小，显得非常没有必要。

所以我们通常会将所有小图片合并成一张图片请求。

**实现原理**：将小图标合并成一张图片，利用 background-position 属性值来确定图片呈现的位置。

**自动生成**：每次修改或新增图片，都需要对雪碧图进行修改，如果依靠人工维护，成本太高，所以我们使用 `spritesmith`。它可以自动合并图片，并得到图片在合并后的相对位置：
```js
const fs = require('fs')
const path = require('path');
const Spritesmith = require('spritesmith');

const baseDir = './images';
const files = fs.readdirSync(baseDir)
const sprites = files.map(file => path.join(baseDir, file))

Spritesmith.run({src: sprites}, (err, result) => {
  if (err) {
    console.error(err)
  } else {
    console.info(result);
  }
})
```
运行的输出结果如下：
```js
{
  coordinates: {
    'images/alipay.png': { x: 0, y: 131, width: 81, height: 73 },
    'images/taobao.png': { x: 177, y: 0, width: 114, height: 114 },
    'images/wechat.png': { x: 0, y: 0, width: 177, height: 131 },
    'images/xinlang.png': { x: 81, y: 131, width: 72, height: 72 }
  },
  properties: { width: 291, height: 204 },
  image: <Buffer 89504e 470d 0a 1a 0a 0000000d 4948445200000123000000 cc 08060000003845 c5 ce 00004006494441547801 ec c1 0b 98 e6 0561 ... 22705 more bytes>
}
```
其中:
- coordinates：每张图片对应的尺寸和位置
- properties：生成的图片尺寸
- image：文件的 Buffer，可用于生成图片

对于现有的常用的构建工具，已有现成的插件可直接使用：
- webpack-spritesmith
- gulp.spritesmith
- grunt-spritesmith

**注意事项**

如果要适配高清屏，需要配置高清屏的图片，并且通过设置background-size属性来使得最终显示正常，可参考以上插件的retina相关配置参数；
由于 HTTP/2 的支持多路复用特性，使得单个图片的请求的开销很小，不推荐使用雪碧图了，但为了兼容 HTTP1.1，现阶段多版本 HTTP 协议并存期间还是建议保留；
雪碧图好用，可不要滥用。

#### 3-2. 图优化之体积优化
图片体积压缩就是在图片保持可接受的清晰度范围内同时减少文件大小，图片体积压缩可以借助工具实现。


#### 3-3. 图优化之格式、尺寸优化
Web 开发中常见的图片包括 JPG、PNG、GIF、WebP，选择合适的格式以及压缩质量可以在保证视觉效果的情况下，加速网站的呈现。下面针对不同图片格式的特性来做一下对比：

| 类型 | 动画 |	压缩类型 | 浏览器支持 | 透明度 |
| ------- | -------|-------|-------|:-----  |
| GIF |	支持 | 无损压缩	| 所有 | 支持 |
| PNG	| 不支持 | 无损压缩	| 所有	| 支持 |
| JPEG | 不支持 | 有损压缩 | 所有 | 不支持 |
| webP | 不支持 | 无损压缩或有损压缩 |	Chrome、Opera、Firefox、Edge、Android | 支持 | 

参考文章：[Web图片优化](https://github.com/i-want-offer/FE-Essay/blob/master/%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96/Web%E5%9B%BE%E7%89%87%E4%BC%98%E5%8C%96.md)


### 4. 资源压缩
开启压缩后，会让资源的体积减小，从而降低请求时间。
#### vue-cli 编译打包文件的压缩优化
包含了图片、js，css打包文件的压缩

首先，安装相关依赖包：
```js
npm install --save-dev image-webpack-loader

npm install --save-dev compression-webpack-plugin
```
然后，在vue.config.js里进行配置
```js
const CompressionPlugin = require("compression-webpack-plugin")
module.exports = {
  publicPath: './',
  chainWebpack: config => {
    // 解决ie11兼容ES6
    config.entry('main').add('babel-polyfill')
    // 开启图片压缩
    config.module.rule('images')
    .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    .use('image-webpack-loader')
    .loader('image-webpack-loader')
    .options({ bypassOnDebug: true })
    // 开启js、css压缩
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compressionPlugin')
      .use(new CompressionPlugin({
        test:/\.js$|\.html$|.\css/, // 匹配文件名
        threshold: 10240, // 对超过10k的数据压缩
        deleteOriginalAssets: false // 不删除源文件
      }))
    }
  },
  transpileDependencies: [
        'biyi-admin', // 指定对第三方依赖包进行babel-polyfill处理
    ]
}
```
### 5. 减少请求次数的优化

#### keep-alive 元素
在 vue 的项目中可以使用 `keep-alive` 元素来缓存组件的实例，从而达到减少向服务器请求的次数

#### 合理利用缓存

#### 使用防抖和节流函数

### 6. UI 框架按需加载
在日常使用 UI 框架，例如 element-UI、或者antd，我们经常性直接引用整个 UI 库
```js
import ElementUI from 'element-ui'
Vue.use(ElementUI)
```
但实际上我用到的组件只有按钮，分页，表格，输入与警告 所以我们要按需引用
```js
import { Button, Input, Pagination, Table, TableColumn, MessageBox } from 'element-ui';
Vue.use(Button)
Vue.use(Input)
Vue.use(Pagination)
```

## 加载优化
### 1. 拆包
在不配置拆包的情况下，`Webpack` 会将所有的资源都打包在一个 js 文件中，这无疑会让请求时候的响应体积变得非常大，从而降低加载速度

同时，不配置拆包，会在首次加载的时候加载一些无关的资源，降低了页面首次加载的速度

合理配置拆包，让每次请求都只请求对应的核心资源，从而达到按需加载的程度

**拆包通常的逻辑：** 
- 业务代码和第三方依赖进行拆分
- 对于第三方依赖：
    - 将版本经常变动的与版本不怎么变动的进行拆分
    - 版本不怎么变动的依赖可以合理配置 CDN
- 对于业务代码：
    - 将业务模块和公共模块进行拆分
    - 业务模块也根据调用的次数进行拆分
    - 将首屏模块单独进行拆分

### 2. 异步加载
非核心的资源不需要在拉取模版之后立马就加载，可以使用异步加载，让这些非核心资源在视图构建完毕以后再进行加载。

### 3. 预加载
与首屏优化一样，路由跳转优化也是非常关键。我们可以通过判断是否需要进行路由跳转，在跳转之前做一些提前加载，从而达到跳转完成之后，资源立马加载完毕的效果从而提升加载速度。

### 4. 重复组件的打包
假设 `A.js` 文件是一个常用的库，现在有多个路由使用了 `A.js` 文件，这就造成了重复下载

解决方案：在 `webpack` 的 `config` 文件中，修改 `CommonsChunkPlugin` 的配置
```js
minChunks: 3
```
`minChunks` 为 `3` 表示会把使用 `3` 次及以上的包抽离出来，放进公共依赖文件，避免了重复加载组件


## 体验优化

### 骨架屏
使用 loading 图或者是骨架屏，可以一定程度上减少用户等待加载的焦虑感，让用户感觉没有等太久，这就是用户体验级的优化。

### 动画
直接操作 DOM，有可能会引起大面积的重排和重绘，从而引起掉帧的情况，导致用户体验下降。

合理使用 CSS3 GPU 加速，可以避免使用动画之后的重排和重绘，达到更流畅的动画效果。

有一说一，开启 CSS3 GPU 加速是非常消耗功耗的，所以在移动端上面谨慎使用。

### 虚拟滚动

我们知道，页面进行滚动的时候，也会触发浏览器的重排，如果此时前端需要渲染大量数据，而且还不允许分页，这种情况下会导致浏览器的掉帧、卡顿甚至假死的情况。

这种情况下，如果不能使用分页进行优化，通常我们会使用虚拟滚动的方式来解决问题。

因为 DOM 元素的创建和渲染需要的时间成本很高，在大数据的情况下，完成渲染列表所需要的时间不可接受，所以我们可以只渲染可视区域，从而达到极高的初次渲染性能。


















