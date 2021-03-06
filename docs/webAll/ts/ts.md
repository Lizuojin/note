# TS 学习笔记
[[toc]]
## 数据类型
- void
- any
- never
- 元组
- 枚举

高级类型

## 类型注解

作用：相当于强类型语言中的类型声明

语法：（变量/函数）：type

## 枚举类型

**枚举:** 一组有名字的常量集合
- 数字枚举
- 字符串枚举

**实现原理：** 反向映射
- 可以使用名字索引，也可以使用数字索引

**枚举成员**

- 只读类型
- 常量枚举成员：在编译阶段计算出结果，以常量的形式出现在运行阶段环境
  - 没有初始值
  - 对已有枚举成员的引用
  - 常量的表达式
- computed(需要被计算的枚举成员)：在编译阶段不会计算，会保留到执行阶段
  - 非常量的表达式

```js
enum Char {
    // const
    a,
    b = Char.a,
    c = 1 + 3  
    
    // computed
    d = Math.random(),
    e = '123'.length
}
```



**常量枚举**：当需要一个对象，但不需要值的时候使用常量枚举。可以减少编译时的代码

```js
const enum Month {
    Jan,
    Feb,
    Mar
}
```





## 类型基础

**静态类型语言：** 在编译阶段确定所有变量的类型

**动态类型语言：** 在执行阶段确定所有变量的类型

对比：

| 静态类型语言   | 动态类型语言             |
| :------------- | :----------------------- |
| 对类型极度严格 | 对类型非常宽松           |
| 立即发现错误   | Bug 可能隐藏数月甚至数年 |
| 运行时性能好   | 运行时性能差             |
| 自文档化       | 可读性差                 |

```js
tsc --init -> tsconfig.json
```



## 接口

可以约束对象、函数、类的结构和类型

## 类



**修饰符**

- 公有属性(public) —— 默认，对所有都是可见的

- 私有成员(private) —— 只能在类的本身调用，不能被实例调用也不能被子类调用，

- 受保护成员(protected) —— 只能在类或者子类中访问，不能再类的实例中访问；用在构造函数，不能被实例化，只能被继承
- 只读属性(readonly) —— 不能更改，一定要初始化
- 静态成员(static) —— 不可以通过子类访问属性

### 抽象类与多态

抽象类(abstract) —— 只能被继承，而不能被实例化的类

```js
abstract class Animal {
    abstract sleep(): void // 抽象方法：好处明确知道子类有其他的实现，没必要在父类中实现 
}
```

多态 —— 在父类中定义一个抽象方法，在多个子类中对这个方法有不同的实现，在程序运行时会根据不同的对象，执行不同的操作，实现运行时的绑定



## 泛型

不预先确定的数据类型，具体的类型在使用的时候才能确定

**泛型的好处**

1. 函数和类可以轻松地支持多种类型，增强程序的扩展性
2. 不必写多条函数重载，冗长的联合类型声明，增强代码的可读性
3. 灵活控制类型之间的约束























