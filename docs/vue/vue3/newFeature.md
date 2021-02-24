---
sidebarDepth: 2
---

# 新特性
[[toc]]

## 组合式 API
- **组合式 API**
    - **能够将于同一个逻辑关注点相关的代码配置一起**
    - 更好的逻辑复用和代码组织
    - 更好的类型推到

- **选项式 API** ：按选项类型分组的代码存在的问题：
    - 碎片化使得理解和维护复杂组件变得困难
    - 选项的分离掩盖了潜在的逻辑问题
    - 处理单个逻辑关注点时，需要不断地跳转相关代码的选项块

开始使用组合式 API，在 Vue 组件中的位置称为 `setup`

### setup 组件选项
- 新的 `setup` 组件选项在创建组件之前执行，一旦 `props` 被解析，并充当合成 `API` 的入口点
- 由于在执行 `setup` 时尚未创建组件实例，因此在 `setup` 选项中没有 `this`。这意味着，除了 `props` 之外，你将无法访问组件中声明的任何属性 —— **本地状态、计算属性或方法**
- `setup` 选项接受 `props` 和 `context` 两个参数
- `setup` 返回的所有内容都将暴露给组件的计算属性、方法、声明周期等等以及组件模板

### 响应式系统 API

#### ref 创建响应式变量
- `ref` 函数使任何响应式变量在任何地方起作用
    :::details 点击看代码
    在使用 `options API` 时，响应式数据只能定义在 `data` 选择中，使用 `compositions API` 更好地抽离代码，进而复用逻辑
    ```js
    // counter.js
    import { ref } from 'vue'

    let num = ref(123);

    export default num
    ```
    ```vue
    <!-- app.vue -->
    <template>
        <button @click="add">add</button>
        <p>{{num}}</p>
    </template>

    <script>
    import num from './js/counter';
    export default {
        name: "App",
        setup() {
            function add() {
                num.value++
            };
            return {
                num,
                add
            }
        },
    };
    </script>
    ```
    :::

- `ref` 对基本类型值 **创建了一个响应式引用**
    ::: details 点击看代码
    响应式的引用名称的来源。是因为对象只包含一个名为 `value` 的 `property`，这样在应用中可以安全传递，不会失去响应性
    ```js
    import { ref } from 'vue'
    const count = ref(0)
    console.log(count.value) // 0

    count.value++
    console.log(count.value) // 1
    ```
    :::

- 模板中访问 `refs` 被自动解开的


#### watch 监听器
`watch` 函数接受 3 个参数
- 一个响应式引用或我们想要侦听的 `getter` 函数
- 一个回调
- 可选的配置选项
::: details 点击看代码
```js
import { ref, watch } from 'vue'

const counter = ref(0)
watch(counter, (newValue, oldValue) => {
  console.log('The new counter value is: ' + counter.value)
})
```
以下是等效的选项式 API：
```js
export default {
  data() {
    return {
      counter: 0
    }
  },
  watch: {
    counter(newValue, oldValue) {
      console.log('The new counter value is: ' + this.counter)
    }
  }
}
```
:::

#### computed 计算属性
与 `ref` 和 `watch` 类似，也可以使用从 `Vue` 导入的 `computed` 函数在 `Vue` 组件外部创建计算属性
```js
import { ref, computed } from 'vue'

const counter = ref(0)
const twiceTheCounter = computed(() => counter.value * 2)

counter.value++
console.log(counter.value) // 1
console.log(twiceTheCounter.value) // 2
```


### setup 内的生命周期钩子
组合式 `API` 上的生命周期钩子与选项式 `API` 的名称相同，但前缀为 `on:`即 `mounted` 看起来像 `onMounted`
```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted } from 'vue'

// in our component
setup (props) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(props.user)
  }

  onMounted(getUserRepositories) // on `mounted` call `getUserRepositories`

  return {
    repositories,
    getUserRepositories
  }
}
```

### provide/inject
我们也可以在 `组合式 API` 中使用 `provide/inject`。两者都只能在当前活动实例的 `setup()` 期间调用。

- 在 `setup()` 中使用 `provide` 和 `inject` 时，需要从 `vue` 显式导入 `provide` 和 `inject`
- 为了增加 `provide` 值和 `inject` 值之间的响应性，可以在`provide`值使用 `ref` 或 `reactive`
- 尽可能在 `provide` 组件内保持响应式 `property` 的任何更改，确保不会被 `inject` 的组件更改，可以对 `provide` 的属性使用 `readonly`

::: details 点击看例子
```vue
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, readonly, ref } from 'vue' // 显示导入
import MyMarker from './MyMarker.vue

export default {
components: {
    MyMarker
},
setup() {
    // provide 使用响应式数据，provide与 inject 之间建立响应性
    const location = ref('North Pole')
    const geolocation = reactive({
        longitude: 90,
        latitude: 135
    })

    const updateLocation = () => {
    location.value = 'South Pole'
    }

    // 对 `provide` 的属性使用 `readonly`，保不会被 `inject` 的组件更改
    provide('location', readonly(location))
    provide('geolocation', readonly(geolocation))

    provide('updateLocation', updateLocation)
}
}
</script>
```

```vue
<!-- src/components/MyMarker.vue -->
<script>
import { inject } from 'vue'

export default {
  setup() {
    const userLocation = inject('location', 'The Universe')
    const userGeolocation = inject('geolocation')
    const updateUserLocation = inject('updateLocation')

    return {
      userLocation,
      userGeolocation,
      updateUserLocation
    }
  }
}
</script>
```
:::

### 模板引用








