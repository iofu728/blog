// 自注销脚本:替代旧的 workbox SW(其 importScripts 依赖 storage.googleapis.com,国内不可达)
// 老访客下次访问时浏览器会拉取本文件,执行后注销 SW 并清掉旧预缓存
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.map(key => caches.delete(key))))
      .then(() => self.registration.unregister())
  )
})
