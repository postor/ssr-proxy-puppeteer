# ssr-proxy-puppeteer

Make SEO easy for legacy SPA | 让单页应用SEO更简单

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
default config: [src/default-config.js](./src/default-config.js)

examples | 例子

- [vue](./examples/vue)
- [angular](./examples/angular)

## default rules | 默认规则

- only GET request may get server side rendered | 只有GET请求才有可能被服务端渲染
- response with `Content-Type` contain `text/html` will get server side rendered | GET请求的response `Content-Type` 包含 `text/html`的会被服务端渲染
- response without `Content-Type` and in config `ssr.extensions` will get server side rendered | 包含配置了的后缀的url会被服务端渲染
- response without `Content-Type` and not in config `ssr.extensions` depends on MIME of `url` | 没配置的由`url`后缀MIME决定

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
    origin: "http://localhost:3001", // string, the source to proxy from | 源网站
    port: 3002, // port for this server | 此应用服务端口
    timeout: 10000, // in miliseconds, time to wait for puppeteer ssr | 等待puppeteer服务端渲染的时间（毫秒）
    ttl: 86400, //cache, inseconds| 缓存时间，秒
    extensions: [ // url path with these extensions will got ssr | 配置服务端渲染的扩展名
      "php",
      "jsp"
    ],
    // you may need to modify body and change the source path | 判断哪些请求需要额外修改body的
    bodyNeedModify: function (origin, req, res, proxyRes) {
      // for example all json ajax need to modify
      return Object.keys(proxyRes.headers).some(x => proxyRes.headers[x].includes('application/json'))
    },
    // how the body modified | body 如何修改
    bodyModifier: function (body, origin, req, res, proxyRes) {
      // search the origion and replace them with '/'
      return body.split(`${origin}/`).join('/')      
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
  puppeteer: {
    executablePath: "D:\\programs\\chrome-win\\chrome.exe",
    headless: false
  }
}
```

## try it out | 自己试一试


`vue-router` history mode is much easier, just use `ssr-proxy-puppeteer --origion=http://localhost:8080`, and then open `http://localhost:3000` | `vue-router` history模式可以直接使用 `ssr-proxy-puppeteer --origion=http://localhost:8080` 然后访问`http://localhost:3000`

based on view router hash mode | 基于哈希模式的vue router

```
git clone https://github.com/postor/ssr-proxy-puppeteer
cd ssr-proxy-puppeteer/example
npm i http-server -g
http-server

# another shell, dir ssr-proxy-puppeteer/example
npm i ssr-proxy-puppeteer -g --unsafe-perm=true
ssr-proxy-puppeteer --config=ssr-config.js

# open http://localhost:3000
```

- notice 1: example/ssr-config.js line 3, origin config with `/#`

```
ssr: {
    origin: "http://localhost:8080/#"
}
```

- notice 2: example/app.js line 24, hash mode in puppeteer and history in client browser

```
const router = new VueRouter({
  routes, // short for `routes: routes`
  mode: window.SSR_PROXY_PUPPETEER ? 'hash' : 'history'
})
```

## docker

```
docker pull postor/ssr-proxy-puppeteer
docker run -p 3003:3000 -it --rm postor/ssr-proxy-puppeteer:1.0.3 ssr-proxy-puppeteer --origin=http://192.168.1.10:8080
```
