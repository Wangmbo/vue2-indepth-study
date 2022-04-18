/*
 * @Descripttion: 
 * @version: 
 * @Author: 
 * @Date: 2022-04-09 11:37:09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-10 11:21:26
 */
import Collapse from "./collapse.js";
import CollapseItem from "./collapse-item.js";

window.customElements.define('my-collapse', Collapse)
window.customElements.define('my-collapse-item', CollapseItem)

// 设置组件默认显示状态
let defaultActive = ['1']
document.querySelector('my-collapse').setAttribute('active', JSON.stringify(defaultActive))
// 每个item 需要获取到 defaultActive 和 自己的name属性比较

document.querySelector('my-collapse').addEventListener('change-name', (e) => {
  const { name, isShow } = e.detail
  
  if(isShow) {
    defaultActive.splice(defaultActive.indexOf(name), 1)
  } else {
    defaultActive.push(name)
  }
  // console.log(e.detail)
  document.querySelector('my-collapse').setAttribute('active', JSON.stringify(defaultActive))
})

// shadow 完全隔离
// 组件间通信 属性 事件
// customEvent webcomponent 兼容性差 没有自动更新机制
// xx