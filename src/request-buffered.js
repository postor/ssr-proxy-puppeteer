const request = require('request')
const { IncomingMessage } = require('http')

module.exports = getResponse

/**
 * 
 * @param {IncomingMessage} req 
 */
function getResponse(req, uri) {
  return new Promise((resolve, reject) => {
    let headers = {
      ...req.headers
    }

    delete headers['if-none-match']
    delete headers['host']
    request({
      uri,
      method: req.method,
      headers,
      gzip: true,
    }, (err, res, body) => {
      if (err) {
        reject(err)
        return
      }
      resolve({ body, res })
    })
  })

}