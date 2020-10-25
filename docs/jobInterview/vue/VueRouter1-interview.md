# VueRouter 面试题
## 1、vue-router 路由模式有几种？
vue-router 有 3 种路由模式：hash、history、abstract
- **hash**：使用 URL hash值作为路由
- **history**：使用 HTML5 History API 和服务器配置
- **abstract**：支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式