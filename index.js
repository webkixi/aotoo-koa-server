require('babel-core/register')
require("babel-polyfill")
var aServer = require('./server')

module.exports = function(opts){
  return atServer(opts)
}