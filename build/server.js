'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // global.Aotoo


var _init = function () {
  var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
    var _this = this;

    var server;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            app.keys = this.configs.keys;
            _context8.next = 3;
            return (0, _fkpcore2.default)(app, this.configs);

          case 3:
            server = _context8.sent;

            app.on('error', function () {
              var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(err, ctx) {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        logger.error('server error', err, ctx);

                      case 1:
                      case 'end':
                        return _context7.stop();
                    }
                  }
                }, _callee7, _this);
              }));

              return function (_x9, _x10) {
                return _ref8.apply(this, arguments);
              };
            }());

            return _context8.abrupt('return', server);

          case 6:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function _init() {
    return _ref7.apply(this, arguments);
  };
}();

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _aotooCommon = require('aotoo-common');

var _aotooCommon2 = _interopRequireDefault(_aotooCommon);

var _koaViews = require('koa-views');

var _koaViews2 = _interopRequireDefault(_koaViews);

var _koaStaticCache = require('koa-static-cache');

var _koaStaticCache2 = _interopRequireDefault(_koaStaticCache);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _fkpcore = require('./fkpcore');

var _fkpcore2 = _interopRequireDefault(_fkpcore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

global.debug = require('debug');

var app = new _koa2.default();

var aotooServer = function () {
  function aotooServer(opts) {
    _classCallCheck(this, aotooServer);

    this.middlewares = [];
    this.configs = {
      keys: opts.keys || ['agzgz gogogo'],
      index: opts.index || 'index',
      pages: opts.pages,
      apis: opts.apis || {},
      mapper: opts.mapper || {},
      pluginsFolder: opts.pluginsFolder
    };
    this.state = {
      views: false,
      bodyparser: false
    };
  }

  _createClass(aotooServer, [{
    key: 'use',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(midw) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                app.use(midw);

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function use(_x) {
        return _ref.apply(this, arguments);
      }

      return use;
    }()
  }, {
    key: 'plugins',
    value: function plugins(name, fn) {
      _fkpcore.fkp.plugins(name, fn);
    }
  }, {
    key: 'utile',
    value: function utile(name, fn) {
      _fkpcore.fkp.utileHand(name, fn);
    }
  }, {
    key: 'statics',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(dist, opts, files) {
        var dft;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                dft = {
                  dynamic: false,
                  buffer: false,
                  gzip: false
                };

                if (opts) {
                  dft = _.merge(dft, opts);
                }

                app.use((0, _koaStaticCache2.default)(dist, dft, files));

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function statics(_x2, _x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return statics;
    }()
  }, {
    key: 'apis',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) == 'object') {
                  this.configs.apis = obj;
                }

              case 1:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function apis() {
        return _ref3.apply(this, arguments);
      }

      return apis;
    }()
  }, {
    key: 'bodyparser',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) == 'object') {
                  this.state.bodyparser = true;
                  app.use((0, _koaBodyparser2.default)(obj));
                }

              case 1:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function bodyparser() {
        return _ref4.apply(this, arguments);
      }

      return bodyparser;
    }()
  }, {
    key: 'views',
    value: function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(dist, opts) {
        var dft;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                dft = {
                  map: {
                    html: opts && opts.html || 'ejs'
                  }
                };

                if (opts && opts.extension) {
                  dft.extension = opts.extension;
                }
                if (opts && opts.options) {
                  dft.options = opts.options;
                }
                this.state.views = true;
                app.use((0, _koaViews2.default)(dist, dft));

              case 5:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function views(_x7, _x8) {
        return _ref5.apply(this, arguments);
      }

      return views;
    }()
  }, {
    key: 'init',
    value: function () {
      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;

                if (this.state.views) {
                  _context6.next = 3;
                  break;
                }

                throw '必须指定模板引擎的views目录';

              case 3:
                if (!this.state.bodyparser) {
                  app.use((0, _koaBodyparser2.default)());
                }
                _context6.next = 6;
                return _init.call(this);

              case 6:
                return _context6.abrupt('return', _context6.sent);

              case 9:
                _context6.prev = 9;
                _context6.t0 = _context6['catch'](0);

                console.error(_context6.t0);

              case 12:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 9]]);
      }));

      function init() {
        return _ref6.apply(this, arguments);
      }

      return init;
    }()
  }]);

  return aotooServer;
}();

module.exports = function (opts) {
  try {
    if (!opts.pages) throw '必须指定 pages 目录选项, pages目录放置control层文件';
    return new aotooServer(opts);
  } catch (e) {
    console.error(e);
  }
};
//# sourceMappingURL=maps/server.js.map
