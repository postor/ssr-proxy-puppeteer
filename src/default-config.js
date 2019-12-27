
const { parse } = require('url')
const { lookup } = require('mime-types')

module.exports = {
  ssr: {
    port: 3000,
    timeout: 10000,
    ttl: 86400,
    ssrPrefix: '/#',
    useSsr: (req) => {
      if (req.method !== 'GET') return false
      if (req.xhr) return false
      const { pathname } = parse(req.url)
      const mime = lookup(pathname)
      if (mime) {
        if (mime === 'text/html') return true
        return false
      }
      if (!req.headers['content-type']) return true
      if (req.headers['content-type'].includes('text/html')) return true
      return false
    },
    needBodyModify: function (body, origin, req, res, proxyRes) {
      if (!proxyRes) return false
      let contentType = proxyRes.headers['content-type']
      if (!contentType) {
        const { pathname } = parse(req.url)
        contentType = lookup(pathname)
      }
      return [
        'text/html',
        'application/json',
        'javascript',
      ].some(x => contentType.includes(x))
    },
    bodyModifier: function (body, origin, req, res, proxyRes) {
      // console.log('before:'+body)
      const result = body.split(`${origin}/#/`).join('/').replace(/useHash\s*:\s*true/g, 'useHash: false')
      // console.log('after:'+result)
      return result
    },
  },
  cache: {
    store: "memory"
  },
  puppeteer: {}
}