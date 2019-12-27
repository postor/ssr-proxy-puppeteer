#!/usr/bin/env node

const http = require('http'),
  puppeteer = require('puppeteer'),
  argv = require('yargs').argv,
  calcUrlConfig = require('./url-config'),
  cacheStore = require('./cache'),
  proxy = require('./proxy'),
  ssr = require('./ssr'),
  config = require('./config')


const ssrConfig = config.ssr
  ;
(async () => {
  const browser = await puppeteer.launch(config.puppeteer)
  const server = http.createServer(async function (req, res) {
    if (req.headers['connection'] === 'Upgrade') {
      console.log('reject upgrade')
      res.end()
      res.destroy()
      return
    }
    const useSSR = ssrConfig.useSsr(req)
    console.log({ useSSR, connection: req.headers['connection'], url: req.url })
    if (useSSR) {
      await ssrRequest(req, res, browser)
      return
    }
    proxy.web(req, res, {
      selfHandleResponse: true
    })
  })

  server.on("upgrade", function (req, socket) {
    socket.destroy()
  })

  const port = argv.port || ssrConfig.port || 3000
  server.listen(port, e => e ? console.log(e) : console.log(`listening on port ${port}`))
})()

async function ssrRequest(req, res, browser) {
  // res.writeHead(200, newHeaders(proxyRes.headers))
  const { origin, bodyModifier, ssrPrefix, needBodyModify } = ssrConfig
  let cachedHtml = await cacheStore.get(req.url)
  if (cachedHtml) {
    console.log(`write cached ${req.url}`)
    if (needBodyModify(cachedHtml, origin, req, res)) {
      cachedHtml = bodyModifier(cachedHtml, origin, req, res)
    }
    res.write(cachedHtml)
    res.end()
    return
  }
  const urlConfig = calcUrlConfig(ssrConfig, req.url)
  //console.log({ url: target + req.url })
  let html = await ssr(browser, origin + ssrPrefix + req.url, urlConfig)

  console.log(`write ssr ${req.url}`)
  html = bodyModifier(html, origin, req, res)
  //console.log({ html }, proxyRes.headers)
  res.write(html)
  res.end()

  const { cache = true } = urlConfig
  if (!cache) {
    return
  }

  await cacheStore.set(req.url, html, {
    ttl: urlConfig.ttl || 86400
  })
}