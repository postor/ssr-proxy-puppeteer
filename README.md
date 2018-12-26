# ssr-proxy-puppeteer

Make SEO easy for legacy SPA

## usage

response with `Content-Type` contain `text/html` will get rendered, others just proxied

```
npm i ssr-proxy-puppeteer -g

ssr-proxy-puppeteer
```

## cli

```
npm i
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
{
  "ssr": {
    "origin": "http://jilupian.youku.com",
    "timeout": 10000,
    "ttl": 86400,
    "waitUntil": "networkidle2",
    "urls": [
      {
        "url": "/some/path1",
        "timeout": 20000
      },
      {
        "regex": "^/uptodate/\\d+",
        "cache": false
      }
    ]
  },
  "cache": {
    "store": "cache-manager-redis",
    "db": 0
  },
  "puppeteer": {
    "executablePath": "D:\\programs\\chrome-win\\chrome.exe",
    "headless": true
  }
}
```

config for ssr

 - `origin` string, the source to proxy from
 - `timeout` number, in miliseconds, time to wait for puppeteer
 - `waitUntil` string, wait for puppeteer to navigate, refer https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagegotourl-options
 - `cache` boolean, use cache or not
 - `ttl` number, in seconds, only used when cache, time to live
 - `urls` array, to custom config for different urls, `url` to match certain url, `regex` to match regular expression, `timeout`, `waitUntil`, `cache`, `ttl` can be different for each url

config for puppeteer 
 
 - the launch option for puppeteer, refer https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions

config for cache

 - use `node-cache-manager` for cache refer https://github.com/BryanDonovan/node-cache-manager
 - `cache-manager-redis` and `cache-manager-memcached-store` already installed and can be used as `store` option, by default `store` uses `memory`, other options refer https://github.com/dial-once/node-cache-manager-redis and https://github.com/theogravity/node-cache-manager-memcached-store

## try it out

```
git clone https://github.com/postor/ssr-proxy-puppeteer
cd ssr-proxy-puppeteer/example
npm i
npm run vue

# another shell
npm run proxy

# open http://localhost:3000
```