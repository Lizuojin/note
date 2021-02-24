# ● Vue3.0 里为什么要用 Proxy API 替代 defineProperty API
通过下面的对比，可以知道 `Proxy API` 相对于 `defineProperty API`，更强大、更灵活、性能更好

## 1. 对象的劫持
- `Object.defineProperty` 只能遍历对象属性进行劫持
    ::: details 点击看详情
    ```js
    function observe(obj) {
        if (typeof obj !== 'object' || obj == null) {
            return
        }
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key])
        })
    }
    ```
    :::
- `Proxy` 直接可以劫持整个对象，并返回一个新对象，我们可以只操作新的对象达到响应式目的
    ::: details 点击看详情
    ```js
    function reactive(obj) {
        if (typeof obj !== 'object' && obj != null) {
            return obj
        }
        // Proxy相当于在对象外层加拦截
        const observed = new Proxy(obj, {
            get(target, key, receiver) {
                const res = Reflect.get(target, key, receiver)
                console.log(`获取${key}:${res}`)
                return res
            },
            set(target, key, value, receiver) {
                const res = Reflect.set(target, key, value, receiver)
                console.log(`设置${key}:${value}`)
                return res
            },
            deleteProperty(target, key) {
                const res = Reflect.deleteProperty(target, key)
                console.log(`删除${key}:${res}`)
                return res
            }
        })
        return observed
    }
    ```
    :::

## 2. 简单数据操作的劫持
- `Object.defineProperty` 需要增加额外的 `$set` `$delete` 方法进行对象简单数据的操作，才能响应更新视图
    ::: details 点击看详情
    ```js
    // set、delete
    Vue.set(obj,'bar','newbar')
    Vue.delete(obj),'bar')
    ```
    :::

- `Proxy` 简单数据的操作，都能劫持
    ::: details 点击看详情
    ```js
    const state = reactive({
        foo: 'foo'
    })
    // 1.获取
    state.foo // ok
    // 2.设置已存在属性
    state.foo = 'fooooooo' // ok
    // 3.设置不存在属性
    state.dong = 'dong' // ok
    // 4.删除属性
    delete state.dong // ok
    ```
    :::

## 3. 监听数组的变化
- `Proxy` 可以直接监听数组的变化
    ::: details 点击看详情
    ```js
    const obj = [1,2,3]
    const proxtObj = reactive(obj)
    obj.psuh(4) // ok
    ```
    :::

- `Object.defineProperty` 需要重写数组方法，才能监听到数组的变化

**Proxy有多达13种拦截方法,不限于apply、ownKeys、deleteProperty、has等等，这是Object.defineProperty不具备的**

[参考文献](https://mp.weixin.qq.com/s/fJc6aKroWTUj9z8hDAX40Q)