import { popTarget, pushTarget } from "./dep"
import { queueWacther } from "./schedular"

let id = 0
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.cb = cb
    this.options = options
    this.id = id++
    // 默认执行
    // this.exprOrFn() // 生成render 
    this.getter = exprOrFn
    this.deps = []
    this.depsId = new Set()
    this.get()
  }
  // 用户更新时重新调用getter方法
  get() {
    //  defineProperty.get
    //  每个属性都可以收集自己的watcher
    // 我希望一个属性可以对应多个watcher 同时一个watcher对应多个属性
    pushTarget(this)
    // 每一个组件都有一个watcher 组件渲染之前会建立这个watcher 并且将属性的依赖和该watcher关联起来
    this.getter()
    popTarget()
  }
  run() {
    console.log('run')
    this.get()
  }
  update() {
    queueWacther(this)
    // 多次调用update 我希望将wathcer缓存下来，等一会一起更新
  }
  addDep(dep) {
    const id = dep.id
    if(!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
}

// 明天抽时间整理
// watcher 和 dep
// 我们将更新的功能封装了一个watcher
// 渲染页面前，会将当前watcher放到Dep类上
// 在vue中页面渲染时使用的属性，需要进行依赖收集，收集对象的渲染watcher
// 取值时，给每个属性都加了个dep属性，用于存储这个渲染watcher（同一个watcher会对应多个dep）
// 每个属性可能对应多个视图（多个视图肯定是多个watcher），一个属性要对应多个watcher
// dep.depend () => 通知dep存放watcher => Dep.target.addDep() 通知watcher 存放dep
// 双向存储

// TODO 逻辑过一遍..

// TODO 多次更新只走一次...

export default Watcher