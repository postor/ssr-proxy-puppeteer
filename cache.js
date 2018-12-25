var cacheManager = require('cache-manager'),
  path = require('path'),
  fs = require('fs')

module.exports = (config = {
  store: 'memory'
}) => {
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


