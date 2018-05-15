'use strict';

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _forEach = require('babel-runtime/core-js/array/for-each');

var _forEach2 = _interopRequireDefault(_forEach);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * 路由分配
 * {param1} koa implement
 * {param2} map of static file
 * return rende pages
**/
var init = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(app, prefix, options) {
    var _controlPages, AotooConfigs, allMethods, router, customControl, myOptions, betterControl;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return controlPages();

          case 2:
            _controlPages = _context2.sent;
            AotooConfigs = AKSHOOKS.get().context.configs;
            allMethods = AotooConfigs.routerOptions.allMethods;

            router = function () {
              if (prefix) {
                return new Router({ prefix: prefix });
              } else {
                return new Router();
              }
            }();

            customControl = void 0;

            if (options && options.customControl) {
              customControl = options.customControl;
              delete options.customControl;
            }
            myOptions = _.merge({}, AotooConfigs.routerOptions.parameters, options);
            betterControl = customControl ? control_custrom.call(router, router, customControl) : control_mirror.call(router, router, _controlPages);

            if (_.isPlainObject(options)) {
              defineMyRouter(myOptions, router, prefix, customControl, _controlPages);
            } else {
              _.map(myOptions, function (rules, key) {
                var methodKey = key.toLowerCase();
                if (allMethods.indexOf(methodKey) > -1) {
                  rules = [].concat(rules);
                  rules.forEach(function (rule) {
                    return router[methodKey](rule, betterControl);
                  });
                }
              });
            }
            app.use(router.routes());
            app.use(router.allowedMethods());

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function init(_x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var controler = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(ctx, route, pageData, ctrlPages, routerInstance) {
    var xData, passAccess, isAjax, routerPrefix, controlFile, hitedControlFile, _controlFile, controlIndexFile, controlCatFile, paramsCatFile, xRoute, apilist;

    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            xData = undefined;
            passAccess = false;
            isAjax = ctx.fkp.isAjax();
            routerPrefix = routerInstance.opts.prefix;

            if (_.isString(routerPrefix) && routerPrefix.indexOf('/') == 0) {
              routerPrefix = routerPrefix.replace('/', '');
            }
            // 根据route匹配到control文件+三层路由
            controlFile = Path.sep + route + '.js';

            if (!(ctrlPages.indexOf(controlFile) > -1)) {
              _context5.next = 12;
              break;
            }

            _context5.next = 9;
            return getctrlData([businessPagesPath + '/' + route], route, ctx, pageData, routerInstance);

          case 9:
            xData = _context5.sent;
            _context5.next = 30;
            break;

          case 12:
            if (!routerPrefix) {
              _context5.next = 24;
              break;
            }

            route = routerPrefix;
            hitedControlFile = [];
            _controlFile = Path.join(Path.sep, routerPrefix);
            controlIndexFile = Path.join(Path.sep, routerPrefix, 'index');
            controlCatFile = Path.join(Path.sep, routerPrefix, ctx.params.cat || '');

            (0, _forEach2.default)([_controlFile, controlIndexFile, controlCatFile], function (item) {
              var item_file = item + '.js';
              if (ctrlPages.indexOf(item_file) > -1) {
                hitedControlFile.push(Path.join(businessPagesPath, item));
              }
            });

            _context5.next = 21;
            return getctrlData(hitedControlFile, route, ctx, pageData, routerInstance);

          case 21:
            xData = _context5.sent;
            _context5.next = 30;
            break;

          case 24:
            if (!ctx.params.cat) {
              _context5.next = 30;
              break;
            }

            paramsCatFile = Path.join(businessPagesPath, ctx.params.cat);
            xRoute = ctx.params.cat;
            _context5.next = 29;
            return getctrlData([paramsCatFile], xRoute, ctx, pageData, routerInstance);

          case 29:
            xData = _context5.sent;

          case 30:
            if (xData) {
              _context5.next = 40;
              break;
            }

            apilist = Fetch.apilist;

            if (!(apilist.list[route] || route === 'redirect')) {
              _context5.next = 39;
              break;
            }

            passAccess = true;
            _context5.next = 36;
            return getctrlData(['./passaccesscontrol'], route, ctx, pageData, routerInstance);

          case 36:
            xData = _context5.sent;
            _context5.next = 40;
            break;

          case 39:
            xData = { nomatch: true };

          case 40:
            if (passAccess || isAjax) pageData = xData;
            return _context5.abrupt('return', [pageData, route]);

          case 42:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function controler(_x9, _x10, _x11, _x12, _x13) {
    return _ref7.apply(this, arguments);
  };
}();

// match的control文件，并返回数据
var getctrlData = function () {
  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(_path, route, ctx, _pageData, routerInstance) {
    var _names, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _filename, controlFun, controlConfig, controlModule, _controlFun, _controlConfig;

    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _names = [];

            if (!Array.isArray(_path)) {
              _context6.next = 21;
              break;
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context6.prev = 5;

            for (_iterator = (0, _getIterator3.default)(_path); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              _filename = _step.value;

              _filename = Path.resolve(__dirname, _filename + '.js');
              _names.push(_filename);
            }
            _context6.next = 13;
            break;

          case 9:
            _context6.prev = 9;
            _context6.t0 = _context6['catch'](5);
            _didIteratorError = true;
            _iteratorError = _context6.t0;

          case 13:
            _context6.prev = 13;
            _context6.prev = 14;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 16:
            _context6.prev = 16;

            if (!_didIteratorError) {
              _context6.next = 19;
              break;
            }

            throw _iteratorError;

          case 19:
            return _context6.finish(16);

          case 20:
            return _context6.finish(13);

          case 21:
            if (!existsControlFun[_names[0]]) {
              _context6.next = 31;
              break;
            }

            controlFun = existsControlFun[_names[0]];
            controlConfig = controlFun ? controlFun.call(ctx, _pageData) : undefined;

            if (!controlConfig) {
              _context6.next = 30;
              break;
            }

            _context6.next = 27;
            return control(route, ctx, _pageData, routerInstance, controlConfig);

          case 27:
            return _context6.abrupt('return', _context6.sent);

          case 30:
            throw new Error('控制器文件不符合规范');

          case 31:
            if (!fs.existsSync(_names[0])) {
              _context6.next = 49;
              break;
            }

            controlModule = require(_names[0]);

            if (!controlModule) {
              _context6.next = 46;
              break;
            }

            _controlFun = typeof controlModule == 'function' ? controlModule : controlModule.getData && controlModule.getData && typeof controlModule.getData == 'function' ? controlModule.getData : undefined;


            existsControlFun[_names[0]] = _controlFun;
            _controlConfig = _controlFun ? _controlFun.call(ctx, _pageData) : undefined;

            if (!_controlConfig) {
              _context6.next = 43;
              break;
            }

            _context6.next = 40;
            return control(route, ctx, _pageData, routerInstance, _controlConfig);

          case 40:
            _pageData = _context6.sent;
            _context6.next = 44;
            break;

          case 43:
            throw new Error('控制器文件不符合规范');

          case 44:
            _context6.next = 47;
            break;

          case 46:
            _pageData = undefined;

          case 47:
            _context6.next = 50;
            break;

          case 49:
            _pageData = undefined;

          case 50:
            return _context6.abrupt('return', _pageData);

          case 51:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[5, 9, 13, 21], [14,, 16, 20]]);
  }));

  return function getctrlData(_x14, _x15, _x16, _x17, _x18) {
    return _ref8.apply(this, arguments);
  };
}();

// dealwith the data from controlPage
var renderPage = function () {
  var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(ctx, route, data) {
    var isAjax;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            DEBUG('renderPage pageData = %O', data);
            DEBUG('renderPage route = %s', route);
            isAjax = ctx.fkp.isAjax();

            data = AKSHOOKS.emit('beforeRender', data) || data;
            _context7.t0 = ctx.method;
            _context7.next = _context7.t0 === 'GET' ? 7 : _context7.t0 === 'POST' ? 16 : 17;
            break;

          case 7:
            if (!isAjax) {
              _context7.next = 9;
              break;
            }

            return _context7.abrupt('return', ctx.body = data);

          case 9:
            if (!route) {
              _context7.next = 15;
              break;
            }

            _context7.next = 12;
            return ctx.render(route, data);

          case 12:
            return _context7.abrupt('return', _context7.sent);

          case 15:
            throw new Error('404');

          case 16:
            return _context7.abrupt('return', ctx.body = data);

          case 17:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function renderPage(_x19, _x20, _x21) {
    return _ref9.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Module dependencies.
 */
var DEBUG = debug('fkp:router');
var fs = require('fs');
var Promise = require('bluebird');
var glob = require('glob');
var Path = require('path');
var Url = require('url');
var Router = require('koa-router');
var md5 = require('blueimp-md5');
var AKSHOOKS = SAX('AOTOO-KOA-SERVER');
var control = require('./control').default;
fs = Promise.promisifyAll(fs);

var businessPagesPath = '';
var ignoreStacic = ['css', 'js', 'images', 'img'];

function getObjType(object) {
  return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1].toLowerCase();
};

/**
 * 过滤渲染文件
 * {param1} {json}   this.params
 * {param2} {json}   json of parse this.path
 * return   {boleean}
**/
function filterRendeFile(pms, url) {
  url = url.replace(/\?\S*$/, ''); // 避免?key=value参数影响ext判断

  url = decodeURIComponent(url);

  var rjson = Path.parse(url);
  var rtn = false;
  var ext = rjson.ext;
  var cat = pms.cat;

  var exts = ['.css', '.js', '.swf', '.jpg', '.jpeg', '.png', '.bmp', '.ico'];
  var tempExts = ['.html', '.shtml'];
  var noPassCat = ['css', 'js', 'img', 'imgs', 'image', 'images'];

  if (!ext) rtn = true;

  return !ext || tempExts.includes(ext) || noPassCat.includes(cat);

  // if (_.indexOf(tempExts, ext) > -1) rtn = true;
  // if (_.indexOf(noPassCat, cat) > -1) rtn = false;

  // return rtn;
}

/**
 * 
 * @param {String} dir 遍历的目标目录
 * @param {String} rootpath 根目录的绝对路径
 */
// async function getCtrlFiles(dir, rootpath) {
//   const __myControlFiles = []
//   const dirData = await fs.readdirAsync(dir)
//   dirData.map(async (file) => {
//     const _path = Path.join(dir, file)
//     const stat = fs.statSync(_path)
//     if (stat) {
//       if (stat.isDirectory()) {
//         __myControlFiles.concat(await getCtrlFiles(_path, rootpath))
//       } else {
//         __myControlFiles.push(_path.replace(rootpath, ''))
//       }
//     }
//   })
//   return __myControlFiles
// }

function getCtrlFiles(dir) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var controlFiles = [];
  if (!fs.existsSync(dir)) return;
  var stat = fs.statSync(dir);
  if (!stat.isDirectory()) return;

  var _partten = /^[_\.](\w)+/; // ?? 不兼容windows
  glob.sync(dir + '/**/*').forEach(function (item) {
    var obj = Path.parse(item);
    var xxx = _partten.test(obj.name);
    if (!xxx) {
      if (obj.ext) {
        controlFiles.push(item.replace(dir, ''));
      }
    }
  });
  return controlFiles;
};

// 预读取pages目录下的所有文件路径，并保存
function controlPages() {
  var _this = this;

  // const businessPages = Path.join(__dirname, businessPagesPath)
  var businessPages = businessPagesPath;

  if (!fs.existsSync(businessPages)) {
    fs.mkdirSync(businessPages, '0777');
  }

  DEBUG('businessPages %s', businessPages);
  var controlPagePath = businessPages;
  var _id = controlPagePath;

  try {
    if (fs.existsSync(controlPagePath)) {
      return Cache.ifid(_id, (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var __cfile;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return getCtrlFiles(controlPagePath, controlPagePath);

              case 2:
                __cfile = _context.sent;
                Cache.set(_id, __cfile);
                return _context.abrupt('return', __cfile);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      })));
    } else {
      throw new Error('控制层目录不存在');
    }
  } catch (err) {
    console.error(err.stack);
  }

  // let ctrlFiles = []
  // return Cache.ifid(_id, () => new Promise((res, rej) => {
  //   return function getCtrlFiles(dir) {
  //     fs.readdir(dir, (err, data) => {
  //       if (err) throw err
  //       data.map(file => {
  //         const _path = Path.join(dir, file)
  //         const stat = fs.statSync(_path)
  //         if (stat && stat.isDirectory()) return getCtrlFiles(_path)
  //         const okPath = _path.replace(controlPagePath, '')
  //         ctrlFiles.push(okPath)
  //         // ctrlFiles.push(Path.join(okPath))
  //       }) // end map
  //       Cache.set(_id, ctrlFiles)
  //       res(ctrlFiles)
  //     })
  //   }(controlPagePath)
  // })
  // )
}

function makeRoute(ctx, prefix) {
  var params = ctx.params;
  var _url = ctx.url;
  var fkp = ctx.fkp;
  var indexRoot = fkp.index;
  ctx.local = Url.parse(ctx.url, true);

  var _ext = Path.extname(ctx.url);
  var ctxurl = ctx.url.slice(1).replace(_ext, '') || '';

  if (_url.indexOf('?') > -1) {
    _url = _url.slice(0, _url.indexOf('?'));
    ctxurl = ctxurl.slice(0, ctxurl.indexOf('?'));
  }
  var rjson = Path.parse(_url);
  var route = false;
  var cat = params.cat || '',
      title = params.title || '',
      id = params.id || '';
  var gtpy = getObjType;

  if (id) {
    gtpy(id) === 'number' ? route = title ? cat + '/' + title : cat : route = cat + '/' + title + '/' + id;
  } else if (title) {
    title = title.replace(rjson.ext, '');
    route = gtpy(title) === 'number' ? cat : cat + '/' + title;
  } else if (cat) {
    cat = cat.replace(rjson.ext, '');
    route = gtpy(cat) === 'number' ? indexRoot || 'index' : cat;
  } else {
    route = indexRoot || 'index';
  }
  if (ctxurl && route !== ctxurl) route = ctxurl;
  if (prefix) route = prefix.indexOf('/') == 0 ? prefix.substring(1) : prefix;
  if (route.lastIndexOf('/') == route.length - 1) {
    route = route.substring(0, route.length - 1);
  }
  return route;
}

function path_join(jspath, src) {
  if (jspath.indexOf('http') == 0 || jspath.indexOf('//') == 0) {
    if (jspath.charAt(jspath.length - 1) == '/') {
      jspath = jspath.substring(0, jspath.length - 1);
    }
    if (src.charAt(0) == '/') {
      return jspath + src;
    } else {
      return jspath + '/' + src;
    }
  } else {
    return Path.join(jspath, src);
  }
}

function staticMapper(ctx, mapper, route, routerPrefix) {
  var jspath = Aotoo.inject.public.js;
  var csspath = Aotoo.inject.public.css;
  var tmpletStatic = function tmpletStatic(src, type) {
    if (type == 'js') {
      var jspagesrc = path_join(jspath, src);
      return '<script type="text/javascript" src="' + jspagesrc + '" ></script>';
    }
    if (type == 'css') {
      var csspagesrc = path_join(csspath, src);
      return '<link rel="stylesheet" href="' + csspagesrc + '" />';
    }
  };

  if (_.isString(routerPrefix) && routerPrefix.indexOf('/') == 0) routerPrefix = routerPrefix.replace('/', '');
  if (!mapper) return false;
  var pageData = {
    //静态资源
    commonjs: tmpletStatic(mapper.js.common || 'common.js', 'js'), //公共css
    commoncss: tmpletStatic(mapper.css.common || 'common.css', 'css'), //公共js
    pagejs: '',
    pagecss: '',
    pagedata: {}
    //静态资源初始化
  };if (route.indexOf('/') == 0) route = route.substring(1);
  if (route.lastIndexOf('/') == route.length - 1) route = route.substring(0, route.length - 1);
  if (mapper.css[route]) pageData.pagecss = tmpletStatic(mapper.css[route], 'css');
  if (mapper.js[route]) pageData.pagejs = tmpletStatic(mapper.js[route], 'js');

  var _route = route;
  if (routerPrefix) {
    _route = routerPrefix;
    if (mapper.css[_route]) pageData.pagecss = tmpletStatic(mapper.css[_route], 'css');
    if (mapper.js[_route]) pageData.pagejs = tmpletStatic(mapper.js[_route], 'js');
  }

  return pageData;
}

function defineMyRouter(myOptions, router, prefix, customControl, controlPages) {
  var allMethods = AKSHOOKS.get().context.configs.routerOptions.allMethods;
  var betterControl = customControl ? control_custrom.call(router, router, customControl) : control_mirror.call(router, router, controlPages);
  _.map(myOptions, function (rules, key) {
    var methodKey = key.toLowerCase();
    if (allMethods.indexOf(methodKey) > -1) {
      rules = [].concat(rules);
      rules.forEach(function (rule) {
        router[methodKey](rule, betterControl);
      });
    } else {
      if (prefix) {
        AKSHOOKS.append((0, _defineProperty3.default)({}, prefix, (0, _defineProperty3.default)({}, key, rules)));
      }
    }
  });
}

function control_custrom(router, myControl) {
  return function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(ctx, next) {
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;

              control_ctx_variable(ctx, router);

              if (!ctx.fkproute) {
                _context3.next = 6;
                break;
              }

              _context3.next = 5;
              return myControl.call(router, ctx, next);

            case 5:
              return _context3.abrupt('return', _context3.sent);

            case 6:
              _context3.next = 11;
              break;

            case 8:
              _context3.prev = 8;
              _context3.t0 = _context3['catch'](0);
              return _context3.abrupt('return', control_error(_context3.t0, ctx));

            case 11:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this, [[0, 8]]);
    }));

    return function (_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }().bind(this);
}

function control_mirror(router, ctrlPages) {
  return function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(ctx, next) {
      var isAjax, pageData, _ref5, _ref6, pdata, rt;

      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              isAjax = ctx.fkp.isAjax();
              _context4.prev = 1;

              control_ctx_variable(ctx, router);

              if (!ctx.fkproute) {
                _context4.next = 16;
                break;
              }

              pageData = staticMapper(ctx, ctx.fkp.staticMapper, ctx.fkproute, ctx.routerPrefix);

              if (!pageData) {
                _context4.next = 16;
                break;
              }

              _context4.next = 8;
              return controler(ctx, ctx.fkproute, pageData, ctrlPages, router);

            case 8:
              _ref5 = _context4.sent;
              _ref6 = (0, _slicedToArray3.default)(_ref5, 2);
              pdata = _ref6[0];
              rt = _ref6[1];

              rt = preRender(rt, ctx);
              _context4.next = 15;
              return renderPage(ctx, rt, pdata);

            case 15:
              return _context4.abrupt('return', _context4.sent);

            case 16:
              _context4.next = 21;
              break;

            case 18:
              _context4.prev = 18;
              _context4.t0 = _context4['catch'](1);
              return _context4.abrupt('return', control_error(_context4.t0, ctx));

            case 21:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this, [[1, 18]]);
    }));

    return function (_x7, _x8) {
      return _ref4.apply(this, arguments);
    };
  }().bind(this);
}

function control_ctx_variable(ctx, router) {
  var isRender = filterRendeFile(ctx.params, ctx.url);
  var route = isRender ? makeRoute(ctx) : false;
  if (route) {
    var routerPrefix = router.opts.prefix;
    ctx.fkproute = ctx.aotooRoutePath = route;
    ctx.routerPrefix = ctx.aotooRoutePrefix = routerPrefix;
    var hooksKey = routerPrefix ? Path.join(routerPrefix, route || '') : route;
    ctx.hooksKey = hooksKey;
    AKSHOOKS.append((0, _defineProperty3.default)({}, hooksKey, { "runtime": {
        route: route,
        prefix: routerPrefix,
        path: hooksKey
      } }));
  }
}

function control_error(err, ctx) {
  var message = err.message;
  var route = ctx.routerPrefix || ctx.fkproute;
  var isAjax = ctx.fkp.isAjax();
  if (route === '404') {
    return ctx.body = '您访问的页面不存在';
  }

  var beforeError = AKSHOOKS.emit('beforeError', { err: err, ctx: ctx, isAjax: isAjax });
  if (beforeError) return beforeError;

  switch (message) {
    case '404':
      ctx.status = 404;
      console.log('========= 路由访问错误或模板文件不存在 ==========');
      console.log(err);
      break;
    default:
      console.log(err);
      break;
  }

  var afterError = AKSHOOKS.emit('afterError', { err: err, ctx: ctx, isAjax: isAjax });
  if (afterError) return afterError;
}

var existsControlFun = {};

function preRender(rt, ctx) {
  if (rt) {
    var mydata = AKSHOOKS.get();
    var context = mydata.context; // aotoo-koa-server entry instance
    var myroute = ctx.fkproute;
    var prefix = ctx.routerPrefix;
    var viewsRoot = context.state.viewsRoot;
    var absOriRoute = Path.join(viewsRoot, myroute + '.html');
    var viewsFiles = context.state.views;

    if (prefix) {
      return rt;
    }

    if (viewsFiles.indexOf(absOriRoute) > -1) {
      return rt === myroute ? rt : myroute;
    }
  }
}

init.makeRoute = makeRoute;
init.getRoute = makeRoute;
init.staticMapper = staticMapper;
init.renderPage = renderPage;
init.pages = function (_path) {
  businessPagesPath = _path;
};

module.exports = init;
//# sourceMappingURL=../../maps/fkpcore/router/index.js.map
