# 打包静态资源
[[toc]]
## loader
`loader` 是一种打包规则，它告诉了 `Webpack` 在遇到非 `.js` 文件时，应该如何处理这些文件，它有如下几种固定的运用规则：
- 使用 `test` 正则来匹配相应的文件
- 使用 `use` 来添加文件对应的 `loader`
- 对于多个 `loader` 而言，从  **右到左** 依次调用

## 打包图片
:::tip 依赖安装
打包图片需要用到 `file-loader` 或者 `url-loader`，需使用 `npm install` 进行安装
:::
```sh
npm install --save-dev file-loader url-loader
```
需要在 `webpack.config.js` 中的 `module` 进行相应的配置：
```js {9-19}
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          loader: 'file-loader'          
        ]
      }
    ]
  }
}
```
### 改写 index.js
```js
import _ from 'lodash';
import testImg from './testImg.png';

function component() {
  var element = document.createElement('div');

  // Lodash，现在由此脚本导入
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  // 将图像添加到我们现有的 div。
  var myImg = new Image();
  myImg.src = testImg;

  element.appendChild(myImg);

  return element;
}

document.body.appendChild(component());
```

### 打包后的项目目录
```sh {4,9}
  webpack-demo
  |- package.json
  |- /dist
+   |- 0ca9ed24608815bfdefff71d93b83f58.jpg
    |- index.html 
    |- main.js
  |- /src
    |- index.js
+   |- testImg.jpg
  |- webpack.config.js
```

### 运用占位符
在以上打包图片的过程中，我们发现打包生成的图片好像名字是一串乱码，如果我们要原样输出原图片的名字的话，又该如何进行配置呢？这个问题，可以使用 **占位符** 进行解决。
:::tip 占位符说明
文件占位符它有一些固定的规则，像下面这样：
- `[name]` 代表原本文件的名字
- `[ext]` 代表原本文件的后缀
- `[hash]` 代表一个md5的唯一编码
:::
根据占位符的规则再次改写 `webpack.config.js` 文件
```js {15-17}
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          loader: 'file-loader',
          options: {
            name: '[name]_[hash].[ext]'
          }          
        ]
      }
    ]
  }
}
```
打包生成的图片，它的名字如下：
```sh
  |- /dist
    |- testImg_0ca9ed24608815bfdefff71d93b83f58.jpg
```

## 打包样式
:::tip 样式文件分为几种情况，每一种都需要不同的loader来处理
1. 普通 `.css` 文件，使用 `style-loader` 和 `css-loader` 来处理
2. `.less` 文件，使用 `less-loader` 来处理
3. `.sass` 或者 `.scss` 文件，需要使用 `sass-loader` 来处理
4. `.styl` 文件，需要使用 `stylus-loader` 来处理
:::

### 打包CSS
:::tip 安装依赖
首先安装 `style-loader` 和 `css-loader`
:::

改写webpack配置文件：
```js {17-20}
// path为Node的核心模块
const path = require('path');

module.exports = {
  // 其它配置
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash].[ext]'
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
```
在 `src` 目录下创建 `index.css`
```css
.test-img{
  width: 150px;
  height: 150px;
}
```
改写index.js文件
```js {3,15}
import _ from 'lodash';
import testImg from './testImg.png';
import './index.css';

function component() {
  var element = document.createElement('div');

  // Lodash，现在由此脚本导入
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  // 将图像添加到我们现有的 div。
  var myImg = new Image();
  myImg.src = testImg;
  myImg.classList.add('test-img');
  element.appendChild(myImg);

  return element;
}

document.body.appendChild(component());
```

此时的项目目录：
```sh {8}
  webpack-demo
  |- package.json
  |- /dist
    |- 0ca9ed24608815bfdefff71d93b83f58.jpg
    |- index.html 
    |- main.js
  |- /src
+   |- index.css
    |- index.js
    |- testImg.jpg
  |- webpack.config.js
```

## 全局资源
上述的加载资源方式，可以以更直观的方式将模块和资源组合在一起，无需依赖于含有全部资源的 `/assets` 目录，而是将代码和资源组织在一起，例如，类似这样的结构会非常有用：
```sh {2-7}
- |- /assets
+ |– /components
+ |  |– /my-component
+ |  |  |– index.jsx
+ |  |  |– index.css
+ |  |  |– icon.svg
+ |  |  |– img.png
```
这种配置方式会使你的代码更具备可移植性












