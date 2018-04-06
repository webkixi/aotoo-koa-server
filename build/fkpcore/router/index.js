'use strict';

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * 
 * @param {String} dir 遍历的目标目录
 * @param {String} rootpath 根目录的绝对路径
 */
var getCtrlFiles = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(dir, rootpath) {
    var _this = this;

    var __myControlFiles, dirData;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            __myControlFiles = [];
            _context2.next = 3;
            return fs.readdirAsync(dir);

          case 3:
            dirData = _context2.sent;

            dirData.map(function () {
              var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(file) {
                var _path, stat;

                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _path = Path.join(dir, file);
                        stat = fs.statSync(_path);

                        if (!stat) {
                          _context.next = 12;
                          break;
                        }

                        if (!stat.isDirectory()) {
                          _context.next = 11;
                          break;
                        }

                        _context.t0 = __myControlFiles;
                        _context.next = 7;
                        return getCtrlFiles(_path, rootpath);

                      case 7:
                        _context.t1 = _context.sent;

                        _context.t0.concat.call(_context.t0, _context.t1);

                        _context.next = 12;
                        break;

                      case 11:
                        __myControlFiles.push(_path.replace(rootpath, ''));

                      case 12:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }());
            return _context2.abrupt('return', __myControlFiles);

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getCtrlFiles(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// 预读取pages目录下的所有文件路径，并保存


/**
 * 路由分配
 * {param1} koa implement
 * {param2} map of static file
 * return rende pages
**/
var init = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(app, prefix, options) {
    var _controlPages, router, customControl;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return controlPages();

          case 2:
            _controlPages = _context4.sent;

            DEBUG('control pages === %O', _controlPages);
            router = prefix ? new Router({ prefix: prefix }) : new Router();

            if (options && _.isPlainObject(options)) {
              customControl = void 0;

              if (options.customControl) {
                customControl = options.customControl;
              }
              _.map(options, function (item, key) {
                if (_.includes(['get', 'post', 'put', 'del'], key)) {
                  if (typeof item == 'string') item = [item];
                  if (!Array.isArray(item)) return;
                  item.forEach(function (rt) {
                    if (key != 'get') {
                      if (rt != '/') {
                        router[key](rt, (customControl || forBetter(router, _controlPages)).bind(router));
                      }
                    } else {
                      router[key](rt, (customControl || forBetter(router, _controlPages)).bind(router));
                    }
                  });
                } else {
                  routeParam.forEach(function (_path) {
                    router.get(_path, (customControl || forBetter(router, _controlPages)).bind(router));
                    router.post(_path, (customControl || forBetter(router, _controlPages)).bind(router));
                  });
                }
              });
            } else {
              routeParam.forEach(function (item) {
                router.get(item, forBetter(router, _controlPages));
                if (item != '/') {
                  router.post(item, forBetter(router, _controlPages));
                }
              });
            }
            app.use(router.routes());
            app.use(router.allowedMethods());

          case 8:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function init(_x4, _x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();

/**
 * 路由配置
 * {param1} koa implement
 * {param2} map of static file
 * return rende pages
**/
var dealwithRoute = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(ctx, _mapper, ctrlPages) {
    var isRender, route, routerPrefix, pageData;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            isRender = filterRendeFile(ctx.params, ctx.url);
            route = isRender ? makeRoute(ctx) : false;

            if (route) {
              _context6.next = 5;
              break;
            }

            throw 'route配置不正确';

          case 5:
            ctx.fkproute = route;
            routerPrefix = this.opts.prefix;

            ctx.routerPrefix = routerPrefix;
            myStore.append({
              route: {
                runtime: {
                  route: route,
                  prefix: routerPrefix
                }
              }
            });
            DEBUG('dealwithRoute route = %s', route);
            DEBUG('dealwithRoute routerPrefix = %s', routerPrefix);

            pageData = staticMapper(ctx, _mapper, route, routerPrefix);

            if (pageData) {
              _context6.next = 14;
              break;
            }

            throw 'mapper数据不正确';

          case 14:
            return _context6.abrupt('return', distribute.call(ctx, route, pageData, ctrlPages, this));

          case 17:
            _context6.prev = 17;
            _context6.t0 = _context6['catch'](0);

            DEBUG('dealwithRoute error = %O', _context6.t0);
            // console.log(e);
            // return ctx.redirect('404')

          case 20:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[0, 17]]);
  }));

  return function dealwithRoute(_x9, _x10, _x11) {
    return _ref6.apply(this, arguments);
  };
}();

// 分发路由


var distribute = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(route, pageData, ctrlPages, routerInstance) {
    var _ref8, _ref9, pdata, rt;

    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return controler(this, route, pageData, ctrlPages, routerInstance);

          case 2:
            _ref8 = _context7.sent;
            _ref9 = (0, _slicedToArray3.default)(_ref8, 2);
            pdata = _ref9[0];
            rt = _ref9[1];
            _context7.next = 8;
            return renderPage(this, rt, pdata);

          case 8:
            return _context7.abrupt('return', _context7.sent);

          case 9:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function distribute(_x12, _x13, _x14, _x15) {
    return _ref7.apply(this, arguments);
  };
}();

var controler = function () {
  var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(ctx, route, pageData, ctrlPages, routerInstance) {
    var routerPrefix, ctrl, passAccess, xData, controlFile, prefixRootFile, prefixIndexFile, prefixCatFile, paramsCatFile, xRoute, apilist, isAjax;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            routerPrefix = routerInstance.opts.prefix;

            if (_.isString(routerPrefix) && routerPrefix.indexOf('/') == 0) {
              routerPrefix = routerPrefix.replace('/', '');
            }

            _context8.prev = 2;
            ctrl = control(route, ctx, pageData, routerInstance);
            passAccess = false;

            if (!ctrl.initStat) {
              _context8.next = 12;
              break;
            }

            _context8.next = 8;
            return ctrl.run(ctx);

          case 8:
            pageData = _context8.sent;

            route = ctrl.store.route || route;
            _context8.next = 48;
            break;

          case 12:
            xData = false;
            // 根据route匹配到control文件+三层路由

            controlFile = Path.sep + route + '.js';

            if (!(ctrlPages.indexOf(controlFile) > -1)) {
              _context8.next = 20;
              break;
            }

            _context8.next = 17;
            return getctrlData([businessPagesPath + '/' + route], route, ctx, pageData, ctrl);

          case 17:
            xData = _context8.sent;
            _context8.next = 36;
            break;

          case 20:
            if (!routerPrefix) {
              _context8.next = 30;
              break;
            }

            route = routerPrefix;
            prefixRootFile = Path.join(businessPagesPath, routerPrefix);
            prefixIndexFile = Path.join(businessPagesPath, routerPrefix, '/index');
            prefixCatFile = Path.join(businessPagesPath, routerPrefix, ctx.params.cat || '');
            _context8.next = 27;
            return getctrlData([prefixCatFile, prefixIndexFile, prefixRootFile], route, ctx, pageData, ctrl);

          case 27:
            xData = _context8.sent;
            _context8.next = 36;
            break;

          case 30:
            if (!ctx.params.cat) {
              _context8.next = 36;
              break;
            }

            paramsCatFile = Path.join(businessPagesPath, ctx.params.cat);
            xRoute = ctx.params.cat;
            _context8.next = 35;
            return getctrlData([paramsCatFile], xRoute, ctx, pageData, ctrl);

          case 35:
            xData = _context8.sent;

          case 36:
            if (xData) {
              _context8.next = 46;
              break;
            }

            apilist = Fetch.apilist;

            if (!(apilist.list[route] || route === 'redirect')) {
              _context8.next = 45;
              break;
            }

            passAccess = true;
            _context8.next = 42;
            return getctrlData(['./passaccesscontrol'], route, ctx, pageData, ctrl);

          case 42:
            xData = _context8.sent;
            _context8.next = 46;
            break;

          case 45:
            xData = { nomatch: true };

          case 46:
            isAjax = ctx.fkp.isAjax();

            if (passAccess || isAjax) pageData = xData;

          case 48:
            return _context8.abrupt('return', [pageData, route]);

          case 51:
            _context8.prev = 51;
            _context8.t0 = _context8['catch'](2);

            DEBUG('controler error = %O', _context8.t0);
            // console.log(e.stack);

          case 54:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this, [[2, 51]]);
  }));

  return function controler(_x16, _x17, _x18, _x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();

// match的control文件，并返回数据


var getctrlData = function () {
  var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(_path, route, ctx, _pageData, ctrl) {
    var _names, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _filename, _stat, controlConfig;

    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            _names = [];

            ctrl.set('route', route);

            if (!Array.isArray(_path)) {
              _context9.next = 23;
              break;
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context9.prev = 7;

            for (_iterator = (0, _getIterator3.default)(_path); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              _filename = _step.value;

              _filename = Path.resolve(__dirname, _filename + '.js');
              if (fs.existsSync(_filename)) {
                _stat = fs.statSync(_filename);

                if (_stat && _stat.isFile()) _names.push(_filename);
              }
            }
            _context9.next = 15;
            break;

          case 11:
            _context9.prev = 11;
            _context9.t0 = _context9['catch'](7);
            _didIteratorError = true;
            _iteratorError = _context9.t0;

          case 15:
            _context9.prev = 15;
            _context9.prev = 16;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 18:
            _context9.prev = 18;

            if (!_didIteratorError) {
              _context9.next = 21;
              break;
            }

            throw _iteratorError;

          case 21:
            return _context9.finish(18);

          case 22:
            return _context9.finish(15);

          case 23:
            if (!_names.length) {
              _context9.next = 30;
              break;
            }

            controlConfig = require(_names[0]).getData.call(ctx, _pageData);
            _context9.next = 27;
            return ctrl.run(ctx, controlConfig);

          case 27:
            _pageData = _context9.sent;
            _context9.next = 31;
            break;

          case 30:
            _pageData = false;

          case 31:
            return _context9.abrupt('return', _pageData);

          case 34:
            _context9.prev = 34;
            _context9.t1 = _context9['catch'](0);

            DEBUG('getctrlData error = %O', _context9.t1);
            return _context9.abrupt('return', { nomatch: true });

          case 38:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this, [[0, 34], [7, 11, 15, 23], [16,, 18, 22]]);
  }));

  return function getctrlData(_x21, _x22, _x23, _x24, _x25) {
    return _ref11.apply(this, arguments);
  };
}();

// dealwith the data from controlPage
var renderPage = function () {
  var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(ctx, route, data, isAjax) {
    var getStat;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;

            DEBUG('renderPage pageData = %O', data);
            DEBUG('renderPage route = %s', route);
            route = preRender(route);
            _context10.t0 = ctx.method;
            _context10.next = _context10.t0 === 'GET' ? 7 : _context10.t0 === 'POST' ? 15 : 16;
            break;

          case 7:
            getStat = ctx.local.query._stat_;

            if (!(getStat && getStat === 'DATA' || isAjax)) {
              _context10.next = 10;
              break;
            }

            return _context10.abrupt('return', ctx.body = data);

          case 10:
            if (!(data && data.nomatch)) {
              _context10.next = 12;
              break;
            }

            throw new Error('你访问的页面/api不存在');

          case 12:
            _context10.next = 14;
            return ctx.render(route, data);

          case 14:
            return _context10.abrupt('return', _context10.sent);

          case 15:
            return _context10.abrupt('return', ctx.body = data);

          case 16:
            _context10.next = 21;
            break;

          case 18:
            _context10.prev = 18;
            _context10.t1 = _context10['catch'](0);

            if (isAjax) {
              ctx.body = {
                error: '找不到相关信息'
              };
            } else {
              ctx.body = "找不到页面，呃";
            }
            // return await ctx.render('404')

          case 21:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this, [[0, 18]]);
  }));

  return function renderPage(_x26, _x27, _x28, _x29) {
    return _ref12.apply(this, arguments);
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
var myStore = SAX('AOTOO-KOA-SERVER');
var control = require('./control').default;
fs = Promise.promisifyAll(fs);

// const businessPagesPath = '../../pages'
var businessPagesPath = '';
var ignoreStacic = ['css', 'js', 'images', 'img'];
var routeParam = ['/', '/:cat', '/:cat/:title', '/:cat/:title/:id'];

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
}function controlPages() {
  var _this2 = this;

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
      return Cache.ifid(_id, (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        var __cfile;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return getCtrlFiles(controlPagePath, controlPagePath);

              case 2:
                __cfile = _context3.sent;
                Cache.set(_id, __cfile);
                return _context3.abrupt('return', __cfile);

              case 5:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this2);
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

function forBetter(router, ctrlPages) {
  return function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(ctx, next) {
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;

              if (!(ignoreStacic.indexOf(ctx.params.cat) == -1)) {
                _context5.next = 5;
                break;
              }

              _context5.next = 4;
              return dealwithRoute.call(this, ctx, ctx.fkp.staticMapper, ctrlPages);

            case 4:
              return _context5.abrupt('return', _context5.sent);

            case 5:
              _context5.next = 10;
              break;

            case 7:
              _context5.prev = 7;
              _context5.t0 = _context5['catch'](0);

              console.log(_context5.t0.stack);

            case 10:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this, [[0, 7]]);
    }));

    return function (_x7, _x8) {
      return _ref5.apply(this, arguments);
    };
  }().bind(router);
}

function preRender(rt) {
  var mydata = myStore.get();
  var myentry = mydata.entry;
  var myroute = mydata.route.runtime.route;
  var viewsRoot = myentry.state.viewsRoot;
  var viewsFiles = myentry.state.views;
  if (rt != myroute) {
    var absOriRoute = Path.join(viewsRoot, myroute + '.html');
    if (viewsFiles.indexOf(absOriRoute) > -1) {
      return myroute;
    }
  }
  return rt;
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
