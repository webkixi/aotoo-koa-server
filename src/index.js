require('babel-core/register')
require("babel-polyfill")

var atServer = require('./server')
module.exports = function(opts){
  return atServer(opts)
}