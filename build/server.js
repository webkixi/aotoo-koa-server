"use strict";

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _init = function () {
  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
    var _configs, keys, apis, mapper, server;

    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;

            AKSHOOKS.append({
              entry: this,
              context: this
            });
            _configs = this.configs, keys = _configs.keys, apis = _configs.apis, mapper = _configs.mapper;

            app.keys = this.configs.keys;

            if (apis.list) {
              _context8.next = 6;
              break;
            }

            throw new Error('api 列表必须封装为list的子属性');

          case 6:
            if (!(!mapper.js || !mapper.css)) {
              _context8.next = 8;
              break;
            }

            throw new Error('请将静态资源列表分别配置作为mapper.js和mapper.css的子元素');

          case 8:
            _context8.next = 10;
            return _fkpcore2.default.call(this, app, this.configs);

          case 10:
            server = _context8.sent;
            return _context8.abrupt("return", server);

          case 14:
            _context8.prev = 14;
            _context8.t0 = _context8["catch"](0);

            console.log(_context8.t0.stack);

          case 17:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, this, [[0, 14]]);
  }));

  return function _init() {
    return _ref8.apply(this, arguments);
  };
}();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _koa = require("koa");

var _koa2 = _interopRequireDefault(_koa);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

require("aotoo");

require("aotoo-web-widgets");

var _blueimpMd = require("blueimp-md5");

var _blueimpMd2 = _interopRequireDefault(_blueimpMd);

var _koaArtTemplate = require("koa-art-template");

var _koaArtTemplate2 = _interopRequireDefault(_koaArtTemplate);

var _koaStaticCache = require("koa-static-cache");

var _koaStaticCache2 = _interopRequireDefault(_koaStaticCache);

var _koaBodyparser = require("koa-bodyparser");

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _fkpcore = require("./fkpcore");

var _fkpcore2 = _interopRequireDefault(_fkpcore);

var _fetch = require("./fkpcore/modules/fetch");

var _fetch2 = _interopRequireDefault(_fetch);

var _cache = require("./fkpcore/modules/cache");

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

ReactDom = require('react-dom/server');
var AKSHOOKS = SAX('AOTOO-KOA-SERVER');
global.ReactDomServer = ReactDom;
global.AotooServerHooks = AKSHOOKS;
Aotoo.render = ReactDomServer.renderToString;
Aotoo.html = ReactDomServer.renderToStaticMarkup;

var app = new _koa2.default();
var DEFAULTCONFIGS = {
  mapper: {
    js: {},
    css: {},
    public: {
      js: '/js',
      css: '/css'
    }
  },

  apis: {
    list: {}
  },

  fetchOptions: {
    headers: {},
    timeout: 100000
  },

  cacheOptions: {
    max: 300,
    length: function length(n, key) {
      return n * 2 + key.length;
    },
    dispose: function dispose(key, value) {},
    maxAge: 2 * 60 * 60 * 1000
  },

  bodyOptions: null,

  routerOptions: {
    allMethods: ['get', 'post', 'put', 'del'],
    parameters: {
      get: ['/', '/:cat', '/:cat/:title', '/:cat/:title/:id'],
      post: ['/', '/:cat', '/:cat/:title', '/:cat/:title/:id']
    },
    prefixes: {}
  }
};

var aotooServer = function () {
  function aotooServer() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, aotooServer);

    this.middlewares = [];
    this._public = {
      js: '/js',
      css: '/css'
    };

    opts = _.merge({}, DEFAULTCONFIGS, opts);

    this.configs = {
      keys: opts.keys || ['aotoo koa'], // cookie session关键字
      index: opts.index || 'index', // 默认首页

      apis: opts.apis, // api接口集合
      mapper: opts.mapper, // 静态资源映射文件

      fetchOptions: opts.fetchOptions,
      cacheOptions: opts.cacheOptions,
      bodyOptions: opts.bodyOptions,
      routerOptions: opts.routerOptions,

      root: opts.root, // 渲染默认目录
      pages: opts.pages || opts.pagesFolder || opts.controls, // control层文件夹，必须
      pluginsFolder: opts.pluginsFolder // 插件文件夹
    };

    this.state = {
      views: false,
      bodyparser: false,
      status: false
    };

    if (this.configs.bodyOptions) {
      this.state.bodyparser = true;
      app.use((0, _koaBodyparser2.default)(this.configs.bodyOptions));
    }

    // 传入apis
    global.Fetch = this.fetch = (0, _fetch2.default)((0, _extends3.default)({ apis: this.configs.apis }, this.fetchOptions));
    global.Cache = this.cache = (0, _cache2.default)(this.configs.cacheOptions);

    if (this.configs.mapper) {
      var _public = void 0;
      var mapper = this.configs.mapper;
      if (mapper.public) {
        _public = mapper.public;
        // delete mapper.public
      }
      if (_public) {
        this._public = _public;
        Aotoo.inject.public = _public;
      }
      Aotoo.inject.mapper = mapper;
    }

    this.on = function (name, cb) {
      if (name === 'error') app.on(name, cb);
      AKSHOOKS.on(name, cb);
    };
    this.one = AKSHOOKS.one.bind(AKSHOOKS);
    this.off = AKSHOOKS.off.bind(AKSHOOKS);
    this.emit = AKSHOOKS.emit.bind(AKSHOOKS);
    this.hasOn = AKSHOOKS.hasOn.bind(AKSHOOKS);
    this.append = AKSHOOKS.append.bind(AKSHOOKS);
    this.set = AKSHOOKS.set.bind(AKSHOOKS);
    this.get = AKSHOOKS.get.bind(AKSHOOKS);
  }

  (0, _createClass3.default)(aotooServer, [{
    key: "setFetchOptions",
    value: function setFetchOptions(opts) {
      DEFAULTCONFIGS.fetchOptions.apis = this.fetch.apis;
      var _opts = _.merge({}, DEFAULTCONFIGS.fetchOptions, opts);
      this.configs.fetchOptions = _opts;
      global.Fetch = this.fetch = (0, _fetch2.default)(_opts);
    }
  }, {
    key: "setCacheOptions",
    value: function setCacheOptions(opts) {
      var _opts = _.merge({}, DEFAULTCONFIGS.cacheOptions, opts);
      this.configs.cacheOptions = _opts;
      global.Cache = this.cache = (0, _cache2.default)(_opts);
    }
  }, {
    key: "setRouterOptions",
    value: function setRouterOptions(opts) {
      var _opts = _.merge({}, DEFAULTCONFIGS.routerOptions, opts);
      this.configs.routerOptions = _opts;
    }
  }, {
    key: "setRouterPrefixes",
    value: function setRouterPrefixes(opts) {
      if (!this.state.status) {
        var _opts = _.merge({}, this.configs.routerOptions.prefixes, opts);
        this.configs.routerOptions.prefixes = _opts;
      } else {
        console.log('===========');
        console.log('初始化状态才能设置前缀路由');
      }
    }
  }, {
    key: "public",
    value: function _public(opts) {
      this._public = opts;
      Aotoo.inject.public = opts;
    }

    // 注册KOA2的中间间，与KOA2语法保持一致

  }, {
    key: "use",
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(midw) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                app.use(midw);

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function use(_x2) {
        return _ref.apply(this, arguments);
      }

      return use;
    }()

    // 注册一个Aotoo插件方法

  }, {
    key: "plugins",
    value: function plugins(name, fn) {
      _fkpcore.fkp.plugins(name, fn);
    }

    // 注册一个Aotoo助手方法

  }, {
    key: "utile",
    value: function utile(name, fn) {
      _fkpcore.fkp.utileHand(name, fn);
    }
  }, {
    key: "callback",
    value: function callback() {
      return app.callback(arguments);
    }

    // 指定站点静态路径，如 /images, /uploader, /user

  }, {
    key: "statics",
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

                dft = _.merge(dft, opts);

                app.use((0, _koaStaticCache2.default)(dist, dft, files));

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function statics(_x3, _x4, _x5) {
        return _ref2.apply(this, arguments);
      }

      return statics;
    }()

    // 注册api接口集，用于做接口层的数据访问

  }, {
    key: "apis",
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if ((typeof obj === "undefined" ? "undefined" : (0, _typeof3.default)(obj)) == 'object') {
                  this.configs.apis = obj;
                }

              case 1:
              case "end":
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
    key: "bodyparser",
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!this.state.bodyparser && (typeof obj === "undefined" ? "undefined" : (0, _typeof3.default)(obj)) == 'object') {
                  this.state.bodyparser = true;
                  app.use((0, _koaBodyparser2.default)(obj));
                }

              case 1:
              case "end":
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
    key: "views",
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(dist, opts) {
        var dft, _views, distState;

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


                if (typeof opts == 'function') {
                  opts = {
                    render: opts
                  };
                }

                dft = _.merge({}, dft, opts);

                if (dist) {
                  _views = [];

                  this.state.viewsRoot = dist;
                  if (_fs2.default.existsSync(dist)) {
                    distState = _fs2.default.statSync(dist);

                    if (distState.isDirectory()) {
                      // glob.sync(dist + '/**/*.html').forEach(function (item) {
                      _glob2.default.sync(dist + '/**/*.html').forEach(function (item) {
                        _views.push(item);
                      });
                    }
                  }
                  this.state.views = _views;
                }
                if (dft.render && typeof dft.render == 'function') {
                  app.use(dft.render);
                } else {
                  (0, _koaArtTemplate2.default)(app, dft);
                }

              case 5:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function views(_x8, _x9) {
        return _ref5.apply(this, arguments);
      }

      return views;
    }()

    // 初始化

  }, {
    key: "init",
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

                throw new Error('控制器目录没有指定');

              case 3:
                if (this.state.views) {
                  _context6.next = 9;
                  break;
                }

                if (this.configs.root) {
                  _context6.next = 8;
                  break;
                }

                throw new Error('koa的模板解析引擎没有配置且需设置app.state.views=true; app.state.viewsRoot=HTMLDIST');

              case 8:
                this.views(this.configs.root);

              case 9:
                if (!this.state.bodyparser) {
                  app.use((0, _koaBodyparser2.default)());
                }
                _context6.next = 12;
                return _init.call(this);

              case 12:
                return _context6.abrupt("return", _context6.sent);

              case 15:
                _context6.prev = 15;
                _context6.t0 = _context6["catch"](0);

                console.error(_context6.t0);

              case 18:
              case "end":
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
  }, {
    key: "listen",
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(port, dom, cb) {
        var server;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.init();

              case 2:
                server = _context7.sent;

                this.state.status = 'running';
                server.listen(port, dom, cb);

              case 5:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function listen(_x10, _x11, _x12) {
        return _ref7.apply(this, arguments);
      }

      return listen;
    }()
  }]);
  return aotooServer;
}();

module.exports = function (opts) {
  return new aotooServer(opts);
};
//# sourceMappingURL=maps/server.js.map
