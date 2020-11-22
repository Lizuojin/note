# 管理输出

## 输出多个 bundle
### 创建和修改文件
```sh {7}
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- index.html
  |- /src
    |- index.js
+   |- print.js
  |- /node_modules
```
在 `src/print.js` 文件中添加一些逻辑
```js
export default function printMe() {
  console.log('I get called from print.js!');
}
```
并且在 `src/index.js` 文件中使用这个函数：
```js
import _ from 'lodash';
import printMe from './print.js';

function component() {
  var element = document.createElement('div');
  var btn = document.createElement('button');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = printMe;

  element.appendChild(btn);

  return element;
}

document.body.appendChild(component());
```

更新 `dist/index.html` 文件，来为 `webpack` 分离入口做好准备
```html
<!doctype html>
<html>
  <head>
    <title>起步</title>
    <script src="./print.bundle.js"></script>
  </head>
  <body>
    <script src="./app.bundle.js"></script>
  </body>
</html>
```
在 `webpack.config.js` 调整配置：
- 在 `entry` 添加 `src/print.js` 作为新的入口起点 `print`
- 修改 `output` ，根据入口起点名称动态生成 `bundle` 名称
```js {4-7,9}
const path = require('path');

module.exports = {
  entry: {
    app: './src/index.js',
    print: './src/print.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```
`webpack` 生成 `print.bundle.js` 和 `app.bundle.js` 文件
```sh {6-7}
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- index.html
+   |- print.bundle.js
+   |- app.bundle.js
  |- /src
    |- index.js
    |- print.js
  |- /node_modules
```
有个问题就是：我们更改了一个入口起点的名称，甚至添加了一个新的名称，生成的包将被重命名在一个构建中，但是我们的 `index.html` 文件仍然会引用旧的名字，这个问题用下面即将讲到的 `html-webpack-plugin` 来解决

## webpackPlugin

### html-webpack-plugin
`html-webpack-plugin` 可以让我们使用固定的模板，在每次打包的时候 自动生成 一个 `index.html` 文件，并且它会 自动 帮我们引入我们打包后的`.js`文件

首先安装插件，并且调整 `webpack.config.js` 文件：
```sh
npm install --save-dev html-webpack-plugin
```
```js {2,9-13}
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'src/index.html'
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```


### clean-webpack-plugin
`clean-webpack-plugin` 的理解是：它能帮我们在打包之前 **自动删除** `dist` 打包目录及其目录下所有文件，不用我们手动进行删除。

我们使用如下命令来安装 `clean-webpack-plugin`，安装完毕以后，我们同样需要在 `webpack.config.js` 中进行配置(改动部分参考高亮代码块)
```sh
$ npm install clean-webpack-plugin -D
```
```js {3,14}
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new CleanWebpackPlugin()
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname,'dist')
  }
}
```
我们只介绍了两种常用的 `plugin`，更多 `plugin` 的用法我们将在后续进行讲解，你也可以点击 [Webpack Plugins](https://www.webpackjs.com/plugins/) 来学习更多官网推荐的 `plugin` 用法。

## 配置 SourceMap
`source-map` 的理解：它是一种映射关系，它映射了打包后的代码和源代码之间的对应关系，一般通过 `devtool` 来配置。

以下是官方提供的devtool各个属性的解释以及打包速度对比图：

![img](../image/devtool.png)
  