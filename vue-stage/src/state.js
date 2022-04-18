/*
 * @Descripttion: 
 * @version: 
 * @Author: 
 * @Date: 2022-03-07 01:07:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-08 00:27:08
 */
import Dep from './observer/dep'
import { observe } from './observer/index'
import Watcher from './observer/watcher'
import { isFuntion } from './utils'

export function stateMixin(Vue) {
  Vue.prototype.$watch = function(key, handler, options = {}) {
    options.user = true
    // console.log(this, key, handler, options, 'this, key, handler, options');
    new Watcher(this, key, handler, options)
  }
}

export function initState(vm) {
  const opts = vm.$options
  if(opts.data) {
    initData(vm)
  }
  if(opts.props) {

  }
  if(opts.computed) {
    initComputed(vm, opts.computed)
  }
  if(opts.watch) {
    initWatch(vm, opts.watch)
  }
}


function initData(vm) { // vm
  let data  = vm.$options.data
  // 会将data中的所有数据进行数据劫持
  // defineProperty
  // 判断类型
  data = vm._data = isFuntion(data) ? data.call(vm) : data

  for(let key in data) {
    proxy(vm, '_data', key)
  }
  observe(data)
}


function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}




function initWatch(vm, watch) {
  for(let key in watch) {
    const watchItem = watch[key]
    // 不考虑多配置项.
    if(Array.isArray(watchItem)) {
      watchItem.forEach(item => {
        vm.$watch(key, item)
      })
    } else {
       vm.$watch(key, watchItem)
    }
  }
}

function createComputedGetter(key) {
  return function computedGetter() {
    let watcher = this._computedGetters[key]
    if(watcher.dirty) {
      watcher.execute()
    }

    // 如果当前取完值后 Dep.target还有值 需要继续向上收集
    if(Dep.target) {
      watcher.depend()
    }

    return watcher.value
  }
}

// 属性中的依赖既有渲染watcher 也有 用户自定义的 watcher
function initComputed(vm, computed) {
  const computedGetters = vm._computedGetters = {}
  for(let key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get

    computedGetters[key] = new Watcher(vm, getter, () => {}, { lazy: true })

    defineComputed(vm, key, userDef)
  }
}

function defineComputed(vm, key, userDef) {
  const propertyConfig = {}

  propertyConfig.get = createComputedGetter(key)
  propertyConfig.set = typeof userDef === 'function' ? undefined : userDef.set

  Object.defineProperty(vm, key, propertyConfig)
} 
// 当页面中直接写fullname时， fullname不会去收集渲染wacther fullname 没有dep 没有收集功能。
// firstName 是在计算属性中使用的，所以他会收集计算属性watcher，没有收集渲染wathcher。
// 计算属性中的值应该记录计算属性wacther和渲染watcher


