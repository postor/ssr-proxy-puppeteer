module.exports = {
  ssr: {
    origin: "http://localhost:3001",
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
      const newBody = body.split(`${origin}/`).join('/')
      if(req.url==='/api'){
        console.log(body,body.split(`${origin}/`),newBody)
      }
      
      return newBody
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