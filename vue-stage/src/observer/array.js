export let arrayMethods = Object.create(Array.prototype)

let oldArrayPrototype = Array.prototype

let methods = ['push', 'shift', 'pop', 'unshift', 'reverse']

methods.forEach(method => {
  arrayMethods[method] = function(...args) {
    console.log('数组发生变化...')
    // TODO 如果是push了一个对象之类的，也需要劫持...
    return oldArrayPrototype[method].call(this, ...args)
  }
})