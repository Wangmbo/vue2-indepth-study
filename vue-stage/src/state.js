import { observe } from './observer/index'
import { isFuntion } from './utils'
export function initState(vm) {
  const opts = vm.$options
  if(opts.data) {
    initData(vm)
  }
  if(opts.props) {

  }
}


function initData(vm) { // vm
  let data  = vm.$options.data
  // 会将data中的所有数据进行数据劫持
  // defineProperty
  // 判断类型
  console.log(data)
  data = vm._data = isFuntion(data) ? data.call(vm) : data

  for(let key in data) {
    proxy(vm, '_data', key)
  }
  observe(data)
  // console.log(data)
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
