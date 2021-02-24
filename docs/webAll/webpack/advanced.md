# 进阶
[[toc]]
## Tree Shaking
:::tip 知识点
- `Tree Shaking` 是一种术语，用于描述移除 `JavaScript` 上下文中的未引用代码
- 依赖于 `ES2015` 模块系统中的静态结构特性，例如 `import` 和 `export`
- `sideEffects` 属性作为标记可以安全地删除文件中未使用的部分
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
:::tip 知识点
- 公用配置(webpack.common.js)提取到一个配置文件，生产环境(webpack.dev.js)和开发环境(webpack.prod.js)只写自己需要的配置，使用`webpack-merge` 打包的时候再进行合并
- 在 `scprit` 定义开发环境脚本(npm run start)，定义生产环境脚本(npm run build)
:::

我们先对目录结构进行修改
```sh
webpack-demo
|- package.json
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

:::tip 知识点
有三种常用的代码分离方法：
- 入口起点：使用 `entry` 配置手动地分离代码。
- 防止重复：使用 `CommonsChunkPlugin` 去重和分离 `chunk`
- 动态导入：通过模块的内联函数调用来分离代码。
:::

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
:::tip 知识点
- `CommonsChunkPlugin` 插件可以将公共的依赖模块提取到：
    - **已有的入口 `chunk` 中**
    - **提取到一个新生成的 `chunk`**
:::

让我们使用这个插件，将之前的示例中重复的 `lodash` 模块去除：
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

## 懒加载
有些代码不需要每次加载页面的时候都要请求它，会对性能产生负面的影响；结合上面说到代码分离，将一些可以在第一次交互的时候加载的代码分离出来，有需要再加载这部分的代码

project
```sh
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
  |- print.js
|- /node_modules
```

src/print.js
```js
console.log('The print.js module has loaded! See the network tab in dev tools...');

export default () => {
  console.log('Button Clicked: Here\'s "some text"!');
}
```

src/index.js
```js
import _ from 'lodash';

function component() {
  var element = document.createElement('div');
  var button = document.createElement('button');
  var br = document.createElement('br');

  button.innerHTML = 'Click me and look at the console!';
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.appendChild(br);
  element.appendChild(button);


  button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
    var print = module.default;

    print();
  });

  return element;
}

document.body.appendChild(component());
```














