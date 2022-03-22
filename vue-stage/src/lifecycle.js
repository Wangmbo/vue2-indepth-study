import Watcher from "./observer/watcher"
import { nextTick } from "./utils"
import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    console.log('update vnode-----', vnode)
    // 初始化 更新
    // 既有初始化 又有更新 比较前后差异
    const vm = this
    vm.$el = patch(vm.$el, vnode)
    // 更新不需要重新的词法分析，只需要重新调用render
    // 不管怎么样初始的html是固定的
    // 将虚拟dom生成真实dom
  }
}

// 后续每个组件渲染的时候都有一个watcher
export function mountComponent(vm, el) {
  // 更新函数 数据变化后 会再次调用此函数
  let updateComponent = () => {
    // 调用render函数 生成虚拟dom
    vm._update(vm._render()) // 后续更新可以调用updateCompoennt方法
    // 用虚拟dom生成真实dom
    // 重新调用render方法产生虚拟dom 目前还没有diff
  }
  vm.$nextTick = nextTick
  // 观察者模式 属性是被观察者  属性页面：观察者
  new Watcher(vm, updateComponent, () => {
    console.log('更新视图了')
  }, true) // 它是一个渲染watcher 后续有其他的watcher
}