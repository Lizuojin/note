# Vuex 相关面试题

## 什么情况下使⽤ Vuex
Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，

### 1. 当一个组件需要多次派发事件时

### 2. 跨组件共享数据、跨页面共享数据

## ● 你使用过 Vuex 吗？
`Vuex` 是一个专为 Vue 应用程序开发的状态管理模式，每一个 `Vuex` 应用的核心就是 `store` (仓库)，`store` 基本上就是一个容器，它包含着你的应用中大部分的状态 ( state )
- `Vuex` 的状态存储是响应式的。当 `Vue` 组件从 `store` 中读取状态的时候，若 `store` 中的状态发生变化，那么相应的组件也会相应地得到高效更新
- 改变 `store` 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化

主要包括以下几个模块：
- State：定义了应用状态的数据结构，可以在这里设置默认的初始状态
- Getter：可以依赖 state 中的数据计算出一些状态，类似 vue 中的计算属性
- Mutation：是唯一更改 store 中状态的方法，且必须是同步函数
- Action：用于提交 mutation，不可以直接变更 state，可以包含任意异步操作
- Module：允许将单一的 Store 拆分为多个 store 且同时保存在单一的状态树中 

## ● v-model 和 vuex 有冲突么
严格模式下，在 `v-model` 上使用 `Vuex` 的 `state` 状态，将会抛出错误，因为状态的变更不是由 `mutations` 函数引起的，

### 解决办法：

1. 给 `<input>` 中绑定 `value`，然后侦听 `input` 或者 `change` 事件，在事件回调中调用一个方法
```html
<input :value="message" @input="updateMessage">
```
```js

computed: {
    ...mapState({
        message: state => state.obj.message
    })
},
methods: {
    updateMessage (e) {
        this.$store.commit('updateMessage', e.target.value)
    }
}
```

2. 双向绑定的计算属性
```html
<input v-model="message">
```
```js
computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.commit('updateMessage', value)
    }
  }
}
```














