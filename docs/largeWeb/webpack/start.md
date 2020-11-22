---
sidebarDepth: 1
---

# 起步

## 基本安装
```sh
mkdir webpack-demo && cd webpack-demo
npm init -y
npm install webpack webpack-cli --save-dev
```
创建以下目录结构、文件和内容
```sh {3,4,5}
  webpack-demo
  |- package.json
+ |- index.html
+ |- /src
+   |- index.js
```

## 添加基础代码
在创建了基本的项目结构以后，我们需要为我们创建的文件添加一些代码

其中 `package.json` 是利用下面的命令自动生成的配置文件
```sh
$ npm init -y
```

### index.html
```html
<!doctype html>
<html>
  <head>
    <title>起步</title>
  </head>
  <body>
    <script src="main.js"></script>
  </body>
</html>
```

### src/index.js
```js
function component() {
  var element = document.createElement('div');

  // Lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());
```

## 添加配置文件
使用如下命令添加 Webpack 配置文件：
```sh
$ touch webpack.config.js
```
至此我们的基础目录已创建完毕，接下来需要改写 `webpack.config.js` 文件，它的代码如下：
:::tip 说明
1. `entry` 配置项说明了 `webpack` 打包的入口文件。
2. `output` 配置项说明了 `webpack` 输出配置：`filename` 配置了打包后的文件叫 `main.js`
3. `path` 配置了打包后的输出目录为 `dist` 文件夹下
:::
```js
// path为Node的核心模块
const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

同时修改一下目录的结构，此时项目的结构如下：
```sh {8}
  webpack-demo
  |- package.json
+ |- /dist
+   |- index.html
- |- index.html
  |- /src
    |- index.js
+ |- webpack.config.js
```

## 改写package.json文件
:::tip 改写说明
1. 添加 `private` 属性并设置为 `true`：此属性能让我们的项目为私有的，防止意外发布代码
2. 移除 `main` 属性：我们的项目并不需要对外暴露一个入口文件
3. 添加 `scripts` 命令：即我们的打包命令
:::

```json {5,7}
{
  "name": "webpack-vuepress",
  "version": "1.0.0",
  "description": "",
  "private": true,
  "scripts": {
    "bundle": "webpack"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^4.31.0",
    "webpack-cli": "^3.3.2"
  }
}
```

## 第一次打包
:::tip 命令说明
`npm run` 代表运行一个脚本命令，而 `bundle` 就是我们配置的打包命令，即 `npm run bundle` 就是我们配置的 `webpack` 打包命令。
:::
打包后 `dist` 文件夹多了一个 `main.js` 文件
```sh {5}
  webpack-demo
  |- package.json
  |- /dist
    |- index.html 
+   |- main.js
  |- /src
    |- index.js
  |- webpack.config.js
```


















