+ webapp 不能离线访问
+ 用户粘性低（无法保存入口，需要通过链接访问）
> PWA(Progressive Web Apps) 让webapp 具有快速、可靠、安全等特点


### PWA 一系列用到的技术
+ Web App Manifest 将网站添加到桌面
+ Service Worker
  + 不能访问/操作dom
  + 会自动休眠，不会随浏览器关闭所失效
  + 离线缓存内容开发者可控
  + 必须在https或者localhost下使用
  + 所有的api都基于promise

等待资源加载完毕后，再开启线程
当断网时，需要拦截请求，使用缓存的结果
当ServiceWork 安装时 需要跳过等待
需要在下一次访问的时候才生效 =》 激活后让serviceWork 立刻有控制权
对资源进行离线缓存(缓存主要的离线资源，和部分接口)
缓存版本号
清空历史缓存
缓存策略

+ Push Api & Notification Api
+ App Shell & App Skeleton

+ workbox


### cache indexDb