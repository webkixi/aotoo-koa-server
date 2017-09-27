'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

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
        url = this.apilist.list[api];
        if (!url) return [null, null];
      }

      var query = undefined;
      method = method.toLowerCase();
      if (method === 'get') query = { json: param };
      if (method === 'post') query = { json: param };
      return [url, query];
    },

    get: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(api, param) {
        var _parseClientForm2, _parseClientForm3, _api, _param, _data;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                debug('get:' + api);
                _parseClientForm2 = this._parseClientForm(api, param, 'get'), _parseClientForm3 = (0, _slicedToArray3.default)(_parseClientForm2, 2), _api = _parseClientForm3[0], _param = _parseClientForm3[1];

                if (_api) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt('return', { error: "60001", message: "指定api不存在" });

              case 4:
                if (_param && _param.json && _param.json.test && _param.json.test == '123') delete _param.json.test;
                if (_param && _param.json && _param.json._stat_) delete _param.json._stat_;
                _context.next = 8;
                return this._get(_api, _param);

              case 8:
                _data = _context.sent;
                return _context.abrupt('return', { data: _data });

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
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
                debug('post:' + api);
                _parseClientForm4 = this._parseClientForm(api, param, 'post'), _parseClientForm5 = (0, _slicedToArray3.default)(_parseClientForm4, 2), _api = _parseClientForm5[0], _param = _parseClientForm5[1];

                if (_api) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt('return', { error: "60001", message: "指定api不存在" });

              case 4:
                if (_param && _param.form && _param.form.test && _param.form.test == '123') delete _param.form.test;
                _context2.next = 7;
                return this._post(_api, _param);

              case 7:
                _data = _context2.sent;
                return _context2.abrupt('return', { data: _data });

              case 9:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function post(_x5, _x6) {
        return _ref2.apply(this, arguments);
      }

      return post;
    }()
  };
};
//# sourceMappingURL=../../../maps/fkpcore/modules/fetch/pullapi.js.map
