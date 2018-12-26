module.exports = {
  "ssr": {
    "origin": "http://localhost:3001",
    "port": 3002,
    "timeout": 10000,
    "ttl": 86400,
    "extensions": [
      "php",
      "jsp"
    ],
    "bodyModifier": function (body, origin, req, res, proxyRes) {
      return body.split(`${origin}/`).join('/')
    }
  },
  "cache": {
    "store": "memory"
  },
  "puppeteer": {
    "executablePath": "D:\\programs\\chrome-win\\chrome.exe",
    "headless": false
  }
}