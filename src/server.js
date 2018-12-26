#!/usr/bin/env node
const fs = require('fs-extra'),
  path = require('path'),
  argv = require('yargs').argv

const configPath = argv.config || path.join(__dirname, '..', 'config.js')
if (!path.isAbsolute(configPath)) {
  configPath = path.join(process.cwd(), configPath)
}
let config = fs.existsSync(configPath)
  ? require(configPath)
  : {}

const { ssr = {} } = config
const { origin = ssr.origin, timeout = ssr.timeout, waitUntil = ssr.waitUntil, port = ssr.port } = argv
config.ssr = {
  ...ssr,
  origin,
  timeout,
  waitUntil,
  port
}

if (!config.ssr.origin) {
  throw 'origin is needed eigther in command param or config file'
}

require('./main')(config)