#!/usr/bin/env node

const http = require('http'),
  fs = require('fs-extra'),
  path = require('path'),
  httpProxy = require('http-proxy'),
  puppeteer = require('puppeteer'),
  argv = require('yargs').argv

const configPath = argv.config || path.join(__dirname, 'config.json')
let config = fs.existsSync(configPath)
  ? fs.readJSONSync(configPath)
  : {}

const cacheStore = require('./cache')(config.cache)

let ssrConfig = config.ssr || {}

if (!(argv.origin || ssrConfig.origin)) {
  throw 'origin is need eigther in command param or config file'
}
const target = (argv.origin || ssrConfig.origin)
const proxy = httpProxy.createProxyServer({
  target,
});

(async () => {
  const browser = await puppeteer.launch(config.puppeteer)

  proxy.on('proxyRes', async function (proxyRes, req, res) {
    const isHtml = Object.keys(proxyRes.headers).some(
      key => (key === 'force-ssr') || (key === 'content-type' && proxyRes.headers[key].includes('text/html'))
    )


    const newHeader = { ...proxyRes.headers }
    delete newHeader['content-encoding']
    res.writeHead(proxyRes.statusCode, newHeader)


    if (!isHtml || req.method !== 'GET') {
      res.writeHead(proxyRes.statusCode, proxyRes.headers)
      console.log(`pipe ${req.url}`)
      proxyRes.pipe(res)
      return
    }

    const cachedHtml = await cacheStore.get(req.url)
    if (cachedHtml) {
      console.log(`write cached ${req.url}`)
      res.write(cachedHtml)
      res.end()
      return
    }

    const ssr = require('./ssr')
    const urlConfig = {
      ...ssrConfig,
      ...((ssrConfig.urls && ssrConfig.urls[req.url]) ? ssrConfig.urls[req.url] : {}),
    }
    const html = await ssr(browser, target + req.url, urlConfig)

    console.log(`write ssr ${req.url}`)
    res.write(html)
    res.end()

    const { cache = true } = urlConfig
    if (!cache) {
      return
    }

    await cacheStore.set(req.url, html, {
      ttl: urlConfig.ttl || 86400
    })
  })
  const server = http.createServer(function (req, res) {
    proxy.web(req, res, {
      selfHandleResponse: true
    })
  })
  const port = argv.port || 3000
  server.listen(port, e => e ? console.log(e) : console.log(`listening on port ${port}`))
})()



