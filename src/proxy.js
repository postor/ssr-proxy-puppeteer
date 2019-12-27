
const httpProxy = require('http-proxy')
const { origin, ssrPrefix, bodyModifier, needBodyModify } = require('./config').ssr
const getBufferedResponse = require('./request-buffered')

const proxy = httpProxy.createProxyServer({
  target: origin,
})

proxy.on('proxyRes', async function (proxyRes, req, res) {
  res.writeHead(proxyRes.statusCode, newHeaders(proxyRes.headers))
  let data = []
  proxyRes.on('data', function (chunk) {
    data.push(chunk)
  })
  proxyRes.on('end', async function () {
    const buffer = Buffer.concat(data);
    let body = buffer.toString('utf-8')
    if (!body) {
      // response is buffer, bug of http-proxy, use requestjs instead
      body = await getBufferedResponse(req, origin + ssrPrefix + req.url)
    }

    if (needBodyModify(body, origin, req, res, proxyRes)) {
      console.log(`modify body ${req.url}`)
      body = bodyModifier(body, origin, req, res, proxyRes)
    }

    //console.log(body.substring(0, 10))
    res.write(body)
    res.end()
  })
})

module.exports = proxy

function newHeaders(headers) {
  const newHeader = { ...headers }
  delete newHeader['content-encoding']
  delete newHeader['content-length']
  return newHeader
}