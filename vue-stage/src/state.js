/*
 * @Descripttion: 
 * @version: 
 * @Author: 
 * @Date: 2022-03-07 01:07:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-03-27 12:33:41
 */
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

// 属性中的依赖既有渲染watcher 也有 用户自定义的 watcher