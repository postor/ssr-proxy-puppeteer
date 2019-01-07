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

  const bodyModifier = ssrConfig.bodyModifier || function (body, origin) {
    return body.split(`${origin}/`).join('/')
  }
  const bodyNeedModify = ssrConfig.bodyNeedModify || function (origin, req, res, proxyRes) {
    return Object.keys(proxyRes.headers).some(x => proxyRes.headers[x].includes('application/json'))
  }

  /**
   * need ssr
   * @param {*} headers 
   * @returns {number} -1=no 0=not sure 1=need
   */
  const needSSR = (headers) => {
    if (headers['content-type']) {
      if (headers['content-type'].includes('text/html')) {
        return 1
      }
      return -1
    }
    return 0
  }

  const newHeaders = (headers) => {
    const newHeader = { ...headers }
    delete newHeader['content-encoding']
    delete newHeader['content-length']
    return newHeader
  }

  proxy.on('proxyRes', async function (proxyRes, req, res) {
    const needssrResult = needSSR(proxyRes.headers)
    //console.log({needssrResult})
    if (
      req.method !== 'GET'
      || needssrResult === -1
      || (needssrResult === 0 && !isHtml(req.url, ssrConfig.extensions))
    ) {
      if (bodyNeedModify(ssrConfig.origin, req, res, proxyRes)) {
        console.log(`modify body ${req.url}`)
        res.writeHead(proxyRes.statusCode, newHeaders(proxyRes.headers))
        let body = new Buffer('')
        proxyRes.on('data', function (data) {
          body = Buffer.concat([body, data])
        })
        proxyRes.on('end', function () {
          body = body.toString()
          body = bodyModifier(body, ssrConfig.origin, req, res, proxyRes)
          //console.log(body.substring(0, 10))
          res.write(body)
          res.end()
        })
        return
      }

      console.log(`pipe ${req.url}`)
      res.writeHead(proxyRes.statusCode, proxyRes.headers)
      proxyRes.pipe(res)
      return
    }
    res.writeHead(200, newHeaders(proxyRes.headers))
    const cachedHtml = await cacheStore.get(req.url)
    if (cachedHtml) {
      console.log(`write cached ${req.url}`)
      res.write(bodyModifier(cachedHtml, ssrConfig.origin, req, res, proxyRes))
      res.end()
      return
    }

    const ssr = require('./ssr')
    const urlConfig = calcUrlConfig(ssrConfig, req.url)
    //console.log({ url: target + req.url })
    let html = await ssr(browser, target + req.url, urlConfig)

    console.log(`write ssr ${req.url}`)
    html = bodyModifier(html, ssrConfig.origin, req, res, proxyRes)
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
  })
  const server = http.createServer(function (req, res) {
    proxy.web(req, res, {
      selfHandleResponse: true
    })
  })
  const port = argv.port || ssrConfig.port || 3000
  server.listen(port, e => e ? console.log(e) : console.log(`listening on port ${port}`))
}



