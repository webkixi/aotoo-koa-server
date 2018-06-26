const path = require('path')
const request = require('request')
const querystring = require('querystring')
const stringify = querystring.stringify
const DEBUG = debug('AKS:FETCH')
const AKSHOOKS = SAX('AOTOO-KOA-SERVER')

function inherits( Super, protos, staticProtos ) {
  var child;
  if ( typeof protos === 'function' ) {
    child = protos;
    protos = null;
  } else if ( protos && protos.hasOwnProperty('constructor') ) {
    child = protos.constructor;
  } else {
    child = function() {
      return Super.apply( this, arguments );
    }
  }
  _.merge( child, Super, staticProtos || {} )
  child.__super__ = Super.prototype
  child.prototype = Super.prototype
  protos && _.merge( child.prototype, protos )
  return child;
}

let _request = function(opts){
  var default_options = {
    headers: { },
    timeout: 10000
  }
  if (opts.apis) {
    this.apilist = opts.apis
    delete opts.apis
  }
  this.options = _.merge(default_options, opts)
  this.fetchRemote = false
}
_request.prototype = {
  init: function(ctx){
    this.ctx = ctx || {}
  }
}

function setOpts(api, options, method) {
  let opts = {
    json: {},
  }
  // if (options && _.isPlainObject(options)) opts = _.merge(opts, options)
  opts = _.merge(opts, this.options, options)
  if (opts.json && opts.json.headers) {
    opts.headers = opts.json.headers
    delete opts.json.headers
    // opts.headers = _headers
  }
  if (opts.fttype) {
    delete opts.fttype;
  }
  this.api = api
  this.requestOptions = AKSHOOKS.emit('apiFetchOptions', { api, options: opts }) || opts || {}
}

let __request = inherits(_request, {
  setOptions: function(params) {
    if (params.apis) {
      this.apilist = params.apis
      delete params.apis
    }
    this.options = _.merge(this.options, params)
  },

  _get: function(api, options, cb){
    setOpts.call(this, api, options, 'get')
    let _opts = this.requestOptions
    let _api = this.api
    DEBUG('GET:API %s', api)
    DEBUG('GET:PARAM %O', _opts)
    if (_opts && _opts.json){
      let _q = stringify(_opts.json)
      api = api + '?' + _q;
      delete _opts.json
    }
    return new Promise( function(res, rej) {
      request.get(api, _opts, function(err, rep, body) {
        if(err) { return rej("async search: no respons data")}
        if (rep.statusCode == 200){
          DEBUG('GET:RESULT %O', body)
          return res(body)
        }
      })
    })
  },

  _post: function(api, options, cb){
    setOpts.call(this, api, options, 'post')
    let _opts = this.requestOptions
    let _api = this.api
    _opts.headers['Content-type'] = 'application/json; charset=utf-8'
    DEBUG('POST:API %s', api)
    DEBUG('POST:PARAM %O', _opts)
    return new Promise( function(res, rej) {
      request.post(_api, _opts, function(err, rep, body) {
        if(err) {return rej("async search: no respons data")}
        if (rep.statusCode == 200){
          DEBUG('POST:RESULT %O', body)
          return res(body)
        }
      })
    })
  }
})

let pullapi = inherits(__request, require('./pullapi')())
let requ = inherits(pullapi, {})
// let pullapi = inherits(__request, require('./pullapi')())
// let mocks = inherits(pullapi, require('./mockapi')())
// let requ = inherits(mocks, {})

module.exports = function(opts){
  return new requ(opts)
}
