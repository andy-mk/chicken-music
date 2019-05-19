const path = require('path')

function resolve(dir){
  return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack(config) {
    config.resolve.alias.set('base', resolve('./src/base'))
    config.resolve.alias.set('api', resolve('./src/api'))
    config.resolve.alias.set('components', resolve('./src/components'))
  },
  publicPath:'http://114.115.202.140:3307'
}
