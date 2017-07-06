'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * 路由分配
 * {param1} koa implement
 * {param2} map of static file
 * return rende pages
**/
var init = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(app) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var forBetter = function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
        var ignoreStacic;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                ignoreStacic = ['css', 'js', 'images', 'img'];

                if (!(ignoreStacic.indexOf(ctx.params.cat) > -1)) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt('return');

              case 4:
                _context.next = 6;
                return dealwithRoute.call(this, ctx, ctx.fkp.staticMapper, _controlPages);

              case 6:
                return _context.abrupt('return', _context.sent);

              case 9:
                _context.prev = 9;
                _context.t0 = _context['catch'](0);

                console.log(_context.t0.stack);

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 9]]);
      }));

      return function forBetter(_x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }();

    var options = arguments[2];

    var _controlPages, router, routeParam, customControl;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return controlPages();

          case 2:
            _controlPages = _context2.sent;
            router = prefix ? new Router({ prefix: prefix }) : new Router();
            routeParam = ['/', '/:cat', '/:cat/:title', '/:cat/:title/:id'];

            if (options && _.isPlainObject(options)) {
              customControl = false;

              if (options.customControl) {
                customControl = options.customControl;
              }
              _.map(options, function (item, key) {
                if (_.includes(['get', 'post', 'put', 'del'], key)) {
                  if (typeof item == 'string') item = [item];
                  if (!Array.isArray(item)) return;
                  item.map(function (rt) {
                    if (key != 'get' && rt.indexOf('p1') == -1) {
                      router[key](rt, (customControl || forBetter).bind(router));
                    } else {
                      router[key](rt, (customControl || forBetter).bind(router));
                    }
                  });
                } else {
                  routeParam.map(function (_path) {
                    router.get(_path, (customControl || forBetter).bind(router));
                    router.post(_path, (customControl || forBetter).bind(router));
                  });
                }
              });
            } else {
              routeParam.map(function (item) {
                router.get(item, forBetter.bind(router));
                if (item != '/') {
                  router.post(item, forBetter.bind(router));
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

  return function init(_x) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * 路由配置
 * {param1} koa implement
 * {param2} map of static file
 * return rende pages
**/


var dealwithRoute = function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx, _mapper, ctrlPages) {
    var isRender, route, routerPrefix, pageData;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            isRender = filterRendeFile(ctx.params, ctx.url);
            route = isRender ? makeRoute(ctx) : false;

            if (!(!isRender || !route)) {
              _context3.next = 5;
              break;
            }

            throw 'route配置不正确';

          case 5:
            ctx.fkproute = route;
            routerPrefix = this.opts.prefix;
            pageData = staticMapper(ctx, _mapper, route, routerPrefix);

            if (!(!_mapper || !pageData)) {
              _context3.next = 10;
              break;
            }

            throw 'mapper数据不正确';

          case 10:
            return _context3.abrupt('return', distribute.call(ctx, route, pageData, ctrlPages, this));

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3['catch'](0);

            console.log(_context3.t0);
            // return ctx.redirect('404')

          case 16:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 13]]);
  }));

  return function dealwithRoute(_x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();

// 分发路由


var distribute = function () {
  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(route, pageData, ctrlPages, routerInstance) {
    var _ref5, _ref6, pdata, rt;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return controler(this, route, pageData, ctrlPages, routerInstance);

          case 2:
            _ref5 = _context4.sent;
            _ref6 = _slicedToArray(_ref5, 2);
            pdata = _ref6[0];
            rt = _ref6[1];
            _context4.next = 8;
            return renderPage(this, rt, pdata);

          case 8:
            return _context4.abrupt('return', _context4.sent);

          case 9:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function distribute(_x8, _x9, _x10, _x11) {
    return _ref4.apply(this, arguments);
  };
}();

// match的control文件，并返回数据


var getctrlData = function () {
  var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(_path, route, ctx, _pageData, ctrl) {
    var _names, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _filename, _stat, controlConfig;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _names = [];

            ctrl.set('route', route);

            if (!Array.isArray(_path)) {
              _context5.next = 23;
              break;
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context5.prev = 7;

            for (_iterator = _path[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              _filename = _step.value;

              _filename = Path.resolve(__dirname, _filename + '.js');
              if (fs.existsSync(_filename)) {
                _stat = fs.statSync(_filename);

                if (_stat && _stat.isFile()) _names.push(_filename);
              }
            }
            _context5.next = 15;
            break;

          case 11:
            _context5.prev = 11;
            _context5.t0 = _context5['catch'](7);
            _didIteratorError = true;
            _iteratorError = _context5.t0;

          case 15:
            _context5.prev = 15;
            _context5.prev = 16;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 18:
            _context5.prev = 18;

            if (!_didIteratorError) {
              _context5.next = 21;
              break;
            }

            throw _iteratorError;

          case 21:
            return _context5.finish(18);

          case 22:
            return _context5.finish(15);

          case 23:
            if (!_names.length) {
              _context5.next = 30;
              break;
            }

            controlConfig = require(_names[0]).getData.call(ctx, _pageData);
            _context5.next = 27;
            return ctrl.run(ctx, controlConfig);

          case 27:
            _pageData = _context5.sent;
            _context5.next = 31;
            break;

          case 30:
            _pageData = false;

          case 31:
            return _context5.abrupt('return', _pageData);

          case 34:
            _context5.prev = 34;
            _context5.t1 = _context5['catch'](0);
            return _context5.abrupt('return', { nomatch: true });

          case 37:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[0, 34], [7, 11, 15, 23], [16,, 18, 22]]);
  }));

  return function getctrlData(_x12, _x13, _x14, _x15, _x16) {
    return _ref7.apply(this, arguments);
  };
}();

var controler = function () {
  var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(ctx, route, pageData, ctrlPages, routerInstance) {
    var routerPrefix, ctrl, passAccess, xData, controlFile, prefixIndexFile, prefixCatFile, paramsCatFile, xRoute, apilist;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            routerPrefix = routerInstance.opts.prefix;

            if (_.isString(routerPrefix) && routerPrefix.indexOf('/') == 0) routerPrefix = routerPrefix.replace('/', '');

            _context6.prev = 2;
            ctrl = control(route, ctx, pageData);
            passAccess = false;

            if (!ctrl.initStat) {
              _context6.next = 12;
              break;
            }

            _context6.next = 8;
            return ctrl.run(ctx);

          case 8:
            pageData = _context6.sent;

            route = ctrl.store.route || route;
            _context6.next = 46;
            break;

          case 12:
            xData = false;
            // 根据route匹配到control文件+三层路由

            controlFile = Path.sep + route + '.js';

            if (!(ctrlPages.indexOf(controlFile) > -1)) {
              _context6.next = 20;
              break;
            }

            _context6.next = 17;
            return getctrlData([businessPagesPath + '/' + route], route, ctx, pageData, ctrl);

          case 17:
            xData = _context6.sent;
            _context6.next = 35;
            break;

          case 20:
            if (!routerPrefix) {
              _context6.next = 29;
              break;
            }

            route = routerPrefix;
            prefixIndexFile = Path.join(businessPagesPath, routerPrefix, '/index');
            prefixCatFile = Path.join(businessPagesPath, routerPrefix, ctx.params.cat || '');
            _context6.next = 26;
            return getctrlData([prefixIndexFile, prefixCatFile], route, ctx, pageData, ctrl);

          case 26:
            xData = _context6.sent;
            _context6.next = 35;
            break;

          case 29:
            if (!ctx.params.cat) {
              _context6.next = 35;
              break;
            }

            paramsCatFile = Path.join(businessPagesPath, ctx.params.cat);
            xRoute = ctx.params.cat;
            _context6.next = 34;
            return getctrlData([paramsCatFile], xRoute, ctx, pageData, ctrl);

          case 34:
            xData = _context6.sent;

          case 35:
            if (xData) {
              _context6.next = 45;
              break;
            }

            apilist = Fetch.apilist;

            if (!(apilist.list[route] || route === 'redirect')) {
              _context6.next = 44;
              break;
            }

            passAccess = true;
            _context6.next = 41;
            return getctrlData(['./passaccesscontrol'], route, ctx, pageData, ctrl);

          case 41:
            xData = _context6.sent;
            _context6.next = 45;
            break;

          case 44:
            xData = { nomatch: true };

          case 45:
            if (passAccess) pageData = xData;

          case 46:
            return _context6.abrupt('return', [pageData, route]);

          case 49:
            _context6.prev = 49;
            _context6.t0 = _context6['catch'](2);

            console.log(_context6.t0.stack);

          case 52:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[2, 49]]);
  }));

  return function controler(_x17, _x18, _x19, _x20, _x21) {
    return _ref8.apply(this, arguments);
  };
}();

// dealwith the data from controlPage


var renderPage = function () {
  var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(ctx, route, data, isAjax) {
    var getStat;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.t0 = ctx.method;
            _context7.next = _context7.t0 === 'GET' ? 4 : _context7.t0 === 'POST' ? 12 : 13;
            break;

          case 4:
            getStat = ctx.local.query._stat_;

            if (!(getStat && getStat === 'DATA' || isAjax)) {
              _context7.next = 7;
              break;
            }

            return _context7.abrupt('return', ctx.body = data);

          case 7:
            if (!(data && data.nomatch)) {
              _context7.next = 9;
              break;
            }

            throw new Error('你访问的页面/api不存在');

          case 9:
            _context7.next = 11;
            return ctx.render(route, data);

          case 11:
            return _context7.abrupt('return', _context7.sent);

          case 12:
            return _context7.abrupt('return', ctx.body = data);

          case 13:
            _context7.next = 18;
            break;

          case 15:
            _context7.prev = 15;
            _context7.t1 = _context7['catch'](0);

            if (isAjax) {
              ctx.body = {
                error: '找不到相关信息'
              };
            } else {
              ctx.body = "<div>找不到页面，呃！</div>";
            }
            // return await ctx.render('404')

          case 18:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this, [[0, 15]]);
  }));

  return function renderPage(_x22, _x23, _x24, _x25) {
    return _ref9.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Module dependencies.
 */
var fs = require('fs');
var Path = require('path');
var Url = require('url');
var Router = require('koa-router');
var md5 = require('blueimp-md5');
var control = require('./control').default;
// const businessPagesPath = '../../pages'
var businessPagesPath = '';

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

  if (_.indexOf(tempExts, ext) > -1) rtn = true;
  if (_.indexOf(noPassCat, cat) > -1) rtn = false;

  return rtn;
}

// 预读取pages目录下的所有文件路径，并保存
function controlPages() {
  // const businessPages = Path.join(__dirname, businessPagesPath)
  var businessPages = businessPagesPath;
  if (!fs.existsSync(businessPages)) {
    fs.mkdirSync(businessPages, '0777');
  }
  var controlPagePath = businessPages;
  var _id = controlPagePath;
  var ctrlFiles = [];
  return Cache.ifid(_id, function () {
    return new Promise(function (res, rej) {
      return function getCtrlFiles(dir) {
        fs.readdir(dir, function (err, data) {
          if (err) throw err;
          data.map(function (file) {
            var _path = Path.join(dir, file);
            var stat = fs.statSync(_path);
            if (stat && stat.isDirectory()) return getCtrlFiles(_path);
            var okPath = _path.replace(controlPagePath, '');
            ctrlFiles.push(Path.join(okPath));
          }); // end map
          Cache.set(_id, ctrlFiles);
          res(ctrlFiles);
        });
      }(controlPagePath);
    });
  });
}

function makeRoute(ctx, prefix) {
  var params = ctx.params;
  var _url = ctx.url;
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
    route = gtpy(cat) === 'number' ? CONFIG.root || 'index' : cat;
  } else {
    route = CONFIG.root || 'index';
  }
  if (ctxurl && route !== ctxurl) route = ctxurl;
  if (prefix) route = prefix.indexOf('/') == 0 ? prefix.substring(1) : prefix;
  return route;
}

function staticMapper(ctx, mapper, route, routerPrefix) {
  var tmpletStatic = function tmpletStatic(src, type) {
    if (type == 'js') {
      return '<script type="text/javascript" src="/js/' + src + '" ></script>';
    }
    if (type == 'css') {
      return '<link rel="stylesheet" href="/css/' + src + '" />';
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
  };if (mapper.css[route]) pageData.pagecss = tmpletStatic(mapper.css[route], 'css');
  if (mapper.js[route]) pageData.pagejs = tmpletStatic(mapper.js[route], 'js');

  var _route = route;
  if (routerPrefix) {
    _route = routerPrefix;
    if (mapper.css[_route]) pageData.pagecss = tmpletStatic(mapper.css[_route], 'css');
    if (mapper.js[_route]) pageData.pagejs = tmpletStatic(mapper.js[_route], 'js');
  }

  return pageData;
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
