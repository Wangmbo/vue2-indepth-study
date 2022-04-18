import { isReservedTab } from "../utils"

export function createElement(vm, tagName, data = {}, ...children) {
  // console.log(vm, tagName, data = {}, ...children, 'createElement')
  console.log(tagName, 'tagName')

  // 如果tag是一个组件 应该渲染一个组件的vnode

  if(isReservedTab(tag)) {
    return vnode(vm, tagName, data, data.key, children, undefined)
  } else {
    // vm.$options.components
    // return cr
  }


}

export function createTextElement(vm ,text) {
  // console.log(vm, text, 'createTextElement')
    return vnode(vm, undefined, undefined, undefined, undefined, text)
}

// export function 
// TODO 虚拟DOM生成完毕...
// TODO 整理思路!!!!
function vnode(vm, tag, data, key, children, text) {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text
    // ...
  }
}