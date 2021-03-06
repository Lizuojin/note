# VueRouter 面试题
[[toc]]
## ● vue-router 路由模式有几种？
vue-router 有 3 种路由模式：hash、history、abstract
- **hash**：使用 URL hash值作为路由
- **history**：使用 HTML5 History API 和服务器配置
- **abstract**：支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式

## ● 能说下 vue-router 中常用的 hash 和 history 路由模式实现原理吗？
### hash 模式的实现原理
早期的前端路由的实现就是基于 `location.hash` 来实现的。其实现原理很简单，`location.hash` 的值就是 URL 中 # 后面的内容。比如下面这个网站，它的 location.hash 的值为 '#search'：
```js
https://www.word.com#search
```

`hash` 路由模式的实现主要是基于下面几个特性：
- `URL` 中 `hash` 值只是客户端的一种状态，也就是说当向服务器端发出请求时，`hash` 部分不会被发送
- `hash` 值的改变，都会在浏览器的访问历史中增加一个记录。因此我们能通过浏览器的回退、前进按钮控制 `hash` 的切换
- 可以通过 `a` 标签，并设置 `href` 属性，当用户点击这个标签后，`URL` 的 `hash` 值会发生改变；或者使用 `JavaScript` 来对 `loaction.hash` 进行赋值，改变 `URL` 的 `hash` 值；
- 我们可以使用 `hashchange` 事件来监听 `hash` 值的变化，从而对页面进行跳转（渲染）。

### history 模式的实现原理
`history` 模式是基于 `HTML5` 的 `History API` 来实现的。其中做最主要的 `API` 有以下两个：`history.pushState()` 和 `history.replaceState()`。这两个 `API` 可以在不进行刷新的情况下，操作浏览器的历史纪录。唯一不同的是，前者是新增一个历史记录，后者是直接替换当前的历史记录，如下所示：

`history` 路由模式的实现主要基于存在下面几个特性：

- `pushState` 和 `repalceState` 两个 `API` 来操作实现 `URL` 的变化 
- 我们可以使用 `popstate` 事件来监听 `url` 的变化，从而对页面进行跳转（渲染）
- `history.pushState()` 或 `history.replaceState()` 不会触发 `popstate` 事件，这时我们需要手动触发页面跳转（渲染）

## ● vue-router 中的导航钩子函数

### 全局导航守卫
- `beforeEach` 全局前置守卫
- `beforeResolve` 全局解析守卫
- `afterEach` 全局后置钩子

### 路由独享守卫
- `beforeEnter` 路由独享守卫

### 组件内守卫
- `beforeRouterEnter` 
- `beforeRouterUpdate`
- `beforeRouterLeave`

## 完整的导航解析流程
1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 `DOM` 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

## ● $route 和 $router 的区别？
### $route
**路由信息对象**，表示当前激活的路由的状态信息，包括 path，params，hash，query，fullPath，matched，name等路由信息参数。

### $router
**路由实例对象**，包括了路由的跳转方法，钩子函数等。

## ● vue-router 是什么，它有哪些组件
是 Vue 官方的路由管理器，和 `Vue` 的核心深度集成，用于构建单页面应用
 
组件有：
- `<router-link>`: 路由声明式跳转
- `<router-view>`: 渲染路由的容器

## ● active-class 是哪个组件的属性
是属于 `vue-router` 的样式方法，当 `<router-link>` 标签被点击是将会应用这个样式
- 在 router-link 中使用
```js
<router-link to='/' active-class="active" >首页</router-link>
```
- 进行全局配置
```js
const router = new VueRouter({
    routes,
    linkActiveClass: 'active'
});
```

想要链接使用“精确匹配模式”，则使用 `exact` 属性：
```js
// 在 router-link 中使用
<router-link to='/' active-class="active" exact>首页</router-link>

// 进行全局配置
const router = new VueRouter({
    routes,
    linkExactActiveClass: 'active'
});
```
## ● 怎么定义动态路由? 怎么获取传过来的值
- **定义**: 在路由路径中使用动态路径参数，以冒号开头
- **获取值**: 通过 `this.$router.params` 获取

## ● vue-router 响应路由参数的变化
当使用路由参数时，例如从 `/content?id=1` 到 `/content?id=2`，此时原来的组件实例会被复用。这也意味着组件的生命周期钩子不会再被调用，此时 `vue` 应该如何响应路由参数的变化？
- 使用 `watch` 监听 `$route` 对象
```js
watch: {
    '$route' (to, from) {
        // 对路由变化作出响应...
    }
}
```
- `beforeRouteUpdate` 守卫，该守卫在重用的组件里调用
```js
beforeRouteUpdate (to, from, next) {
    // react to route changes...
    // don't forget to call next()
}
```

## ● vue-router 实现路由懒加载(动态加载路由) 
把不同路由对应的组件分割成不同的代码块，然后当前路由被访问的时候才加载对应的组件

**结合Vue的异步组件 和 Webpack的代码分割功能，**轻松实现路由组件的懒加载 

1. 使用 AMD 风格的 `require` 
2. 使用 ES6 语法 `import`
    - 使用 `webpackChunkName` 把组件按组分块
3. 使用 webpack 特有的 `require.ensure()`

