---
sidebarDepth: 1
---

# 实战相关面试题
## 怎么阻止点击多次请求多次的问题
### 方案一
申明一个变量，用于切换按钮的禁用状态，请求时变量为 `true` 按钮为禁用状态，请求完成将变量设置为 `false`
```html
<template>
  <div>
    <button @click="submit" :disabled='isDisable'>提交</button>
  </div>
</template>
```
```js
export default {
  data(){
    return {
      isDisable: false,
    }
  },
  methods: {
    submit(){
      this.isDisable = true
       setTimeout(()=>{
          console.log('请求成功')
          this.isDisable = false   //点击一次时隔两秒后才能再次点击
       }, 2000)
    },
  }
}
```


















