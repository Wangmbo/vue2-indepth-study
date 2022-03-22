import { initState } from './state'
import { compileToFunction } from './compiler/index'
import { mountComponent } from './lifecycle'
export function initMixin(Vue) { // 表示在vue的基础上做一次混合操作
  // 默认下划线是私有的
  Vue.prototype._init = function(options) {
    console.log(options)
    const vm = this
    // vue内部会对属性检测如果是$开头的就不会进行代理
    vm.$options = options // 后面会对options进行扩展, 这里目前是用户传入的options

    // 对数据进行初始化 watch computed props data
    initState(vm) // vm 指向当前实例


    if(vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function(el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)
    vm.$el = el

    if(!options.render) {
      let template = options.template
      if(!template && el) {
        template = el.outerHTML
        // TODO 生成render函数...
        // 渲染render...
        // console.log(template)
        console.log(template)
        options.render = compileToFunction(template)
      }
    }

    console.log(options.render, 'render...') // 调用render 渲染真实dom 替换掉页面的内容
    mountComponent(vm, el) // 组件的挂载流程
  }
}


// 把模板转化成 对应的渲染函数 =》 虚拟dom概念 vnode =》 diff 算法 更新虚拟dom => 产生真实节点，更新
//  vm.$options render 函数 就不用将模板转为渲染函数了
// 没有render就用template

// options.render 就是渲染函数