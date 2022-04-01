/*
 * @Descripttion: 
 * @version: 
 * @Author: 
 * @Date: 2022-03-16 22:10:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-03-30 16:56:30
 */
let id = 0;
export default class Dep {  // 每个属性都分配一个dep， dep可以存放watcher，watcher还要存放这个dep
  constructor() {
    this.id = id++
    this.subs = [] //用来存放watcher
  }

  depend() {
    if(Dep.target) {
      Dep.target.addDep(this)
    }
    // Dep.target dep
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    // TODO 会被多次更新...
    this.subs.forEach(item => {
      item.update()
    })
  }
}
Dep.target = null
export function pushTarget(watcher) {
  Dep.target = watcher
}

export function popTarget() {
  Dep.target = null
}


// TODO watcher 和 dep 之间的关系...
// 依赖和watcher之间的关系
// 依赖和收集依赖
// 多对多的关系..