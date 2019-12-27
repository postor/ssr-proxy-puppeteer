const cacheManager = require('cache-manager'),
  config = require('./config').cache


module.exports = getInstance()


function getInstance() {
  const {
    store,
    ...rest
  } = config
  if (store === 'memory') {
    return cacheManager.caching(config)
  }

  const storeModule = require(store)
  const instance = cacheManager.caching({
    store: storeModule,
    ...rest
  })
  return instance
}