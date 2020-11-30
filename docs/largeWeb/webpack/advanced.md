# 进阶

## Tree Shaking
`Tree Shaking` 是一种术语，通常用来描述 `js` 中未使用的代码。
:::tip 注意
`Tree Shaking` 只适用于 `ES Module` 语法(既通过 `export` 导出，`import` 引入)，因为它依赖于 `ES Module` 的静态结构特性。
:::
在 `src` 目录下新建一个 `math.js` 文件，他的代码如下

```js
// math.js
export function add(a, b) {
  console.log(a + b);
}
export function minus(a, b) {
  console.log(a - b);
}
```
修改 `index.js` 文件
```js
import { add } from './math'
add(1, 4);
```
最后需要对 `webpack.config.js` 做一下配置，让它支持 `Tree Shaking`
```js {8-10}
const path = require('path');
module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    main: './src/index.js'
  },
  optimization: {
    usedExports: true
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname,'dist')
  }
}
```
在以上 `webpack.config.js` 配置完毕后，我们需要使用 `npx webpack` 进行打包，它的打包结果如下：
```js
// dist/main.js
"use strict";
/* harmony export (binding) */ 
__webpack_require__.d(__webpack_exports__, "a", function() { return add; });
/* unused harmony export minus */
function add(a, b) {
  console.log(a + b);
}
function minus(a, b) {
  console.log(a - b);
}
```
**打包结果分析：** 虽然我们配置了 `Tree Shaking`，但在开发环境下，我们依然能够看到未使用过的 `minus` 方法，以上注释也清晰了说明了这一点，这个时候你可能会问：为什么我们配置了`Tree Shaking`，`minus` 方法也没有被使用，但依然还是被打包进了 `main.js` 中？

其实这个原因很简单，这是因为我们处于开发环境下打包，当我们处于开发环境下时，由于 `source-map` 等相关因素的影响，如果我们不把没有使用的代码一起打包进来的话，`source-map` 就不是很准确，这会影响我们本地开发的效率。

在生产环境下打包，需要我们对 `webpack.config.js` 中的 `mode` 属性，需要由 `development`改为 `production`，它的改动如下：
```js {3}
const path = require('path');
module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    main: './src/index.js'
  },
  optimization: {
    usedExports: true
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname,'dist')
  }
}
```
配置完毕后，我们依然使用 `npx webpack` 进行打包，可以看到，它的打包结果如下所示：
```js
(()=>{"use strict";console.log(5)})();
```

:::tip SideEffects
由于 `Tree Shaking` 作用于所有通过 `import` 引入的文件，如果我们引入第三方库，例如：`import _ from 'lodash'` 或者 `.css` 文件，例如`import './style.css'` 时，如果我们不 做限制的话，`Tree Shaking` 将起副作用，`SideEffects` 属性能帮我们解决这个问题：它告诉 `webpack`，我们可以对哪些文件不做 `Tree Shaking`
:::
```json
// 修改package.json
// 如果不希望对任何文件进行此配置，可以设置sideEffects属性值为false
// *.css 表示 对所有css文件不做 Tree Shaking
// @babael/polyfill 表示 对@babel/polyfill不做 Tree Shaking
"sideEffects": [
  "*.css",
  "@babel/polyfill"
],
```

## 区分开发模式和生产模式
区分开发环境和生产环境，最好的办法是把公用配置提取到一个配置文件，生产环境和开发环境只写自己需要的配置，在打包的时候再进行合并即可，`webpack-merge` 可以帮我们做到这个事情

我们先对目录结构进行修改
```sh
webpack-demo
|- package.json
|- webpack.config.js
|- webpack.common.js
|- webpack.dev.js
|- webpack.prod.js
|- /dist
|- /src
  |- index.js
  |- math.js
|- /node_modules
```

新建完webpack.common.js文件后，我们需要把公用配置提取出来，它的代码看起来应该是下面这样子的：
```js
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Production'
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist')
  }
};
```
提取完 `Webpack` 公用配置文件后，我们开发环境下的配置，也就是 `webpack.dev.js` 中的代码，将剩下下面这些：
```js
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  }
});
```
而生产环境下的配置，也就是 `webpack.prod.js` 中的代码，可能是下面这样子的：
```js
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  plugins: [
    new UglifyJSPlugin()
  ]
});
```
在处理完以上三个 `.js` 文件后，我们需要做一件事情：
- 当处于开发环境下时，把 `webpack.common.js` 中的配置和 `webpack.dev.js` 中的配置合并在一起
- 当处于生产环境下时，把 `webpack.common.js` 中的配置和 `webpack.prod.js` 中的配置合并在一起

针对以上问题，我们可以使用 `webpack-merge` 进行合并，在使用之前，我们需要使用如下命令进行安装：
```sh
$ npm install webpack-merge -D
```

重新在 `package.json` 中配置一下我们的打包命令:
```json
// ...
"scripts": {
  "start": "webpack-dev-server --open --config webpack.dev.js",
  "build": "webpack --config webpack.prod.js"
}
// ...
```

## 代码分离
此特性能够把代码分离成更小的块，按需加载或并行加载这些文件，控制资源加载优先级，如果使用合理，会极大影响加载时间。

有三种常用的代码分离方法：
- 入口起点：使用 `entry` 配置手动地分离代码。
- 防止重复：使用 `CommonsChunkPlugin` 去重和分离 `chunk`
- 动态导入：通过模块的内联函数调用来分离代码。

### 入口起点
项目的目录结构:
```sh
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
  |- another-module.js
|- /node_modules
```
/src/index.js
```js
import _ from 'lodash';

function component() {
  var element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  return element;
}

document.body.appendChild(component());
```

/src/another-module.js
```js
import _ from 'lodash';

console.log(
  _.join(['Another', 'module', 'loaded!'], ' ')
);
```
webpack.config.js
```js {6-7}
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    another: './src/another-module.js'
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: 'Code Splitting'
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

### 防止重复
`CommonsChunkPlugin` 插件可以将公共的依赖模块提取到已有的入口 `chunk` 中，或者提取到一个新生成的 `chunk`。让我们使用这个插件，将之前的示例中重复的 `lodash` 模块去除：
```js {14-16}
  const path = require('path');
  const webpack = require('webpack');
  const HTMLWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: {
      index: './src/index.js',
      another: './src/another-module.js'
    },
    plugins: [
      new HTMLWebpackPlugin({
        title: 'Code Splitting'
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common' // 指定公共 bundle 的名称。
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

### 动态导入

#### import() 语法
- `chunkFilename `: 决定非入口 `chunk` 的名称，更多信息请查看 [output 相关文档](https://www.webpackjs.com/configuration/output/#output-chunkfilename)
- `webpackChunkName`: 会将我们的 `bundle` 被命名为 `[webpackChunkName].bundle.js`，更多信息请查看 [import() 相关文档](https://www.webpackjs.com/api/module-methods/#import-)

webpack.config.js
```js
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: './src/index.js',
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: 'Code Splitting'
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```
project
```js
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
|- /node_modules
```
/src/index.js
```js

function getComponent() {

  return import(/* webpackChunkName: "lodash" */ 'lodash').then(_ => {
    var element = document.createElement('div');
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    return element;
  }).catch(error => 'An error occurred while loading the component');
  }

getComponent().then(component => {
  document.body.appendChild(component);
})
```

打包结果：
```js
           Asset       Size  Chunks                    Chunk Names
lodash.bundle.js     544 kB       0  [emitted]  [big]  lodash
 index.bundle.js    6.22 kB       1  [emitted]         index
      index.html  191 bytes          [emitted]
   [0] ./src/index.js 391 bytes {1} [built]
   [2] (webpack)/buildin/global.js 509 bytes {0} [built]
   [3] (webpack)/buildin/module.js 517 bytes {0} [built]
```