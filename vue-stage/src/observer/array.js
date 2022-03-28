export let arrayMethods = Object.create(Array.prototype)

let oldArrayPrototype = Array.prototype

let methods = ['push', 'shift', 'pop', 'unshift', 'reverse', 'splice', 'sort']

methods.forEach(method => {
  arrayMethods[method] = function(...args) {
    console.log('数组发生变化...')
    // TODO 如果是push了一个对象之类的，也需要劫持...
    const result = oldArrayPrototype[method].call(this, ...args)
    // 如果有新增，我们要监控的是数组的每一项，而不是数组
    let addList
    switch (method) {
      case 'push': 
      case 'unshift':
        addList = args
        break;
      case 'splice':
        addList = args.concat(2)
        break;
      default:
    }
    if(addList) this.__ob__.observeArray(addList)
    // TODO 梳理关系
    // 数组的 observer.dep 属性
    // 为什么数组要有dep 
    // 因为调用方法时 数组更新 需要 调用dep的notify更新数据...
    // 给数组配置一个dep ,让dep记住这个watcher 数组一旦变化 让这个watcher 更新.
    this.__ob__.dep.notify()

    return result
  }
})