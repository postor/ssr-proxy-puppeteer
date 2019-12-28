# ssr-proxy-puppeteer

Make SEO easy for legacy SPA | 让单页应用SEO更简单

quick glance: https://www.youtube.com/watch?v=8hM8gV01ROg&list=PLM1v95K5B1ntVsYvNJIxgRPppngrO_X4s

## usage | 使用


install | 安装

```
npm i ssr-proxy-puppeteer -g
# when it fails try this, refer https://github.com/GoogleChrome/puppeteer/issues/375 | 如果安装失败，使用下面命令，原因参考左侧连接
npm i ssr-proxy-puppeteer -g --unsafe-perm=true
```

use | 使用

```
ssr-proxy-puppeteer --origin=http://localhost:3001
# or more detailed config | 或者更详细的配置 
ssr-proxy-puppeteer --config=config.js
```

examples | 例子

- [vue](./examples/vue)
- [angular](./examples/angular)
- [react](./examples/react)

## config | 配置

simple config | 简单版

```
  "ssr": {
    "origin": "http://jilupian.youku.com"
  }
```

more detail config version | 复杂版

```
module.exports = {
  // config for ssr
  ssr: {
    origin: "http://localhost:8080", // string, the source to proxy from | 源网站
    port: 3002, // port for this server | 此应用服务端口
    timeout: 10000, // in miliseconds, time to wait for puppeteer ssr | 等待puppeteer服务端渲染的时间（毫秒）
    ttl: 86400, //cache, inseconds| 缓存时间，秒
    
    // if need modify (like js contain original host urls) | 判断哪些请求需要额外修改body的
    bodyNeedModify: function (origin, req, res, proxyRes) {
      ...
      // return boolean
    },
    // how the body modified (rewrite urls) | body 如何修改 
    bodyModifier: function (body, origin, req, res, proxyRes) {
      ...
      // return string
    },
  },
  // config for cache refer https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagegotourl-options | 缓存配置
  cache: {
    //`cache-manager-redis` and `cache-manager-memcached-store` already installed 
    // and can be used as `store` option, by default `store` uses `memory`
    store: "cache-manager-redis",

    // other options for your store type
    // refer https://github.com/dial-once/node-cache-manager-redis or https://github.com/theogravity/node-cache-manager-memcached-store
    db: 2
  },
  // launch config for puppeteer | puppeteer启动选项配置
  // refer https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
  puppeteer: {}
}
```
for default config refer: [src/default-config.js](./src/default-config.js)

## docker

```
docker pull postor/ssr-proxy-puppeteer
docker run -p 3003:3000 -it --rm postor/ssr-proxy-puppeteer ssr-proxy-puppeteer --origin=http://192.168.1.10:8080
```
