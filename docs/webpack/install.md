---
sidebarDepth: 1
---

# 安装

## 全局安装
```sh
$ npm install webpack webpack-cli -g
```
> webpack4.0+的版本，必须安装webpack-cli，-g命令代表全局安装的意思

## 本地安装
```sh
npm install webpack webpack-cli --save-dev
```
> 本地安装的 `Webpack` 意思是，只在你当前项目下有效。而通过全局安装的 `Webpack` ，如果两个项目的 `Webpack` 主版本不一致，则可能会造成其中一个项目无法正常打包。本地安装方式也是实际开发中推荐的一种 `Webpack` 安装方式。

## 版本安装
```sh
# 查看webpack的历史版本记录
$ npm view webpack versions

# 按版本号安装
$ npm install webpack@4.25.0 -D
```
> 如果你对 `Webpack` 的具体版本有严格要求，那么可以先去 `github` 的 `Webpack` 仓库查看历史版本记录或者使用 `npm view webpack versions` 查看 `Webpack` 的`npm` 历史版本记录












