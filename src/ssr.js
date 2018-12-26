module.exports = async (browser, url, config = {}) => {
  const { timeout = 5000, waitUntil = 'networkidle2' } = config
  const page = await browser.newPage()
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