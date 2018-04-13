/**
 * Module dependencies.
 */
const DEBUG = debug('fkp:router')
let fs = require('fs');
const Promise = require('bluebird')
const glob = require('glob')
const Path = require('path')
const Url = require('url')
const Router = require('koa-router')
const md5 = require('blueimp-md5')
const myStore = SAX('AOTOO-KOA-SERVER')
const control = require('./control').default
fs = Promise.promisifyAll(fs)

// const businessPagesPath = '../../pages'
let businessPagesPath = ''
const ignoreStacic = ['css', 'js', 'images', 'img']
const routeParam = [
  '/',
  '/:cat',
  '/:cat/:title',
  '/:cat/:title/:id'
]

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
  let rjson = Path.parse(url)
  let rtn = false;
  let ext = rjson.ext;
  let cat = pms.cat;

  let exts = ['.css', '.js', '.swf', '.jpg', '.jpeg', '.png', '.bmp', '.ico'];
  let tempExts = ['.html', '.shtml'];
  let noPassCat = ['css', 'js', 'img', 'imgs', 'image', 'images'];

  if (!ext) rtn = true;

  return !ext || tempExts.includes(ext) || noPassCat.includes(cat)

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

function getCtrlFiles(dir, opts = {}) {
  var controlFiles = []
  if (!fs.existsSync(dir)) return;
  const stat = fs.statSync(dir)
  if (!stat.isDirectory()) return

  const _partten = /^[_\.](\w)+/;   // ?? 不兼容windows
  glob.sync(dir + '/**/*').forEach(function (item) {
    var obj = Path.parse(item)
    const xxx = _partten.test(obj.name)
    if (!xxx) {
      if (obj.ext) {
        controlFiles.push(item.replace(dir, ''))
      }
    }
  })
  return controlFiles
};

// 预读取pages目录下的所有文件路径，并保存
function controlPages() {
  // const businessPages = Path.join(__dirname, businessPagesPath)
  const businessPages = businessPagesPath

  if (!fs.existsSync(businessPages)) {
    fs.mkdirSync(businessPages, '0777')
  }

  DEBUG('businessPages %s', businessPages)
  const controlPagePath = businessPages
  const _id = controlPagePath

  try {
    if (fs.existsSync(controlPagePath)) {
      return Cache.ifid(_id, async () => {
        const __cfile = await getCtrlFiles(controlPagePath, controlPagePath); Cache.set(_id, __cfile)
        return __cfile
      })
    } else {
      throw new Error('控制层目录不存在')
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
  let params = ctx.params
  let _url = ctx.url
  const fkp = ctx.fkp
  const indexRoot = fkp.index
  ctx.local = Url.parse(ctx.url, true)

  let _ext = Path.extname(ctx.url)
  let ctxurl = ctx.url.slice(1).replace(_ext, '') || ''

  if (_url.indexOf('?') > -1) {
    _url = _url.slice(0, _url.indexOf('?'))
    ctxurl = ctxurl.slice(0, ctxurl.indexOf('?'))
  }
  let rjson = Path.parse(_url)
  let route = false
  let cat = params.cat || '', title = params.title || '', id = params.id || '';
  let gtpy = getObjType;

  if (id) {
    gtpy(id) === 'number'
      ? route = title
        ? cat + '/' + title
        : cat
      : route = cat + '/' + title + '/' + id
  }

  else if (title) {
    title = title.replace(rjson.ext, '');
    route = gtpy(title) === 'number' ? cat : cat + '/' + title
  }

  else if (cat) {
    cat = cat.replace(rjson.ext, '');
    route = gtpy(cat) === 'number' ? indexRoot || 'index' : cat
  }

  else {
    route = indexRoot || 'index'
  }
  if (ctxurl && route !== ctxurl) route = ctxurl
  if (prefix) route = prefix.indexOf('/') == 0 ? prefix.substring(1) : prefix
  if (route.lastIndexOf('/') == (route.length - 1)) {
    route = route.substring(0, route.length - 1)
  }
  return route
}

function path_join(jspath, src) {
  if (jspath.indexOf('http') == 0 || jspath.indexOf('//') == 0) {
    if (jspath.charAt(jspath.length - 1) == '/') {
      jspath = jspath.substring(0, jspath.length - 1)
    }
    if (src.charAt(0) == '/') {
      return jspath + src
    } else {
      return jspath + '/' + src
    }
  } else {
    return Path.join(jspath, src);
  }
}

function staticMapper(ctx, mapper, route, routerPrefix) {
  const jspath = Aotoo.inject.public.js
  const csspath = Aotoo.inject.public.css
  let tmpletStatic = (src, type) => {
    if (type == 'js') {
      const jspagesrc = path_join(jspath, src)
      return '<script type="text/javascript" src="' + jspagesrc + '" ></script>'
    }
    if (type == 'css') {
      const csspagesrc = path_join(csspath, src)
      return '<link rel="stylesheet" href="' + csspagesrc + '" />'
    }
  }

  if (_.isString(routerPrefix) && routerPrefix.indexOf('/') == 0) routerPrefix = routerPrefix.replace('/', '')
  if (!mapper) return false
  let pageData = {
    //静态资源
    commonjs: tmpletStatic((mapper.js.common || 'common.js'), 'js'),   //公共css
    commoncss: tmpletStatic((mapper.css.common || 'common.css'), 'css'), //公共js
    pagejs: '',
    pagecss: '',
    pagedata: {}
  }
  //静态资源初始化
  if (route.indexOf('/') == 0) route = route.substring(1)
  if (route.lastIndexOf('/') == (route.length - 1)) route = route.substring(0, route.length - 1)
  if (mapper.css[route]) pageData.pagecss = tmpletStatic(mapper.css[route], 'css')
  if (mapper.js[route]) pageData.pagejs = tmpletStatic(mapper.js[route], 'js')

  let _route = route
  if (routerPrefix) {
    _route = routerPrefix
    if (mapper.css[_route]) pageData.pagecss = tmpletStatic(mapper.css[_route], 'css')
    if (mapper.js[_route]) pageData.pagejs = tmpletStatic(mapper.js[_route], 'js')
  }

  return pageData
}

/**
 * 路由分配
 * {param1} koa implement
 * {param2} map of static file
 * return rende pages
**/
async function init(app, prefix, options) {
  let _controlPages = await controlPages()
  DEBUG('control pages === %O', _controlPages)
  const router = prefix ? new Router({ prefix: prefix }) : new Router()
  if (options && _.isPlainObject(options)) {
    let customControl
    if (options.customControl) {
      customControl = options.customControl
    }
    _.map(options, (item, key) => {
      if (_.includes(['get', 'post', 'put', 'del'], key)) {
        if (typeof item == 'string') item = [item]
        if (!Array.isArray(item)) return
        item.forEach(rt => {
          if (key != 'get') {
            if (rt != '/') {
              router[key](rt, router:: (customControl || forBetter(router, _controlPages)))
            }
          } else {
            router[key](rt, router:: (customControl || forBetter(router, _controlPages)))
          }
        })
      } else {
        routeParam.forEach(_path => {
          router.get(_path, router:: (customControl || forBetter(router, _controlPages)))
          router.post(_path, router:: (customControl || forBetter(router, _controlPages)))
        })
      }
    })
  } else {
    routeParam.forEach(item => {
      router.get(item, forBetter(router, _controlPages))
      if (item != '/') {
        router.post(item, forBetter(router, _controlPages))
      }
    })
  }
  app.use(router.routes())
  app.use(router.allowedMethods())
}

function forBetter(router, ctrlPages) {
  return async function (ctx, next) {
    try {
      if (ignoreStacic.indexOf(ctx.params.cat) == -1) {
        return await dealwithRoute.call(this, ctx, ctx.fkp.staticMapper, ctrlPages)
      }
    } catch (e) {
      console.log(e.stack)
    }
  }.bind(router)
}

/**
 * 路由配置
 * {param1} koa implement
 * {param2} map of static file
 * return rende pages
**/
async function dealwithRoute(ctx, _mapper, ctrlPages) {
  try {
    let isRender = filterRendeFile(ctx.params, ctx.url)
    let route = isRender ? makeRoute(ctx) : false
    if (!route) throw 'route配置不正确'
    ctx.fkproute = route
    let routerPrefix = this.opts.prefix
    ctx.routerPrefix = routerPrefix
    myStore.append({
      route: {
        runtime: {
          route: route,
          prefix: routerPrefix
        }
      }
    })
    DEBUG('dealwithRoute route = %s', route)
    DEBUG('dealwithRoute routerPrefix = %s', routerPrefix)

    let pageData = staticMapper(ctx, _mapper, route, routerPrefix)
    if (!pageData) throw 'mapper数据不正确'
    return ctx:: distribute(route, pageData, ctrlPages, this)
  } catch (e) {
    DEBUG('dealwithRoute error = %O', e)
    // console.log(e);
    // return ctx.redirect('404')
  }
}

// 分发路由
async function distribute(route, pageData, ctrlPages, routerInstance) {
  let [pdata, rt] = await controler(this, route, pageData, ctrlPages, routerInstance)
  return await renderPage(this, rt, pdata)
}


async function controler(ctx, route, pageData, ctrlPages, routerInstance) {
  let routerPrefix = routerInstance.opts.prefix
  if (_.isString(routerPrefix) && routerPrefix.indexOf('/') == 0) {
    routerPrefix = routerPrefix.replace('/', '')
  }

  try {
    let passAccess = false
    let xData = false
    // 根据route匹配到control文件+三层路由
    const controlFile = Path.sep + route + '.js'
    if (ctrlPages.indexOf(controlFile) > -1) {
      xData = await getctrlData([businessPagesPath + '/' + route], route, ctx, pageData, routerInstance)
    }
    // 根据prefix匹配到control文件+三层路由
    else if (routerPrefix) {
      route = routerPrefix
      // let prefixRootFile = Path.join(businessPagesPath, routerPrefix)
      // let prefixIndexFile = Path.join(businessPagesPath, routerPrefix, '/index')
      // let prefixCatFile = Path.join(businessPagesPath, routerPrefix, ctx.params.cat || '')
      // xData = await getctrlData([prefixCatFile, prefixIndexFile, prefixRootFile], route, ctx, pageData, routerInstance)

      const hitedControlFile = []
      const controlFile = Path.join(Path.sep, routerPrefix)
      const controlIndexFile = Path.join(Path.sep, routerPrefix, 'index')
      const controlCatFile = Path.join(Path.sep, routerPrefix, (ctx.params.cat||''))
      Array.forEach([controlFile, controlIndexFile, controlCatFile], item => {
        const item_file = item + '.js'
        if (ctrlPages.indexOf(item_file) > -1) {
          hitedControlFile.push(Path.join(businessPagesPath, item))
        }
      })
      
      xData = await getctrlData(hitedControlFile, route, ctx, pageData, routerInstance)
    }
    // pages根目录+三层路由
    else {
      if (ctx.params.cat) {
        let paramsCatFile = Path.join(businessPagesPath, ctx.params.cat)
        const xRoute = ctx.params.cat
        xData = await getctrlData([paramsCatFile], xRoute, ctx, pageData, routerInstance)
      }
    }
    // 根据 Fetch.apilist 匹配到api接口，从远程借口拿去数据
    if (!xData) {
      let apilist = Fetch.apilist
      if (apilist.list[route] || route === 'redirect') {
        passAccess = true
        xData = await getctrlData(['./passaccesscontrol'], route, ctx, pageData, routerInstance)
      } else {
        xData = { nomatch: true }
      }
    }
    const isAjax = ctx.fkp.isAjax()
    if (passAccess || isAjax) pageData = xData
    return [pageData, route]
  } catch (e) {
    DEBUG('controler error = %O', e)
    // console.log(e.stack);
  }
}

// match的control文件，并返回数据
async function getctrlData(_path, route, ctx, _pageData, routerInstance) {
  try {
    let _names = []
    if (Array.isArray(_path)) {
      for (let _filename of _path) {
        _filename = Path.resolve(__dirname, _filename + '.js')
        _names.push(_filename)
      }
    }
    const controlModule = require(_names[0])
    if (controlModule) {
      const controlConfig = typeof controlModule == 'function' 
      ? controlModule.call(ctx, _pageData)
        : controlModule.getData && controlModule.getData && typeof controlModule.getData == 'function'
          ? controlModule.getData.call(ctx, _pageData)
          : undefined
      
      if (controlConfig) {
        _pageData = await control(route, ctx, _pageData, routerInstance, controlConfig)
      } else {
        throw new Error('控制器文件不符合规范')
      }
    } else {
      _pageData = undefined
    }
    return _pageData
  } catch (e) {
    console.log(e);
    DEBUG('getctrlData error = %O', e)
    // return { nomatch: true }
  }
}

function preRender(rt) {
  const mydata = myStore.get()
  const myentry = mydata.entry
  const myroute = mydata.route.runtime.route
  const prefix = mydata.route.runtime.prefix
  const viewsRoot = myentry.state.viewsRoot
  const absOriRoute = Path.join(viewsRoot, myroute + '.html')

  const viewsFiles = myentry.state.views
  if (viewsFiles.indexOf(absOriRoute) > -1) {
    if (rt != myroute) return myroute
    return rt
  } else {
    if (prefix) {
      return rt
    } else {
      throw new Error(`模板文件不存在，${absOriRoute}`)
    }
  }
}

// dealwith the data from controlPage
async function renderPage(ctx, route, data, isAjax) {
  try {
    DEBUG('renderPage pageData = %O', data)
    DEBUG('renderPage route = %s', route)
    route = preRender(route)
    switch (ctx.method) {
      case 'GET':
        let getStat = ctx.local.query._stat_
        if ((getStat && getStat === 'DATA') || isAjax) return ctx.body = data
        if (data && data.nomatch) throw new Error('你访问的页面/api不存在')
        return await ctx.render(route, data)
      case 'POST':
        ctx.body = data
    }
  } catch (e) {
    console.log(e);
    if (isAjax) {
      ctx.body = {
        error: 'node - 找不到相关信息'
      }
    } else {
      return await ctx.redirect('/404')
      // ctx.body = "找不到页面，呃"
    }
    // return await ctx.render('404')
  }
}

init.makeRoute = makeRoute
init.getRoute = makeRoute
init.staticMapper = staticMapper
init.renderPage = renderPage
init.pages = function (_path) {
  businessPagesPath = _path
}

module.exports = init
