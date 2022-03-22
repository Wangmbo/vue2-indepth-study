import { isObject } from "../utils";
import { arrayMethods } from './array'
import Dep from "./dep";

// 如果数据是对象 会将对象不停地递归 进行劫持
// 如果是数组， 会劫持数组的方法，并对数组中不是基本数据类型的进行检测
class Observe {
  constructor(data) { // 对对象中的所有属性进行劫持
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false
    })
    // data.__ob__ = this
    if(Array.isArray(data)) {
      // 数组劫持的逻辑
      // 核心思想是对数组的方法进行劫持
      // 对数组原来的方法进行改写，切片编程 高阶函数
      data.__proto__ = arrayMethods

      this.observeArray(data)
    } else {
      this.walk(data)
    }
  }
  // 循环遍历劫持...
  walk(data) { // 对象
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key])
    })
  }

  observeArray(data) {
    // console.log(data, 'observeArray')
    data.forEach(item => {
      observe(item)
    })
  }
}

function defineReactive(data, key, value) {
  observe(value)
  // TODO Object.defineProperties
  console.log(data, 'data')
  let dep = new Dep() // 每个属性都有一个dep属性
  Object.defineProperty(data, key, {
    get() {
      // 取值时我希望将watcher和dep对应起来
      // console.log(key, 'get ')
      // Dep.target
      if(Dep.target) { // 此值是在模板中取值的
        dep.depend() // 让dep
      }
      return value
    },
    set(val) {
      if(val ===  value) return
      console.log(key, val, 'set')
      observe(value) // 如果用户赋值了一个新对象， 需要对这个新对象进行劫持
      value = val
      dep.notify() // 通知dep属性更新
    }
  })
}

// import { isObject } from '../utils'
export function observe(data) {
  if(data.__ob__) return
  // 如果是对象才观测
  if(!isObject(data)) return
  // if(!isObject(data)) return
  return new Observe(data)
}
// vue2 没有对数组进行索引的劫持
// 而且一般用户很少通过索引去操作数组.
// 内部就想到不对索引进行拦截，因为消耗严重.
// 数组没有监控索引的变化，但是索引对应的内容是对象类型，需要被监控

// 重写了push shift pop unshift reverse sort splice
// 这几个方法