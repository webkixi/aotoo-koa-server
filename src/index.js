// require('babel-core/register')
// require("babel-polyfill")
global.debug = require('debug')

var atServer = require('./server')
module.exports = function(opts){
  return atServer(opts)
}