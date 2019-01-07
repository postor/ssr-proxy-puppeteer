module.exports = {
  ssr: {
    origin: "http://localhost:8080/#",
    port: 3002,
    timeout: 10000,
    ttl: 86400,
    extensions: [
      "php",
      "jsp"
    ],
    bodyNeedModify: function (origin, req, res, proxyRes) {
      return Object.keys(proxyRes.headers).some(x => proxyRes.headers[x].includes('application/json'))
    },
    bodyModifier: function (body, origin, req, res, proxyRes) {
      return body.split(`${origin}/`).join('/')      
    },
  },
  cache: {
    store: "memory"
  },
  puppeteer: {
    executablePath: "D:\\programs\\chrome-win\\chrome.exe",
    headless: false
  }
}