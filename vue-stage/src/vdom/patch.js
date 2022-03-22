export function patch(oldVnode, vnode) {
  if(oldVnode.nodeType == 1) {
    // 真实元素
    // 用vnode 来生成真实dom替换成原本的dom元素
    // 删除原来的节点 然后用虚拟节点生成的dom放置到老节点的下一个节点
    const parentElm = oldVnode.parentNode

    const elm = createEle(vnode)
    // 在第一次渲染后 删除掉节点， 下次无法获取
    parentElm.insertBefore(elm, oldVnode.nextSibling)

    parentElm.removeChild(oldVnode)

    return elm
  }
}

function createEle(vnode) {
  let { tag, data, children, text, vm } = vnode
  if(typeof vnode.tag === 'string') {
    vnode.el = document.createElement(tag) // 虚拟节点会有一个el属性对应真实节点

    children.forEach(child => {
      vnode.el.appendChild(createEle(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}