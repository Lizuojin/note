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
































