'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');
var request = require('request');
var querystring = require('querystring');
var stringify = querystring.stringify;
var DEBUG = debug('AKS:FETCH');
var AKSHOOKS = SAX('AOTOO-KOA-SERVER');

function inherits(Super, protos, staticProtos) {
  var child;
  if (typeof protos === 'function') {
    child = protos;
    protos = null;
  } else if (protos && protos.hasOwnProperty('constructor')) {
    child = protos.constructor;
  } else {
    child = function child() {
      return Super.apply(this, arguments);
    };
  }
  _.merge(child, Super, staticProtos || {});
  child.__super__ = Super.prototype;
  child.prototype = Super.prototype;
  protos && _.merge(child.prototype, protos);
  return child;
}

var _request = function _request(opts) {
  var default_options = {
    headers: {},
    timeout: 10000
  };
  if (opts.apis) {
    this.apilist = opts.apis;
    delete opts.apis;
  }
  this.options = _.merge(default_options, opts);
  this.fetchRemote = false;
};
_request.prototype = {
  init: function init(ctx) {
    this.ctx = ctx || {};
  }
};

function setOpts(api, options, method) {
  var opts = {
    json: {}
    // if (options && _.isPlainObject(options)) opts = _.merge(opts, options)
  };opts = _.merge(opts, this.options, options);
  if (opts.json && opts.json.headers) {
    opts.headers = opts.json.headers;
    delete opts.json.headers;
    // opts.headers = _headers
  }
  if (opts.fttype) {
    delete opts.fttype;
  }
  this.api = api;
  this.requestOptions = AKSHOOKS.emit('apiFetchOptions', { api: api, options: opts }) || opts || {};
}

var __request = inherits(_request, {
  setOptions: function setOptions(params) {
    if (params.apis) {
      this.apilist = params.apis;
      delete params.apis;
    }
    this.options = _.merge(this.options, params);
  },

  _get: function _get(api, options, cb) {
    setOpts.call(this, api, options, 'get');
    var _opts = this.requestOptions;
    var _api = this.api;
    DEBUG('GET:API %s', api);
    DEBUG('GET:PARAM %O', _opts);
    if (_opts && _opts.json) {
      var _q = stringify(_opts.json);
      api = api + '?' + _q;
      delete _opts.json;
    }
    return new _promise2.default(function (res, rej) {
      request.get(api, _opts, function (err, rep, body) {
        if (err) {
          return rej("async search: no respons data");
        }
        if (rep.statusCode == 200) {
          DEBUG('GET:RESULT %O', body);
          return res(body);
        }
      });
    });
  },

  _post: function _post(api, options, cb) {
    setOpts.call(this, api, options, 'post');
    var _opts = this.requestOptions;
    var _api = this.api;
    _opts.headers['Content-type'] = 'application/json; charset=utf-8';
    DEBUG('POST:API %s', api);
    DEBUG('POST:PARAM %O', _opts);
    return new _promise2.default(function (res, rej) {
      request.post(_api, _opts, function (err, rep, body) {
        if (err) {
          return rej("async search: no respons data");
        }
        if (rep.statusCode == 200) {
          DEBUG('POST:RESULT %O', body);
          return res(body);
        }
      });
    });
  }
});

var pullapi = inherits(__request, require('./pullapi')());
var requ = inherits(pullapi, {});
// let pullapi = inherits(__request, require('./pullapi')())
// let mocks = inherits(pullapi, require('./mockapi')())
// let requ = inherits(mocks, {})

module.exports = function (opts) {
  return new requ(opts);
};
//# sourceMappingURL=../../../maps/fkpcore/modules/fetch/index.js.map
