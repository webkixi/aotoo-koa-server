'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.fkp = fkp;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var socketio = require('./modules/wsocket');global.Sio = socketio.sio;
var cache = require('./modules/cache');global.Cache = cache;
var _fetch = require('./modules/fetch');
var router = require('./router');

// 实例, fkp中间件
function _fkp(ctx, opts) {
  this.ctx = ctx;
  this.opts = opts;

  this.isAjax = function () {
    return header('X-Requested-With') === 'XMLHttpRequest';
  };

  function header(name, value) {
    if (value != undefined) {
      ctx.request.set(name, value);
    } else {
      return ctx.request.get(name);
    }
  }
}

// 静态, fkp()返回实例
function fkp(ctx, opts) {
  var fkpInstanc = new _fkp(ctx, opts);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.entries(fkp)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var property = _step.value;

      var _property = _slicedToArray(property, 2),
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
// fkp.staticMapper = dfts.mapper
// fkp.router = router
// fkp.apilist = dfts.apis
// fkp.index = dfts.index

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

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(app, options) {
    var _this = this;

    var dfts, server, fetch, innerData, baseRoot, _utilesFiles, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, utileFile, utileFun, pluginRoot, _pluginFiles, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, pluginFile, plugin;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            dfts = {
              apis: options.apis || { list: {} },
              pages: options.pages,
              index: options.index || 'index',
              mapper: options.mapper,
              pluginsFolder: options.pluginsFolder

              // 初始化controls目录
            };
            router.pages(dfts.pages);

            // 初始化socket.io
            server = socketio.init(app);

            // 传入apis

            fetch = _fetch({ apis: dfts.apis });

            global.Fetch = fetch;

            // 内部变量
            innerData = {
              route: {
                prefix: []
              }

              // // 实例, fkp中间件
              // function _fkp(ctx, opts){
              //   this.ctx = ctx
              //   this.opts = opts

              //   this.isAjax = function() {
              //     return header('X-Requested-With') === 'XMLHttpRequest';
              //   }

              //   function header(name, value) {
              //     if (value != undefined) {
              //       ctx.request.set(name, value);
              //     } else {
              //       return ctx.request.get(name);
              //     }
              //   }
              // }

              // // 静态, fkp()返回实例
              // function fkp(ctx, opts){
              //   let fkpInstanc = new _fkp(ctx, opts)
              //   for (let property of Object.entries(fkp)) {
              //     let [_name, _value] = property
              //     fkpInstanc[_name] = _value
              //   }
              //   return fkpInstanc
              // }

              // // manual set static property or fun or some resource
              // fkp.env = process.env.NODE_ENV == 'development' ? 'dev' : 'pro'
            };
            fkp.staticMapper = dfts.mapper;
            fkp.router = router;
            fkp.apilist = dfts.apis;
            fkp.index = dfts.index;

            // // Register utile function
            // fkp.utileHand = function(name, fn){
            //   if (typeof fn == 'function') {
            //     fkp[name] = function() {
            //       if (fn && typeof fn=='function') { return fn.apply(null, [fkp, ...arguments]) }
            //     }
            //   }
            // }

            // // Register plugins function
            // fkp.plugins = function(name, fn){
            //   if (typeof fn == 'function') {
            //     _fkp.prototype[name] = function() {
            //       if (fn && typeof fn=='function') { return fn.apply(this, [this.ctx, ...arguments]) }
            //     }
            //   }
            // }

            // // as plugins, it look nice
            // fkp.use = function(name, fn){
            //   _fkp.prototype[name] = function() {
            //     if (fn && typeof fn=='function') return fn.apply(this, [this.ctx, ...arguments])
            //   }
            // }


            /**
             * 预动态设置路由, 在plugins方法中使用
             * @param  {String}  prefix        koa-router's prefix
             * @param  {JSON}  routerOptions   koa-router's route
            */
            fkp.routepreset = function () {
              var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(prefix, routerOptions) {
                var prefixs;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (prefix) {
                          _context.next = 2;
                          break;
                        }

                        return _context.abrupt('return');

                      case 2:
                        if (!(prefix.indexOf('/') == -1)) {
                          _context.next = 4;
                          break;
                        }

                        return _context.abrupt('return');

                      case 4:
                        prefixs = innerData.route.prefix;

                        if (!(prefixs.indexOf(prefix) > -1)) {
                          _context.next = 7;
                          break;
                        }

                        return _context.abrupt('return');

                      case 7:
                        prefixs.push(prefix);
                        _context.next = 10;
                        return router(app, prefix, routerOptions);

                      case 10:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));

              return function (_x3, _x4) {
                return _ref2.apply(this, arguments);
              };
            }();

            /*
            =============== 注册助手方法及plugins =============
            1、助手方法为一般的静态方法，第一个参数fkp，通过fkp.xxx调用，助手方法不能调用plugins方法
            2、插件方法为new fkp后的对象方法，带有this的上下文，第一个参数ctx，为koa环境对象，插件方法挂载在fkp上，调用方法同样为fkp.xxx
            =================================================*/

            _context3.prev = 11;

            // register utile
            baseRoot = './base';
            _utilesFiles = _fs2.default.readdirSync(_path2.default.resolve(__dirname, baseRoot));

            if (!(_utilesFiles && _utilesFiles.length)) {
              _context3.next = 34;
              break;
            }

            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context3.prev = 18;

            for (_iterator2 = _utilesFiles[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              utileFile = _step2.value;

              if (utileFile.indexOf('_') != 0) {
                utileFun = require('./base/' + utileFile).default();

                fkp.utileHand(_path2.default.parse(utileFile).name, utileFun);
              }
            }
            _context3.next = 26;
            break;

          case 22:
            _context3.prev = 22;
            _context3.t0 = _context3['catch'](18);
            _didIteratorError2 = true;
            _iteratorError2 = _context3.t0;

          case 26:
            _context3.prev = 26;
            _context3.prev = 27;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 29:
            _context3.prev = 29;

            if (!_didIteratorError2) {
              _context3.next = 32;
              break;
            }

            throw _iteratorError2;

          case 32:
            return _context3.finish(29);

          case 33:
            return _context3.finish(26);

          case 34:

            // register plugins
            pluginRoot = dfts.pluginsFolder;
            // if ( fs.existsSync(Path.resolve(__dirname, pluginRoot)) ) {

            if (!(pluginRoot && _fs2.default.existsSync(pluginRoot))) {
              _context3.next = 57;
              break;
            }

            _pluginFiles = _fs2.default.readdirSync(pluginRoot);

            if (!(_pluginFiles && _pluginFiles.length)) {
              _context3.next = 57;
              break;
            }

            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context3.prev = 41;

            for (_iterator3 = _pluginFiles[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              pluginFile = _step3.value;

              if (pluginFile.indexOf('_') != 0) {
                plugin = require(_path2.default.join(pluginRoot, pluginFile)).default(fkp);

                fkp.plugins(_path2.default.parse(pluginFile).name, plugin);
              }
            }
            _context3.next = 49;
            break;

          case 45:
            _context3.prev = 45;
            _context3.t1 = _context3['catch'](41);
            _didIteratorError3 = true;
            _iteratorError3 = _context3.t1;

          case 49:
            _context3.prev = 49;
            _context3.prev = 50;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 52:
            _context3.prev = 52;

            if (!_didIteratorError3) {
              _context3.next = 55;
              break;
            }

            throw _iteratorError3;

          case 55:
            return _context3.finish(52);

          case 56:
            return _context3.finish(49);

          case 57:
            _context3.next = 62;
            break;

          case 59:
            _context3.prev = 59;
            _context3.t2 = _context3['catch'](11);

            console.log(_context3.t2);

          case 62:

            // =========== 注册fkp中间件 =============
            app.fkp = fkp;

            // 封装koa中间件
            app.use(function () {
              var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx, next) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return router(app);

                      case 2:

                        // 获取当前的路由信息
                        fkp.getRouter = function () {
                          return router.getRoute(ctx);
                        };

                        // controle层使用的fkp都是实例化的fkp
                        ctx.fkp = fkp(ctx);

                        // 定义Fetch的上下文环境
                        Fetch.init(ctx);

                        _context2.next = 7;
                        return next();

                      case 7:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, _this);
              }));

              return function (_x5, _x6) {
                return _ref3.apply(this, arguments);
              };
            }());

            // socketio运行时
            socketio.run();
            return _context3.abrupt('return', server);

          case 66:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[11, 59], [18, 22, 26, 34], [27,, 29, 33], [41, 45, 49, 57], [50,, 52, 56]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=../maps/fkpcore/index.js.map
