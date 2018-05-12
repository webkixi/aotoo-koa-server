'use strict';

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _forEach = require('babel-runtime/core-js/array/for-each');

var _forEach2 = _interopRequireDefault(_forEach);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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
    var _controlPages, router, customControl;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return controlPages();

          case 2:
            _controlPages = _context2.sent;

            DEBUG('control pages === %O', _controlPages);
            router = prefix ? new Router({ prefix: prefix }) : new Router();

            if (options && _.isPlainObject(options)) {
              customControl = void 0;

              if (options.customControl) {
                customControl = myCustomControl(options.customControl);
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
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function init(_x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * 路由配置
 * {param1} koa implement
 * {param2} map of static file
 * return rende pages
**/
var dealwithRoute = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(ctx, _mapper, ctrlPages) {
    var isRender, route, routerPrefix, pageData;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            isRender = filterRendeFile(ctx.params, ctx.url);
            route = isRender ? makeRoute(ctx) : false;

            if (route) {
              _context5.next = 5;
              break;
            }

            throw 'route配置不正确';

          case 5:
            ctx.fkproute = route;
            routerPrefix = this.opts.prefix;

            ctx.routerPrefix = routerPrefix;
            AKSHOOKS.append({
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
              _context5.next = 14;
              break;
            }

            throw 'mapper数据不正确';

          case 14:
            return _context5.abrupt('return', distribute.call(ctx, route, pageData, ctrlPages, this));

          case 17:
            _context5.prev = 17;
            _context5.t0 = _context5['catch'](0);

            DEBUG('dealwithRoute error = %O', _context5.t0);
            // console.log(e);

          case 20:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[0, 17]]);
  }));

  return function dealwithRoute(_x9, _x10, _x11) {
    return _ref5.apply(this, arguments);
  };
}();

// 分发路由


var distribute = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(route, pageData, ctrlPages, routerInstance) {
    var _ref7, _ref8, pdata, rt;

    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return controler(this, route, pageData, ctrlPages, routerInstance);

          case 3:
            _ref7 = _context6.sent;
            _ref8 = (0, _slicedToArray3.default)(_ref7, 2);
            pdata = _ref8[0];
            rt = _ref8[1];
            _context6.next = 9;
            return renderPage(this, rt, pdata);

          case 9:
            return _context6.abrupt('return', _context6.sent);

          case 12:
            _context6.prev = 12;
            _context6.t0 = _context6['catch'](0);

            DEBUG('dealwithRoute error = %O', _context6.t0);
            _context6.next = 17;
            return renderPage(this, null, null);

          case 17:
            return _context6.abrupt('return', _context6.sent);

          case 18:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[0, 12]]);
  }));

  return function distribute(_x12, _x13, _x14, _x15) {
    return _ref6.apply(this, arguments);
  };
}();

var controler = function () {
  var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(ctx, route, pageData, ctrlPages, routerInstance) {
    var routerPrefix, passAccess, xData, controlFile, hitedControlFile, _controlFile, controlIndexFile, controlCatFile, paramsCatFile, xRoute, apilist, isAjax;

    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            routerPrefix = routerInstance.opts.prefix;

            if (_.isString(routerPrefix) && routerPrefix.indexOf('/') == 0) {
              routerPrefix = routerPrefix.replace('/', '');
            }

            _context7.prev = 2;
            passAccess = false;
            xData = undefined;
            // 根据route匹配到control文件+三层路由

            controlFile = Path.sep + route + '.js';

            if (!(ctrlPages.indexOf(controlFile) > -1)) {
              _context7.next = 12;
              break;
            }

            _context7.next = 9;
            return getctrlData([businessPagesPath + '/' + route], route, ctx, pageData, routerInstance);

          case 9:
            xData = _context7.sent;
            _context7.next = 30;
            break;

          case 12:
            if (!routerPrefix) {
              _context7.next = 24;
              break;
            }

            route = routerPrefix;
            // let prefixRootFile = Path.join(businessPagesPath, routerPrefix)
            // let prefixIndexFile = Path.join(businessPagesPath, routerPrefix, '/index')
            // let prefixCatFile = Path.join(businessPagesPath, routerPrefix, ctx.params.cat || '')
            // xData = await getctrlData([prefixCatFile, prefixIndexFile, prefixRootFile], route, ctx, pageData, routerInstance)

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

            _context7.next = 21;
            return getctrlData(hitedControlFile, route, ctx, pageData, routerInstance);

          case 21:
            xData = _context7.sent;
            _context7.next = 30;
            break;

          case 24:
            if (!ctx.params.cat) {
              _context7.next = 30;
              break;
            }

            paramsCatFile = Path.join(businessPagesPath, ctx.params.cat);
            xRoute = ctx.params.cat;
            _context7.next = 29;
            return getctrlData([paramsCatFile], xRoute, ctx, pageData, routerInstance);

          case 29:
            xData = _context7.sent;

          case 30:
            if (xData) {
              _context7.next = 40;
              break;
            }

            apilist = Fetch.apilist;

            if (!(apilist.list[route] || route === 'redirect')) {
              _context7.next = 39;
              break;
            }

            passAccess = true;
            _context7.next = 36;
            return getctrlData(['./passaccesscontrol'], route, ctx, pageData, routerInstance);

          case 36:
            xData = _context7.sent;
            _context7.next = 40;
            break;

          case 39:
            xData = { nomatch: true };

          case 40:
            isAjax = ctx.fkp.isAjax();

            if (passAccess || isAjax) pageData = xData;
            return _context7.abrupt('return', [pageData, route]);

          case 45:
            _context7.prev = 45;
            _context7.t0 = _context7['catch'](2);

            DEBUG('controler error = %O', _context7.t0);
            // console.log(e.stack);

          case 48:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this, [[2, 45]]);
  }));

  return function controler(_x16, _x17, _x18, _x19, _x20) {
    return _ref9.apply(this, arguments);
  };
}();

// match的control文件，并返回数据
var getctrlData = function () {
  var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(_path, route, ctx, _pageData, routerInstance) {
    var _names, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _filename, controlFun, controlConfig, controlModule, _controlFun, _controlConfig;

    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            // try {
            _names = [];

            if (!Array.isArray(_path)) {
              _context8.next = 21;
              break;
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context8.prev = 5;

            for (_iterator = (0, _getIterator3.default)(_path); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              _filename = _step.value;

              _filename = Path.resolve(__dirname, _filename + '.js');
              _names.push(_filename);
            }
            _context8.next = 13;
            break;

          case 9:
            _context8.prev = 9;
            _context8.t0 = _context8['catch'](5);
            _didIteratorError = true;
            _iteratorError = _context8.t0;

          case 13:
            _context8.prev = 13;
            _context8.prev = 14;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 16:
            _context8.prev = 16;

            if (!_didIteratorError) {
              _context8.next = 19;
              break;
            }

            throw _iteratorError;

          case 19:
            return _context8.finish(16);

          case 20:
            return _context8.finish(13);

          case 21:
            if (!existsControlFun[_names[0]]) {
              _context8.next = 31;
              break;
            }

            controlFun = existsControlFun[_names[0]];
            controlConfig = controlFun ? controlFun.call(ctx, _pageData) : undefined;

            if (!controlConfig) {
              _context8.next = 30;
              break;
            }

            _context8.next = 27;
            return control(route, ctx, _pageData, routerInstance, controlConfig);

          case 27:
            return _context8.abrupt('return', _context8.sent);

          case 30:
            throw new Error('控制器文件不符合规范');

          case 31:
            if (!fs.existsSync(_names[0])) {
              _context8.next = 49;
              break;
            }

            controlModule = require(_names[0]);

            if (!controlModule) {
              _context8.next = 46;
              break;
            }

            _controlFun = typeof controlModule == 'function' ? controlModule : controlModule.getData && controlModule.getData && typeof controlModule.getData == 'function' ? controlModule.getData : undefined;


            existsControlFun[_names[0]] = _controlFun;
            _controlConfig = _controlFun ? _controlFun.call(ctx, _pageData) : undefined;

            if (!_controlConfig) {
              _context8.next = 43;
              break;
            }

            _context8.next = 40;
            return control(route, ctx, _pageData, routerInstance, _controlConfig);

          case 40:
            _pageData = _context8.sent;
            _context8.next = 44;
            break;

          case 43:
            throw new Error('控制器文件不符合规范');

          case 44:
            _context8.next = 47;
            break;

          case 46:
            _pageData = undefined;

          case 47:
            _context8.next = 50;
            break;

          case 49:
            _pageData = undefined;

          case 50:
            return _context8.abrupt('return', _pageData);

          case 51:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this, [[5, 9, 13, 21], [14,, 16, 20]]);
  }));

  return function getctrlData(_x21, _x22, _x23, _x24, _x25) {
    return _ref10.apply(this, arguments);
  };
}();

// dealwith the data from controlPage
var renderPage = function () {
  var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(ctx, route, data, isAjax) {
    var getStat;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;

            DEBUG('renderPage pageData = %O', data);
            DEBUG('renderPage route = %s', route);

            if (!route) {
              _context9.next = 19;
              break;
            }

            route = preRender(route, ctx);
            data = AKSHOOKS.emit('pageWillRender', data) || data;
            _context9.t0 = ctx.method;
            _context9.next = _context9.t0 === 'GET' ? 9 : _context9.t0 === 'POST' ? 16 : 17;
            break;

          case 9:
            getStat = ctx.local.query._stat_;

            if (!(getStat && getStat === 'DATA' || isAjax)) {
              _context9.next = 12;
              break;
            }

            return _context9.abrupt('return', ctx.body = data);

          case 12:
            if (data && data.nomatch) {
              console.log('你访问的页面/api不存在');
            }
            _context9.next = 15;
            return ctx.render(route, data);

          case 15:
            return _context9.abrupt('return', _context9.sent);

          case 16:
            ctx.body = data;

          case 17:
            _context9.next = 20;
            break;

          case 19:
            throw new Error('模板文件不存在');

          case 20:
            _context9.next = 41;
            break;

          case 22:
            _context9.prev = 22;
            _context9.t1 = _context9['catch'](0);

            AKSHOOKS.emit('pageRenderError', { err: _context9.t1, isAjax: isAjax, ctx: ctx });

            if (!isAjax) {
              _context9.next = 29;
              break;
            }

            ctx.body = {
              error: 'node - 找不到相关信息'
            };
            _context9.next = 41;
            break;

          case 29:
            ctx.status = 404;

            if (!(route == '404')) {
              _context9.next = 34;
              break;
            }

            ctx.body = '您访问的页面不存在!';
            _context9.next = 41;
            break;

          case 34:
            if (!AKSHOOKS.hasOn('404')) {
              _context9.next = 38;
              break;
            }

            _context9.next = 37;
            return AKSHOOKS.emit('404', ctx);

          case 37:
            return _context9.abrupt('return', _context9.sent);

          case 38:
            _context9.next = 40;
            return ctx.redirect('/404');

          case 40:
            return _context9.abrupt('return', _context9.sent);

          case 41:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this, [[0, 22]]);
  }));

  return function renderPage(_x26, _x27, _x28, _x29) {
    return _ref11.apply(this, arguments);
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

function myCustomControl(myControl) {
  return function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(ctx, next) {
      var isRender, route;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              isRender = filterRendeFile(ctx.params, ctx.url);
              route = isRender ? makeRoute(ctx) : false;

              if (route) {
                ctx.fkproute = route;
                myControl.call(this, ctx, next);
              }

            case 3:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }();
}

function forBetter(router, ctrlPages) {
  return function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(ctx, next) {
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;

              if (!(ignoreStacic.indexOf(ctx.params.cat) == -1)) {
                _context4.next = 5;
                break;
              }

              _context4.next = 4;
              return dealwithRoute.call(this, ctx, ctx.fkp.staticMapper, ctrlPages);

            case 4:
              return _context4.abrupt('return', _context4.sent);

            case 5:
              _context4.next = 10;
              break;

            case 7:
              _context4.prev = 7;
              _context4.t0 = _context4['catch'](0);

              console.log(_context4.t0.stack);

            case 10:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this, [[0, 7]]);
    }));

    return function (_x7, _x8) {
      return _ref4.apply(this, arguments);
    };
  }().bind(router);
}

var existsControlFun = {};

function preRender(rt, ctx) {
  var mydata = AKSHOOKS.get();
  var myentry = mydata.entry;
  var myroute = mydata.route.runtime.route;
  var prefix = mydata.route.runtime.prefix;
  var viewsRoot = myentry.state.viewsRoot;
  var absOriRoute = Path.join(viewsRoot, myroute + '.html');

  var viewsFiles = myentry.state.views;
  if (viewsFiles.indexOf(absOriRoute) > -1) {
    if (rt != myroute) return myroute;
    return rt;
  } else {
    if (prefix) {
      return rt;
    } else {
      throw new Error('\u6A21\u677F\u6587\u4EF6\u4E0D\u5B58\u5728\uFF0C' + absOriRoute);
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
