'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _querystring = require('querystring');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = function () {
  return {
    _parseClientForm: function _parseClientForm(api) {
      var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'get';

      var url = undefined;
      this.fetchRemote = false;
      // if(objtypeof(param)!=='object') return [null, { message: 'pullApiData === 请指定正确的参数'}]
      if (!api) return [null, { message: 'pullApiData === 请指定正确的参数' }];
      if ((typeof param === 'undefined' ? 'undefined' : _typeof(param)) !== 'object') param = {};

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
        var len = Object.keys(param);
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
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(api, param) {
        var _parseClientForm2, _parseClientForm3, _api, _param, _data;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                debug('get:' + api);
                _parseClientForm2 = this._parseClientForm(api, param, 'get'), _parseClientForm3 = _slicedToArray(_parseClientForm2, 2), _api = _parseClientForm3[0], _param = _parseClientForm3[1];

                if (_api) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt('return', Errors['60001']);

              case 4:
                if (_param && _param.json && _param.json.test && _param.json.test == '123') delete _param.json.test;
                if (_param && _param.json && _param.json._stat_) delete _param.json._stat_;
                // if (CONFIG.apis.mock) {
                //   return await this.mock(api, _param)
                // } else {
                //   let _data = await this._get(_api, _param)
                //   return {data: _data}
                // }
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
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(api, param) {
        var _parseClientForm4, _parseClientForm5, _api, _param, _data;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                debug('post:' + api);
                _parseClientForm4 = this._parseClientForm(api, param, 'post'), _parseClientForm5 = _slicedToArray(_parseClientForm4, 2), _api = _parseClientForm5[0], _param = _parseClientForm5[1];

                if (_api) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt('return', Errors['60001']);

              case 4:
                if (_param && _param.form && _param.form.test && _param.form.test == '123') delete _param.form.test;
                // if (CONFIG.apis.mock) {
                //   return await this.mock(api, _param)
                // } else {
                //   let _data = await this._post(_api, _param)
                //   return {data: _data}
                // }
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
