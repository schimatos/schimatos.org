#!/usr/bin/env node

const createDotIndexFiles = require('./utils/create-dot-index-files')

function main ([ rootPath, options ]=process.argv.slice(2)) {
  if (!rootPath) throw new Error('Must provide "path" argument')
  return createDotIndexFiles(rootPath, options)
}

module.exports = main

if (!module.parent) main()
