const request = require('request')
const { IncomingMessage } = require('http')

module.exports = getResponse

/**
 * 
 * @param {IncomingMessage} req 
 */
function getResponse(req, uri) {
  return new Promise((resolve, reject) => {
    request({
      uri,
      method: req.method,
      headers: req.headers,
    }, (err, res, body) => {
      if (err) {
        reject(err)
        return
      }
      resolve(body)
    })
  })

}