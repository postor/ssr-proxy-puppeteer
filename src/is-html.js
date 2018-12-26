const { basename } = require('path')
const { lookup } = require('mime-types')

function isHtml(urlString, renderExtensions = []) {
  const filename = basename(urlString.split('?')[0])

  if (renderExtensions.some(x => filename.endsWith(`.${x}`))) {
    return true
  }

  const type = lookup(filename)
  return (!type || type === 'text/html')
}

module.exports = isHtml