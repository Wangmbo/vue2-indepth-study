import { createElement, createTextElement } from "./vdom/index"

export function renderMixin(Vue) {
  Vue.prototype._c = function(tagName, attr, ...children) {
    console.log(tagName, attr, children, '_c')
    return createElement(this, ...arguments)
  }
  Vue.prototype._v = function(text) { // 
    // console.log(text ,'?_v')
    return createTextElement(this, text)
  }
  Vue.prototype._s = function(val) {
    // return this[val]
    if(typeof val === 'object') return JSON.stringify(val)
    return val
  }

  Vue.prototype._render = function() {
    const vm = this
    let render = vm.$options.render // 解析出来的render方法
    // 也有可能是用户写的
    let vnode = render.call(vm)
    // TODO _v _c 等方法没有
    // console.log('render');
    // 生成虚拟dom
    return vnode
  }
}