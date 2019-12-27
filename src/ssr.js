module.exports = async (browser, url, config = {}) => {
  console.log({url})
  const { timeout = 5000, waitUntil = 'networkidle2' } = config
  const page = await browser.newPage()
  await page.evaluateOnNewDocument(function(){
    window.SSR_PROXY_PUPPETEER = true
  });
  try {
    await page.goto(url, { timeout, waitUntil });
  } catch (e) {
    console.log(`${url} not ready with config timeout=${timeout} waitUntil=${waitUntil}`)
    console.log(e)
  }
  const html = await page.content()
  page.close()
  return html
}