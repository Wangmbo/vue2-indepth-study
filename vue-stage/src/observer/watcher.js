import { popTarget, pushTarget } from "./dep"
import { queueWacther } from "./schedular"

let id = 0
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm
    this.cb = cb
    this.options = options
    this.lazy = options.lazy
    this.dirty = options.lazy
    this.id = id++
    // 默认执行
    // this.exprOrFn() // 生成render
    console.log(vm, 'vm')
    // debugger
    if(typeof exprOrFn === 'string') {
      this.getter = function() {
        console.log(exprOrFn, 'exprOrFn..')
        const result = exprOrFn.split('.').reduce(function (total, cur) {
          // console.log(total, this.vm)
          return total = total[cur]
        }, this)
        // debugger
        return result
      }
       
    } else {
     this.getter = exprOrFn  
    }
    this.deps = []
    this.depsId = new Set()
    if(!this.lazy) this.get()
  }
  // 用户更新时重新调用getter方法
  get() {
    //  defineProperty.get
    //  每个属性都可以收集自己的watcher
    // 我希望一个属性可以对应多个watcher 同时一个watcher对应多个属性
    // console.log(this, 'pushTarget(this)')
    pushTarget(this)
    // 每一个组件都有一个watcher 组件渲染之前会建立这个watcher 并且将属性的依赖和该watcher关联起来
    const value = this.getter.call(this.vm)
    // console.log(value, value, 'value')
    popTarget()

    return value
  }
  run() {
    const newVal = this.get()
    // console.log(this.options.user, 'this.options.user')
    if(this.options.user) {
      this.cb.call(this, this.value, newVal)
      this.value = newVal
    }
  }
  update() {
    if(this.lazy) {
      this.dirty = true
    } else {
      // 多次调用update 我希望将wathcer缓存下来，等一会一起更新
      queueWacther(this)
    }
  }
  addDep(dep) {
    const id = dep.id
    if(!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      // 如果该watcher没收集过该dep,那么dep也要反向手机watcher
      dep.addSub(this)
    }
  }
  execute() {
    this.dirty = false
    this.value = this.get()
  }

  depend() {
    let i = this.deps.length
    while(i--) {
      this.deps[i].depend()
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