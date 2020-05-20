const fs = require('fs-extra')
const path = require('path')
const createIndexFileContent = require('./create-index-file-content')
const getFilesAndDirectories = require('./get-files-and-directories')

function createDotIndexFiles (rootPath, options={}) {
  const to = relPath => path.join(rootPath, relPath)
  const { files, directories } = getFilesAndDirectories(rootPath)
  if (files.includes('index.js')) {
    if (files.includes('.index.js')) fs.removeSync(to('.index.js'))
  } else {
    const existingContent = attemptRead(to('.index.js'))
    const newContent = createIndexFileContent([ ...files, ...directories ], rootPath, options)
    if (newContent !== existingContent) fs.writeFileSync(to('.index.js'), newContent)
  }
  directories.forEach(dir => createDotIndexFiles(to(dir), options))
}

function attemptRead (file) {
  try {
    return fs.readFileSync(file, 'utf8')
  } catch (e) {
    return ''
  }
}

module.exports = createDotIndexFiles