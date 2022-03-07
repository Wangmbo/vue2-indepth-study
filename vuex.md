> 一个专为vue应用程序开发的状态管理模式，它采用集中式存储管理应用的所有组件的状态并加以相应的规则保证状态以一种可预测的方式放生变化。



这个状态自管理应用包含以下几个部分

+ State 驱动应用的数据源
+ view 以声明方式将state映射到视图
+ Actions 响应在view的用户怓导致的状态变化



#### 简单的管理状态模式`store`模式

经常被忽略的是Vue应用中原始`data`对象实际来源--当访问数据对象时，一个Vue实例只是简单的代理访问。所以，如果你有一处需要被多个实例间共享的状态，可以简单地通过维护一份数据来实现共享



But, 我们有了唯一的数据来源之后，调试将变成噩梦，任何时间，我们应用中的任何部分，在任何数据改变后，都不会留下变更过的记录，可以用一个简单的store模式...



#### State

> 单一状态树

vuex使用单一状态树，用一个对象包含了全部的应用层级状态



通过在根实例中注册`store`选项，该store实例会注入到根组件下的所有子组件中，且子组件能通过`this.$store`访问到。



`mapState`辅助函数

#### Getter

> 可以认为是store的计算属性

接收两个参数，1.state 2. 其他getter



`mapGetters`辅助函数



#### Mutation

> 更改Vuex的store中的状态的唯一方法是提交mutation。vuex中的mutation非常类似于事件：每个Mutation都有一个字符串的事件类型和一个回调函数`handle`



1. 最好提前在你的store中初始化好所有的所需属性
2. 当需要在对象上添加新属性，应该使用：
   + 使用`Vue.set(obj, 'newProp', 123)`
   + 以新对象替换老对象



使用常量替代Mutation事件类型

例如：

```javascript
export const SOME_MUTATION = 'SOME_MUTATION'
```

```javascript
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'
const store = new Vuex.Store({
  state: {},
  mutations: {
    [SOME_MUTATION](state) {
      // mutate state
    }
  }
})
```



**Mutation必须是同步函数**

Why?

异步进行的回调函数中进行的状态的改变是不可追踪的，当mutation触发时，回调函数还没有被调用，devtools不知道什么时候回调函数实际上被调用—实质上任何在回调函数中进行的状态的改变都是不可追踪的。







#### Action

Action类似于mutation，不同在于：

+ Action 提交的是mutation，而不是直接变更状态
+ Action可以包含任意异步操作
+ 进行异步操作完毕之后通过提交mutation来记录action产生的副作用（即状态变更）。



#### Module

> Vuex 允许我们将store分割成模块，每个模块拥有自己的state、mutation、action、getter、甚至是嵌套子模块 - 从上之下进行同样方式的分割

