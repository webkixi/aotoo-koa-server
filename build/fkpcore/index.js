'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var registerRouterPrefixes = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(app) {
    var _this = this;

    var AotooConfigs;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            AotooConfigs = AotooServerHooks.get().context.configs;

            if ((0, _keys2.default)(AotooConfigs.routerOptions.prefixes).length) {
              _.map(AotooConfigs.routerOptions.prefixes, function () {
                var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(params, prefix) {
                  var myOptions;
                  return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          myOptions = _.merge({}, AotooConfigs.routerOptions.parameters, params);
                          _context.next = 3;
                          return router(app, prefix, myOptions);

                        case 3:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                return function (_x2, _x3) {
                  return _ref2.apply(this, arguments);
                };
              }());
            }

          case 2:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function registerRouterPrefixes(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _routepreset = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(app) {
    var _this2 = this;

    var presets, preset_keys, short_prefix, multi_part_prefix, single_part_prefix, sort_prefixs;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return registerRouterPrefixes(app);

          case 2:
            presets = innerData.route.presets;
            preset_keys = (0, _keys2.default)(presets);
            short_prefix = [];
            multi_part_prefix = preset_keys.filter(function (item) {
              return item.split('/').length > 2;
            });
            single_part_prefix = preset_keys.filter(function (item) {
              return item.split('/').length <= 2;
            });
            sort_prefixs = [].concat((0, _toConsumableArray3.default)(multi_part_prefix), (0, _toConsumableArray3.default)(single_part_prefix));


            sort_prefixs.forEach(function () {
              var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(prefix) {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return router(app, prefix, presets[prefix]);

                      case 2:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, _this2);
              }));

              return function (_x5) {
                return _ref4.apply(this, arguments);
              };
            }());

          case 9:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function _routepreset(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

// 静态, fkp()返回实例


var registerUtile = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(app) {
    var fkp, baseRoot, _utilesFiles, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, utileFile, utileFun;

    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            // register utile
            fkp = app.fkp;
            baseRoot = './base';
            _context5.next = 4;
            return fs.readdirAsync(_path2.default.resolve(__dirname, baseRoot));

          case 4:
            _utilesFiles = _context5.sent;

            if (!(_utilesFiles && _utilesFiles.length)) {
              _context5.next = 25;
              break;
            }

            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context5.prev = 9;

            for (_iterator2 = (0, _getIterator3.default)(_utilesFiles); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              utileFile = _step2.value;

              if (valideFile(utileFile)) {
                utileFun = require('./base/' + utileFile).default();

                fkp.utileHand(_path2.default.parse(utileFile).name, utileFun);
              }
            }
            _context5.next = 17;
            break;

          case 13:
            _context5.prev = 13;
            _context5.t0 = _context5['catch'](9);
            _didIteratorError2 = true;
            _iteratorError2 = _context5.t0;

          case 17:
            _context5.prev = 17;
            _context5.prev = 18;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 20:
            _context5.prev = 20;

            if (!_didIteratorError2) {
              _context5.next = 23;
              break;
            }

            throw _iteratorError2;

          case 23:
            return _context5.finish(20);

          case 24:
            return _context5.finish(17);

          case 25:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[9, 13, 17, 25], [18,, 20, 24]]);
  }));

  return function registerUtile(_x6) {
    return _ref5.apply(this, arguments);
  };
}();

var registerPlugins = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(pluginRoot, app) {
    var fkp, pluginStat, _pluginFiles, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, pluginFile, plugin;

    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            fkp = app.fkp;
            pluginStat = fs.statSync(pluginRoot);

            if (!pluginStat.isDirectory()) {
              _context6.next = 26;
              break;
            }

            _context6.next = 5;
            return fs.readdirAsync(pluginRoot);

          case 5:
            _pluginFiles = _context6.sent;

            if (!(_pluginFiles && _pluginFiles.length)) {
              _context6.next = 26;
              break;
            }

            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context6.prev = 10;

            for (_iterator3 = (0, _getIterator3.default)(_pluginFiles); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              pluginFile = _step3.value;

              if (valideFile(pluginFile)) {
                plugin = require(_path2.default.join(pluginRoot, pluginFile)).default(fkp);

                fkp.plugins(_path2.default.parse(pluginFile).name, plugin);
              }
            }
            _context6.next = 18;
            break;

          case 14:
            _context6.prev = 14;
            _context6.t0 = _context6['catch'](10);
            _didIteratorError3 = true;
            _iteratorError3 = _context6.t0;

          case 18:
            _context6.prev = 18;
            _context6.prev = 19;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 21:
            _context6.prev = 21;

            if (!_didIteratorError3) {
              _context6.next = 24;
              break;
            }

            throw _iteratorError3;

          case 24:
            return _context6.finish(21);

          case 25:
            return _context6.finish(18);

          case 26:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[10, 14, 18, 26], [19,, 21, 25]]);
  }));

  return function registerPlugins(_x7, _x8) {
    return _ref6.apply(this, arguments);
  };
}();

exports.fkp = fkp;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var socketio = require('./modules/wsocket');global.Sio = socketio.sio;
// let cache = require('./modules/cache');      global.Cache = cache
// let _fetch = require('./modules/fetch');
var router = require('./router');
var Promise = require('bluebird');
fs = Promise.promisifyAll(fs);

// 内部变量
var innerData = {
  route: {
    prefix: [],
    presets: {}
  }
};

var IGNORE_CHARS = ['_', '.'];

// 实例, fkp中间件
function _fkp(ctx, opts) {
  this.ctx = ctx;
  this.opts = opts;
  var that = this;
  this.isAjax = function () {
    return header(that.ctx, 'X-Requested-With') === 'XMLHttpRequest';
  };
}

function header(ctx, name, value) {
  if (ctx) {
    if (value != undefined) {
      ctx.request.set(name, value);
    } else {
      return ctx.request.get(name);
    }
  }
}

function fkp(ctx, opts) {
  var fkpInstanc = new _fkp(ctx, opts);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)((0, _entries2.default)(fkp)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var property = _step.value;

      var _property = (0, _slicedToArray3.default)(property, 2),
          _name = _property[0],
          _value = _property[1];

      fkpInstanc[_name] = _value;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return fkpInstanc;
}

// manual set static property or fun or some resource
fkp.env = process.env.NODE_ENV == 'development' ? 'dev' : 'pro';

// Register utile function
fkp.utileHand = function (name, fn) {
  if (typeof fn == 'function') {
    fkp[name] = function () {
      if (fn && typeof fn == 'function') {
        return fn.apply(null, [fkp].concat(Array.prototype.slice.call(arguments)));
      }
    };
  }
};

// Register plugins function
fkp.plugins = function (name, fn) {
  if (typeof fn == 'function') {
    _fkp.prototype[name] = function () {
      if (fn && typeof fn == 'function') {
        return fn.apply(this, [this.ctx].concat(Array.prototype.slice.call(arguments)));
      }
    };
  }
};

// as plugins, it look nice
fkp.use = function (name, fn) {
  _fkp.prototype[name] = function () {
    if (fn && typeof fn == 'function') return fn.apply(this, [this.ctx].concat(Array.prototype.slice.call(arguments)));
  };
};

function valideFile(_file) {
  var firstChar = _file && _file.charAt(0);
  return IGNORE_CHARS.indexOf(firstChar) > -1 ? false : true;
}

exports.default = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(app, options) {
    var _this3 = this;

    var instance, dfts, server, pluginRoot, myfkp;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            instance = this;
            // =========== 注册fkp中间件 =============

            app.fkp = fkp;

            dfts = {
              apis: options.apis,
              pages: options.pages,
              index: options.index,
              mapper: options.mapper,
              pluginsFolder: options.pluginsFolder

              // 初始化controls目录
            };
            router.pages(dfts.pages);

            // 初始化socket.io
            server = socketio.init(app);

            // 传入apis
            // const fetch = _fetch({apis: dfts.apis});     
            // global.Fetch = fetch

            fkp.staticMapper = dfts.mapper;
            fkp.router = router;
            fkp.apilist = dfts.apis;
            fkp.index = dfts.index;
            fkp.statics = instance.statics.bind(instance);

            /**
             * 预动态设置路由, 在plugins方法中使用
             * @param  {String}  prefix        koa-router's prefix
             * @param  {JSON}  routerOptions   koa-router's route
            */
            fkp.routepreset = function () {
              var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(prefix, routerOptions) {
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        if (prefix) {
                          prefix = _path2.default.join('/', prefix);
                          innerData.route.presets[prefix] = routerOptions;
                          // prefix = Path.join('/', prefix)
                          // let presets = innerData.route.presets
                          // if (!presets[prefix]) {
                          //   presets[prefix] = true
                          //   await router(app, prefix, routerOptions)
                          // }
                        }

                        // if (!prefix) return
                        // if (prefix.indexOf('/')==-1) return
                        // let prefixs = innerData.route.prefix
                        // if (prefixs.indexOf(prefix)>-1) return
                        // prefixs.push(prefix)
                        // await router(app, prefix, routerOptions)

                      case 1:
                      case 'end':
                        return _context7.stop();
                    }
                  }
                }, _callee7, this);
              }));

              return function (_x11, _x12) {
                return _ref8.apply(this, arguments);
              };
            }();

            /*
            =============== 注册助手方法及plugins =============
            1、助手方法为一般的静态方法，第一个参数fkp，通过fkp.xxx调用，助手方法不能调用plugins方法
            2、插件方法为new fkp后的对象方法，带有this的上下文，第一个参数ctx，为koa环境对象，插件方法挂载在fkp上，调用方法同样为fkp.xxx
            =================================================*/

            _context9.prev = 11;
            _context9.next = 14;
            return registerUtile(app);

          case 14:

            // register plugins
            pluginRoot = dfts.pluginsFolder;

            if (!(pluginRoot && fs.existsSync(pluginRoot))) {
              _context9.next = 18;
              break;
            }

            _context9.next = 18;
            return registerPlugins(pluginRoot, app);

          case 18:
            _context9.next = 23;
            break;

          case 20:
            _context9.prev = 20;
            _context9.t0 = _context9['catch'](11);

            console.log(_context9.t0);

          case 23:

            // 获取当前的路由信息
            fkp.getRouter = function () {
              return router.getRoute(ctx);
            };

            myfkp = fkp(null);

            // 封装koa中间件

            app.use(function () {
              var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(ctx, next) {
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        // controle层使用的fkp都是实例化的fkp
                        myfkp.ctx = ctx;
                        ctx.fkp = myfkp;

                        // 定义Fetch的上下文环境
                        Fetch.init(ctx);
                        _context8.next = 5;
                        return next();

                      case 5:
                      case 'end':
                        return _context8.stop();
                    }
                  }
                }, _callee8, _this3);
              }));

              return function (_x13, _x14) {
                return _ref9.apply(this, arguments);
              };
            }());

            _context9.next = 28;
            return _routepreset(app);

          case 28:
            _context9.next = 30;
            return router(app);

          case 30:

            // socketio运行时
            socketio.run();
            return _context9.abrupt('return', server);

          case 32:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this, [[11, 20]]);
  }));

  return function (_x9, _x10) {
    return _ref7.apply(this, arguments);
  };
}();
//# sourceMappingURL=../maps/fkpcore/index.js.map
