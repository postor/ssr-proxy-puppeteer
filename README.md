# ssr-proxy-puppeteer

Make SEO easy for all SPA, enable ssr for all SPA

## usage

response with `Content-Type` contain `text/html` will get rendered, others just proxied

```
npm i ssr-proxy-puppeteer -g

ssr-proxy-puppeteer --origin=https://www.baidu.com/

// or with config file

ssr-proxy-puppeteer --config=conf.json
```

## config

```
{
  "origin":"https://www.baidu.com/", 
  "timeout":2000,
  "cache":864000,
  "urls":[
    {
      "url":"/some/no/need",
      "enabled": false
    },
    {
      "url":"/some/slow/page",
      "timeout": 5000
    },
    {
      "regex":"^/api/\\d+",
      "cache":0
    }
  ]
}
```

 - `origin` the source to proxy from
 - `timeout` it may cost a lot of time to do ssr, don't make client wait too long
 - `urls` urls that match will apply 
