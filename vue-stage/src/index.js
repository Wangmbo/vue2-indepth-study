import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './render'
import { stateMixin } from './state'
function Vue(options) {
  // options 为用户传入的选项
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
stateMixin(Vue)
// renderMixin() // _render
// lifecycleMixin() // _update

export default Vue