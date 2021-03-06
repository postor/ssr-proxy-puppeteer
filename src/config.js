#!/usr/bin/env node
const fs = require('fs-extra'),
  path = require('path'),
  argv = require('yargs').argv,
  deepmerge = require('deepmerge'),
  defaultConfig = require('./default-config')

let configPath = argv.config
configPath && !path.isAbsolute(configPath) && (configPath = path.join(process.cwd(), configPath))

let config = !configPath
  ? {}
  : fs.existsSync(configPath)
    ? require(configPath)
    : {}

config = deepmerge(defaultConfig, config)

let { ssr = {} } = config
ssr = deepmerge(ssr, argv)
config = {
  ...config,
  ssr,
}

if (process.env.IN_DOCKER) {
  const { puppeteer = {} } = config
  const { args = [] } = puppeteer;
  ['--no-sandbox', '--disable-setuid-sandbox'].forEach(x => (!args.includes(x)) && args.push(x))
  puppeteer.args = args
  config.puppeteer = puppeteer
}


if (!config.ssr.origin) {
  throw 'origin is needed eigther in command param or config file'
}

module.exports = config