const fs = require('fs-extra')

function getFilesAndDirectories (rootPath) {
  const allFiles = fs.readdirSync(rootPath)
  return {
    files: allFiles.filter(file => file.includes('.js')),
    directories: allFiles.filter(file => !file.includes('.')),
  }
}

module.exports = getFilesAndDirectories