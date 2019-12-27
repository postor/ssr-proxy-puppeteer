
const httpProxy = require('http-proxy')
const { origin, ssrPrefix, bodyModifier, needBodyModify } = require('./config').ssr
const getBufferedResponse = require('./request-buffered')

const proxy = httpProxy.createProxyServer({
  target: origin,
})

proxy.on('proxyRes', async function (proxyRes, req, res) {
  let data = [], statusCode = proxyRes.statusCode, headers = newHeaders(proxyRes.headers)
  proxyRes.on('data', function (chunk) {
    data.push(chunk)
  })
  proxyRes.on('end', async function () {
    const buffer = Buffer.concat(data);
    let body = buffer.toString('utf-8')
    if (!body) {
      // response is buffer, bug of http-proxy, use requestjs instead
      let result = await getBufferedResponse(req, origin + req.url)
      body = result.body
      statusCode = result.res.statusCode
      headers = newHeaders(result.res.headers)
    }

    if (needBodyModify(body, origin, req, res, proxyRes)) {
      console.log(`modify body ${req.url}`)
      body = bodyModifier(body, origin, req, res, proxyRes)
    }

    //console.log(body.substring(0, 10))
    res.writeHead(statusCode, headers)
    res.write(body)
    res.end()
  })
})

module.exports = proxy

function newHeaders(headers) {
  const newHeader = {
    ...headers
  }
  delete newHeader['content-encoding']
  delete newHeader['accept-ranges']
  delete newHeader['transfer-encoding']
  delete newHeader['content-length']
  return newHeader
}