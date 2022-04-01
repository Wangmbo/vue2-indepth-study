/*
 * @Descripttion: 
 * @version: 
 * @Author: 
 * @Date: 2022-03-21 21:34:43
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-03-30 22:31:37
 */
import { nextTick } from "../utils"

let queue = []
let has = {} // 做列表维护 存放了哪些watcher
let pedding = false
function flushSchedulerQueue() {
  queue.forEach(item => {
    item.run()
  })
  queue = []
  has = {}
  pedding = false
}
// 同一个watcher
// 多次dep修改只会执行更新一次
export function queueWacther(watcher) { // 当前执行栈中代码执行完毕后，会先清空微任务，再清空宏任务，我希望更早的渲染
  const id = watcher.id
  if(!has[id]) {
    queue.push(watcher)
    has[id] = true
  }

  if(!pedding) {
    // 数据更新完毕之后拿到最新的dom内容
    // 如果用户不停的写定时器，会开启多个线程
    nextTick(flushSchedulerQueue, 0)
    // setTimeout(flushSchedulerQueue, 0)
    pedding = true
  }
}

// 使用setTimeout