'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _init = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
    var _this = this;

    var server;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            app.keys = this.configs.keys;
            _context8.next = 3;
            return _fkpcore2.default.call(this, app, this.configs);

          case 3:
            server = _context8.sent;

            app.on('error', function () {
              var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(err, ctx) {
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        console.error('server error', err, ctx);

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

var _koaArtTemplate = require('koa-art-template');

var _koaArtTemplate2 = _interopRequireDefault(_koaArtTemplate);

var _koaStaticCache = require('koa-static-cache');

var _koaStaticCache2 = _interopRequireDefault(_koaStaticCache);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _fkpcore = require('./fkpcore');

var _fkpcore2 = _interopRequireDefault(_fkpcore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// global.Aotoo
global.debug = require('debug');

var app = new _koa2.default();

var aotooServer = function () {
  function aotooServer(opts) {
    (0, _classCallCheck3.default)(this, aotooServer);

    this.middlewares = [];
    this.configs = {
      keys: opts.keys || ['aotoo koa'], // cookie session关键字
      index: opts.index || 'index', // 默认首页

      apis: opts.apis || { list: {} }, // api接口集合
      mapper: opts.mapper || { js: {}, css: {} }, // 静态资源映射文件

      root: opts.root, // 渲染默认目录
      pages: opts.pages, // control层文件夹，必须
      pluginsFolder: opts.pluginsFolder // 插件文件夹
    };

    this.state = {
      views: false,
      bodyparser: false
    };
  }

  // 注册KOA2的中间间，与KOA2语法保持一致


  (0, _createClass3.default)(aotooServer, [{
    key: 'use',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(midw) {
        return _regenerator2.default.wrap(function _callee$(_context) {
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

    // 注册一个Aotoo插件方法

  }, {
    key: 'plugins',
    value: function plugins(name, fn) {
      _fkpcore.fkp.plugins(name, fn);
    }

    // 注册一个Aotoo助手方法

  }, {
    key: 'utile',
    value: function utile(name, fn) {
      _fkpcore.fkp.utileHand(name, fn);
    }
  }, {
    key: 'callback',
    value: function callback() {
      return app.callback(arguments);
    }

    // 指定站点静态路径，如 /images, /uploader, /user

  }, {
    key: 'statics',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(dist, opts, files) {
        var dft;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
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

    // 注册api接口集，用于做接口层的数据访问

  }, {
    key: 'apis',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if ((typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) == 'object') {
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

    // 注册POST中间件，可以通过 ctx.bodys来访问post数据

  }, {
    key: 'bodyparser',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if ((typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) == 'object') {
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

    // 注册渲染方法

  }, {
    key: 'views',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(dist, opts) {
        var dft;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                // import views from 'koa-views'   // 放到顶部
                // let dft = {
                //   map: {
                //     html: (opts&&opts.html||'ejs')
                //   }
                // }
                // if (opts&&opts.extension) {
                //   dft.extension = opts.extension
                // }
                // if (opts&&opts.options) {
                //   dft.options = opts.options
                // }
                // this.state.views = true
                // app.use( views(dist, dft) )

                dft = {
                  root: dist,
                  extname: '.html',
                  debug: process.env.NODE_ENV !== 'production'
                };

                dft = _.merge({}, dft, opts);
                this.state.views = true;
                (0, _koaArtTemplate2.default)(app, dft);

              case 4:
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

    // 初始化

  }, {
    key: 'init',
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;

                if (this.configs.pages) {
                  _context6.next = 3;
                  break;
                }

                throw '必须指定control目录';

              case 3:
                if (this.state.views) {
                  _context6.next = 9;
                  break;
                }

                if (this.configs.root) {
                  _context6.next = 8;
                  break;
                }

                throw '必须指定模板引擎的views目录';

              case 8:
                this.views(this.configs.root);

              case 9:
                if (!this.state.bodyparser) {
                  app.use((0, _koaBodyparser2.default)());
                }
                _context6.next = 12;
                return _init.call(this);

              case 12:
                return _context6.abrupt('return', _context6.sent);

              case 15:
                _context6.prev = 15;
                _context6.t0 = _context6['catch'](0);

                console.error(_context6.t0);

              case 18:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 15]]);
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
