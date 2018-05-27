'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _querystring = require('querystring');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEBUG = debug('AKS:FETCH:PULLAPI');

function getMyApi(api, apilist) {
  var apiAry = api.split(':');
  var len = apiAry.length;
  var select = apilist[_.trim(apiAry[0])];
  if (len > 1 && select) {
    var nAry = apiAry.splice(1);
    var nApi = nAry.join(':');
    var nCollect = select;
    return getMyApi(nApi, nCollect);
  } else {
    return select;
  }
}

module.exports = function () {
  return {
    _parseClientForm: function _parseClientForm(api) {
      var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'get';

      var url = undefined;
      this.fetchRemote = false;
      // if(objtypeof(param)!=='object') return [null, { message: 'pullApiData === 请指定正确的参数'}]
      if (!api) return [null, { message: 'pullApiData === 请指定正确的参数' }];
      if ((typeof param === 'undefined' ? 'undefined' : (0, _typeof3.default)(param)) !== 'object') param = {};

      /**
       前端通过api.requ('http://www.xxx.com/api')获取外部远程数据
       http://www.xxx.com/api部分会被存在parma._redirect的key值中
       api会自动转成 'redirect'
       ajax的方法(post/get)，通过param参数传入，key值名为ajaxtype，这个等同于jq的名字
      */
      if (api.indexOf('redirect') === 0) {
        url = param._redirect;
        delete param._redirect;
        if (param.ajaxtype) {
          method = param.ajaxtype;
          delete param.ajaxtype;
        }
        if (param && param.method) {
          method = param.method;
          delete param.method;
        }
        var len = (0, _keys2.default)(param);
        if (len.length === 0) param = {};
      } else if (api.indexOf('http') === 0) {
        this.fetchRemote = true;
        method = 'get';
        url = api;
      } else {
        // url = this.apilist.list[api]
        url = getMyApi(api, this.apilist.list);
        if (!url) return [null, null];
      }

      var query = undefined;
      method = method.toLowerCase();
      if (method === 'get') query = { json: param };
      if (method === 'post') query = { json: param };
      return [url, query];
    },

    getApi: function getApi(api) {
      return getMyApi(api, this.apilist.list);
    },

    setApi: function setApi(api_collect) {
      this.apilist.list = api_collect || {};
    },

    appendApi: function appendApi(api_collect) {
      this.apilist.list = _.merge({}, this.apilist.list, api_collect);
    },

    get: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(api, param) {
        var _parseClientForm2, _parseClientForm3, _api, _param, _data;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _parseClientForm2 = this._parseClientForm(api, param, 'get'), _parseClientForm3 = (0, _slicedToArray3.default)(_parseClientForm2, 2), _api = _parseClientForm3[0], _param = _parseClientForm3[1];

                if (!_api) {
                  _context.next = 11;
                  break;
                }

                if (_param && _param.json && _param.json.test && _param.json.test == '123') delete _param.json.test;
                if (_param && _param.json && _param.json._stat_) delete _param.json._stat_;
                _context.next = 7;
                return this._get(_api, _param);

              case 7:
                _data = _context.sent;
                return _context.abrupt('return', { data: _data });

              case 11:
                throw new Error((0, _stringify2.default)({
                  error: "60001",
                  message: "指定api不存在",
                  api: '/api/' + api,
                  param: param
                }));

              case 12:
                _context.next = 17;
                break;

              case 14:
                _context.prev = 14;
                _context.t0 = _context['catch'](0);
                throw new Error((0, _stringify2.default)({
                  error: "60002",
                  message: "后端返回数据错误",
                  info: _context.t0.message,
                  api: '/api/' + api,
                  param: param
                }));

              case 17:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 14]]);
      }));

      function get(_x3, _x4) {
        return _ref.apply(this, arguments);
      }

      return get;
    }(),

    post: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(api, param) {
        var _parseClientForm4, _parseClientForm5, _api, _param, _data;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _parseClientForm4 = this._parseClientForm(api, param, 'get'), _parseClientForm5 = (0, _slicedToArray3.default)(_parseClientForm4, 2), _api = _parseClientForm5[0], _param = _parseClientForm5[1];

                if (!_api) {
                  _context2.next = 10;
                  break;
                }

                if (_param && _param.form && _param.form.test && _param.form.test == '123') delete _param.form.test;
                _context2.next = 6;
                return this._post(_api, _param);

              case 6:
                _data = _context2.sent;
                return _context2.abrupt('return', { data: _data });

              case 10:
                throw new Error((0, _stringify2.default)({
                  error: "60001",
                  message: "指定api不存在",
                  api: '/api/' + api,
                  param: param
                }));

              case 11:
                _context2.next = 16;
                break;

              case 13:
                _context2.prev = 13;
                _context2.t0 = _context2['catch'](0);
                throw new Error((0, _stringify2.default)({
                  error: "60002",
                  message: "后端返回数据错误",
                  info: _context2.t0.message,
                  api: '/api/' + api,
                  param: param
                }));

              case 16:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 13]]);
      }));

      function post(_x5, _x6) {
        return _ref2.apply(this, arguments);
      }

      return post;
    }()
  };
};
//# sourceMappingURL=../../../maps/fkpcore/modules/fetch/pullapi.js.map
