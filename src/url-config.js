module.exports = (config, reqUrl) => {
  const { urls, origion, ...rest } = config
  if (!urls || !urls.length) {
    return rest
  }

  for (let i = 0; i < urls.length; i++) {
    const { url, regex, ...restUrlConfig } = urls[i]
    if (url) {
      if (url === reqUrl) {
        return {
          ...rest,
          ...restUrlConfig,
        }
      }
      continue
    }
    if (regex) {
      if (new RegExp(regex).test(reqUrl)) {
        return {
          ...rest,
          ...restUrlConfig,
        }
      }
      continue
    }
  }
  return rest
}