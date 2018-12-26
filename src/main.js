const http = require('http'),
  httpProxy = require('http-proxy'),
  puppeteer = require('puppeteer'),
  argv = require('yargs').argv,
  calcUrlConfig = require('./url-config'),
  isHtml = require('./is-html')

module.exports = async (config) => {
  let ssrConfig = config.ssr || {}
  const target = ssrConfig.origin
  const cacheStore = require('./cache')(config.cache)
  const proxy = httpProxy.createProxyServer({
    target,
  })

  const browser = await puppeteer.launch(config.puppeteer)

  proxy.on('proxyRes', async function (proxyRes, req, res) {
    const newHeader = { ...proxyRes.headers }
    delete newHeader['content-encoding']
    res.writeHead(proxyRes.statusCode, newHeader)

    const bodyModifier = ssrConfig.bodyModifier || function (body, origin) {
      return body.split(`${origin}/`).join('/')
    }

    if (!isHtml(req.url, ssrConfig.extensions) || req.method !== 'GET') {
      res.writeHead(proxyRes.statusCode, proxyRes.headers)
      console.log(`pipe ${req.url}`)
      let body = new Buffer('')
      proxyRes.on('data', function (data) {
        body = Buffer.concat([body, data])
      })
      proxyRes.on('end', function () {
        body = body.toString()
        res.end(bodyModifier(body, ssrConfig.origin, req, res, proxyRes))
      })
      return
    }

    const cachedHtml = await cacheStore.get(req.url)
    if (cachedHtml) {
      console.log(`write cached ${req.url}`)
      res.end(bodyModifier(cachedHtml, ssrConfig.origin, req, res, proxyRes))
      return
    }

    const ssr = require('./ssr')
    const urlConfig = calcUrlConfig(ssrConfig, req.url)
    console.log({ url: target + req.url })
    const html = await ssr(browser, target + req.url, urlConfig)

    console.log(`write ssr ${req.url}`)
    res.write(bodyModifier(html, ssrConfig.origin, req, res, proxyRes))
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
  const port = argv.port || ssrConfig.port || 3000
  server.listen(port, e => e ? console.log(e) : console.log(`listening on port ${port}`))
}



