# ssr-proxy-puppeteer

Make SEO easy for legacy SPA

## usage

response with `Content-Type` contain `text/html` will get rendered, others just proxied

install

```
npm i ssr-proxy-puppeteer
# when it fails try this, refer https://github.com/GoogleChrome/puppeteer/issues/375
npm i ssr-proxy-puppeteer -g --unsafe-perm=true
```

use

```
ssr-proxy-puppeteer --origion=http://localhost:3001
# or more detailed config
ssr-proxy-puppeteer --config=config.js
```

## config

simple config

```
  "ssr": {
    "origin": "http://jilupian.youku.com"
  }
```

more detail config version

```
module.exports = {
  // config for ssr
  ssr: {
    origin: "http://localhost:3001", // string, the source to proxy from
    port: 3002, // port for proxy server
    timeout: 10000, // in miliseconds, time to wait for puppeteer ssr
    ttl: 86400, //cache
    extensions: [ // url path with these extensions will got ssr
      "php",
      "jsp"
    ],
    // you may need to modify body and change the source path
    bodyNeedModify: function (origin, req, res, proxyRes) {
      // for example all json ajax need to modify
      return Object.keys(proxyRes.headers).some(x => proxyRes.headers[x].includes('application/json'))
    },
    // how are the modified
    bodyModifier: function (body, origin, req, res, proxyRes) {
      // search the origion and replace them with '/'
      return body.split(`${origin}/`).join('/')      
    },
  },
  // config for cache refer https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagegotourl-options
  cache: {
    //`cache-manager-redis` and `cache-manager-memcached-store` already installed 
    // and can be used as `store` option, by default `store` uses `memory`
    store: "cache-manager-redis",

    // other options for your store type
    // refer https://github.com/dial-once/node-cache-manager-redis or https://github.com/theogravity/node-cache-manager-memcached-store
    db: 2
  },
  // launch config for puppeteer
  // refer https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
  puppeteer: {
    executablePath: "D:\\programs\\chrome-win\\chrome.exe",
    headless: false
  }
}
```

## try it out

```
git clone https://github.com/postor/ssr-proxy-puppeteer
cd ssr-proxy-puppeteer/example
npm i
npm run vue

# another shell
npm i ssr-proxy-puppeteer -g --unsafe-perm=true
ssr-proxy-puppeteer --origion=http://localhost:3001

# open http://localhost:3000
```