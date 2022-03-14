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
    console.log(this.__ob__)
    this.__ob__.observeArray(addList)
    console.log(addList, 'addList')
    return result
  }
})