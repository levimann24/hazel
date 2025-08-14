// Native
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')

// Packages
const { compile } = require('handlebars')

module.exports = async () => {
  const viewPath = path.normalize(path.join(__dirname, '/../views/index.hbs'))
  const viewContent = await promisify(fs.readFile)(viewPath, 'utf8')

  // Register helpers
  const handlebars = require('handlebars')
  handlebars.registerHelper('eq', function(a, b) {
    return a === b
  })

  return compile(viewContent)
}
