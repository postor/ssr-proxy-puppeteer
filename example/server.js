const { join } = require('path')
const express = require('express')
const app = express()
const port = 3001
app.use('/', express.static(join(__dirname, 'static')))
app.get('*', (req, res) => {
  console.log(req.url)
  res.setHeader('Content-Type', 'text/html')
  res.sendFile(join(__dirname, 'static', 'all.html'))
})

app.listen(port, (e) => e ? console.log(e) : console.log(`Example app listening on port ${port}!`))