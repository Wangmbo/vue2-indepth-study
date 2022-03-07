import { initState } from './state'
export function initMixin(Vue) { // 表示在vue的基础上做一次混合操作
  // 默认下划线是私有的
  Vue.prototype._init = function(options) {
    console.log(options)
    const vm = this
    // vue内部会对属性检测如果是$开头的就不会进行代理
    vm.$options = options // 后面会对options进行扩展, 这里目前是用户传入的options

    // 对数据进行初始化 watch computed props data
    initState(vm) // vm 指向当前实例
  }
}