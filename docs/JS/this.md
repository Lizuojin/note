

# this 解读

当 `JavaScript` 代码执行一段可执行代码(executable code)时，会创建对应的执行上下文(execution context)。

对于每个执行上下文，都有三个重要属性：
- 变量对象(Variable object，VO)
- 作用域链(Scope chain)
- this

下面讲讲 this

因为我们要从 ECMASciript5 规范开始讲起。

先奉上 ECMAScript 5.1 规范地址：[英文版](http://es5.github.io/#x15.1)[中文版](http://yanhaijing.com/es5/#115)

让我们开始了解规范吧！
## Types
首先是第 8 章 Types，`ECMAScript` 的类型分为：
- **语言类型**：开发者直接使用 `ECMAScript` 可以操作的
    - 比如：`Undefined`, `Null`, `Boolean`, `String`, `Number`, `Object`
- **规范类型**：是用来用算法描述 `ECMAScript` 语言结构和 `ECMAScript` 语言类型的
    - 规范类型包括：`Reference`, `List`, `Completion`, `Property` `Descriptor`, `Property` `Identifier`, `LexicalEnvironment`, `EnvironmentRecord`

今天我们要讲的重点是便是其中的 `Reference` 类型。它与 `this` 的指向有着密切的关联。

## Reference
`Reference` 类型就是用来解释诸如 `delete`、`typeof` 以及赋值等操作行为的

抄袭尤雨溪大大的话，就是：
>这里的 Reference 是一个 Specification Type，也就是 “只存在于规范里的抽象类型”。它们是为了更好地描述语言的底层行为逻辑才存在的，但并不存在于实际的 js 代码中。

Reference 的构成，由三个组成部分，分别是：
- `base value`：属性所在的对象或者就是 EnvironmentRecord
- `referenced name`：就是属性的名称
- strict reference
举个列子
```js

var foo = 1;

// 对应的Reference是：
var fooReference = {
    base: EnvironmentRecord,
    name: 'foo',
    strict: false
};
```
而且规范中还提供了获取 Reference 组成部分的方法：
- `GetBase`：返回 `reference` 的 `base value`
- `IsPropertyReference`：如果 `base value` 是一个对象，就返回 `true`
- `GetValue`：用于从 `Reference` 类型获取对应值
    ::: details 点击看代码
    简单模拟 GetValue 的使用：
    ```js
    var foo = 1;

    var fooReference = {
        base: EnvironmentRecord,
        name: 'foo',
        strict: false
    };

    GetValue(fooReference) // 1;
    ```
    `GetValue` 返回对象属性真正的值，但是要注意：

    调用 `GetValue`，返回的将是具体的值，而不再是一个 `Reference`
    :::

## 如何确定this的值
关于 `Reference` 讲了那么多，到底 `Reference` 跟本文的主题 `this` 有哪些关联呢？请往下看

看规范 11.2.3 Function Calls：这里讲了当函数调用的时候，如何确定 this 的取值。只看第一步、第六步、第七步：
> - 1. Let ref be the result of evaluating MemberExpression.
> - 6. If Type(ref) is Reference, then
>     - a. If IsPropertyReference(ref) is true, then
>         - i. Let thisValue be GetBase(ref).
>     - b. Else, the base of ref is an Environment Record
>         - i. Let thisValue be the result of calling the ImplicitThisValue concrete method of GetBase(ref).
> - 7. Else, Type(ref) is not Reference.
>     - a. Let thisValue be undefined.

- 1. 计算 MemberExpression 的结果赋值给 ref
- 6. 判断 ref 是不是一个 Reference 类型
    - a. 如果 ref 是 Reference，并且 IsPropertyReference(ref) 是 true, 那么 
        - i. this 的值为 GetBase(ref)
    - b. 如果 ref 是 Reference，并且 base value 值是 Environment Record, 那么 
        - i. this的值为 ImplicitThisValue(ref)
- 7. 如果 ref 不是 Reference，那么 
    - a. this 的值为 undefined

## 具体分析

### 分析：1. 计算 MemberExpression 的结果赋值给 ref

什么是 MemberExpression？看规范 11.2 Left-Hand-Side Expressions：
- PrimaryExpression：原始表达式 可以参见《JavaScript权威指南第四章》
- FunctionExpression：函数定义表达式
- MemberExpression [ Expression ]：属性访问表达式
- MemberExpression.IdentifierName：属性访问表达式
- new MemberExpression Arguments：对象创建表达式
```js
function foo() {
    console.log(this)
}

foo(); // MemberExpression 是 foo

function foo() {
    return function() {
        console.log(this)
    }
}

foo()(); // MemberExpression 是 foo()

var foo = {
    bar: function () {
        return this;
    }
}

foo.bar(); // MemberExpression 是 foo.bar
```
所以简单理解 MemberExpression 其实就是()左边的部分。

### 分析：2.判断 ref 是不是一个 Reference 类型。
关键就在于看规范是如何处理各种 `MemberExpression` 返回的结果是不是一个 `Reference` 类型
```js
var value = 1;

var foo = {
  value: 2,
  bar: function () {
    return this.value;
  }
}

//示例1
console.log(foo.bar());
//示例2
console.log((foo.bar)());
//示例3
console.log((foo.bar = foo.bar)());
//示例4
console.log((false || foo.bar)());
//示例5
console.log((foo.bar, foo.bar)());
```
#### 示例1：foo.bar()
在示例 1 中，`MemberExpression` 计算的结果是 `foo.bar`，那么 `foo.bar` 是不是一个 `Reference` 呢？
> Return a value of type Reference whose base value is baseValue and whose referenced name is propertyNameString, and whose strict mode flag is strict.

我们得知该表达式返回了一个 Reference 类型！

根据之前的内容，我们知道该值为：
```js
var Reference = {
  base: foo,
  name: 'bar',
  strict: false
};
```
接下来按照 2.1 的判断流程走：

> 2.1 如果 ref 是 Reference，并且 IsPropertyReference(ref) 是 true, 那么 this 的值为 GetBase(ref)

该值是 Reference 类型，那么 IsPropertyReference(ref) 的结果是多少呢？

前面我们已经铺垫了 IsPropertyReference 方法，如果 base value 是一个对象，结果返回 true。

base value 为 foo，是一个对象，所以 IsPropertyReference(ref) 结果为 true。

这个时候我们就可以确定 this 的值了：
```js
this = GetBase(ref)，
```
`GetBase` 也已经铺垫了，获得 `base value` 值，这个例子中就是 `foo`，所以 `this` 的值就是 `foo` ，示例 `1` 的结果就是 `2`

#### 示例2：(foo.bar)()
foo.bar 被 () 包住，查看规范 11.1.6 The Grouping Operator

直接看结果部分：

> Return the result of evaluating Expression. This may be of type Reference.

> NOTE This algorithm does not apply GetValue to the result of evaluating Expression.

实际上 () 并没有对 `MemberExpression` 进行计算，所以其实跟示例 1 的结果是一样的。

#### 示例3：(foo.bar = foo.bar)()
看示例3，有赋值操作符，查看规范 11.13.1 Simple Assignment ( = ):

计算的第三步：

> 3.Let rval be GetValue(rref).

因为使用了 `GetValue`，所以返回的值不是 `Reference` 类型，

按照之前讲的判断逻辑：

> 7. 如果 ref 不是Reference，那么 this 的值为 undefined

`this` 为 `undefined`，非严格模式下，`this` 的值为 `undefined` 的时候，**其值会被隐式转换为全局对象**。

#### 示例4：(false || foo.bar)()
看示例4，逻辑与算法，查看规范 11.11 Binary Logical Operators：

计算第二步：

> 2.Let lval be GetValue(lref).

因为使用了 `GetValue`，所以返回的不是 `Reference` 类型，`this` 为 `undefined`

#### 示例4：(foo.bar, foo.bar)()
看示例5，逗号操作符，查看规范11.14 Comma Operator ( , )

计算第二步：

> 2.Call GetValue(lref).

因为使用了 `GetValue`，所以返回的不是 `Reference` 类型，`this` 为 `undefined`

#### 补充
```js
function foo() {
    console.log(this)
}

foo(); 
```
`MemberExpression` 是 `foo`，解析标识符，查看规范 10.3.1 Identifier Resolution，会返回一个 `Reference` 类型的值：
```js
var fooReference = {
    base: EnvironmentRecord,
    name: 'foo',
    strict: false
};
```
接下来进行判断：

> 2.1 如果 `ref` 是 `Reference`，并且 `IsPropertyReference(ref)` 是 `true`, 那么 `this` 的值为 `GetBase(ref)`

因为 `base value` 是 `EnvironmentRecord`，并不是一个 Object 类型

`IsPropertyReference(ref)` 的结果为 `false`，进入下个判断：

> 6. 如果 `ref` 是 `Reference`，并且 `base value` 值是 `Environment Record` 那么 a. `this` 的值为 `ImplicitThisValue(ref)`

`base value` 正是 `Environment Record`，所以会调用 `ImplicitThisValue(ref)`

查看规范 10.2.1.1.6，ImplicitThisValue 方法的介绍：该函数始终返回 `undefined`

所以最后 `this` 的值就是 `undefined`































