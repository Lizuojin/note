# HTTP 相关面试题

## HTTP 协议
HTTP (Hyper Text Transfer Protocol) 是应用层上的客户端与服务端的通信协议，它由请求和响应构成，且是无状态的，是基于TCP/IP通信协议来传递数据的协议

## HTTP 方法
- **GET**：请求指定的页面信息，并返回实体主体
- **HEAD**：类似于 get 请求，只不过返回的响应中没有具体的内容，用于获取报头
- **POST**：向指定资源提交数据进行处理请求（例如提交表单或者上传文件）。数据被包含在请求体中。
- **PUT**：从客户端向服务器传送的数据取代指定的文档内容
- **DELETE**：请求服务器删除指定的页面
- **CONNECT**：HTTP/1.1 协议中预留给能够将连接改为管道方式的代理服务器
- **OPTIONS**：允许客户端查看服务器性能
- **TRACE**：回显服务器收到的请求，主要用于测试或诊断
- **PATCH**：是对 PUT 方法的补充，用来对已知资源进行局部更新

## get和post请求的区别
- `get` 请求数据一般都拼接在 `URL` 的地址后面，是明文显示的；而 `post` 请求的数据放在 `HTTP` 的请求体中，可以是明文显示，也可以是密文显示，所以 post 请求的数据安全性相对来说会高些
- `get` 请求传输数据量小，一般限制在 `2KB` 左右，但是执行效率高；`post` 请求传输数据比较大（IIS4 80KB，IIS5100KB），执行效率稍低

## 开发中常用的几种 Content-Type

### 1、application/x-www-form-urlencoded
浏览器的原生 form 表单，如果不设置 `enctype` 属性，那么最终就会以 `application/x-w-form-urlencode` 方式提交数据。该种方式提交的数据放在 `body` 里面，数据按照 `key1=val1&key2=val2` 的方式进行编码，`key` 和 `val` 都进行了 `URL` 转码。

### 2、multipart/form-data
这个方式是一个常见的 POST 提交方式，通常表单上传文件时使用该方式，

### 3、application/json
告诉服务器消息主体是序列化后的 JSON 字符串

### 4、text/xml
该种方式主要用来提交 XML 格式的数据












































































