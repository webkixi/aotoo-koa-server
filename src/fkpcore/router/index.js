/**
 * Module dependencies.
 */
const DEBUG = debug('AKS:ROUTER')
let fs = require('fs');
const Promise = require('bluebird')
const glob = require('glob')
const Path = require('path')
const Url = require('url')
const Router = require('koa-router')
const md5 = require('blueimp-md5')
const AKSHOOKS = SAX('AOTOO-KOA-SERVER')
// const control = require('./control').default
const control = require('./control')
fs = Promise.promisifyAll(fs)

let businessPagesPath = ''
const ignoreStacic = ['css', 'js', 'images', 'img']

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
  url=url.replace(/\?\S*$/,'') // 避免?key=value参数影响ext判断

  url=decodeURIComponent(url)
  
  let rjson = Path.parse(url)
  let rtn = false;
  let ext = rjson.ext;
  let cat = pms.cat;

  let exts = ['.css', '.js', '.swf', '.jpg', '.jpeg', '.png', '.bmp', '.ico'];
  let tempExts = ['.html', '.shtml'];
  let noPassCat = ['css', 'js', 'img', 'imgs', 'image', 'images'];

  if (!ext) rtn = true;

  return !ext || tempExts.includes(ext)>-1 || noPassCat.includes(cat)==-1

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

const tmpletStatic = (src, type) => {
  const jspath = Aotoo.inject.public.js
  const csspath = Aotoo.inject.public.css
  if (type == 'js') {
    const jspagesrc = path_join(jspath, src)
    return '<script type="text/javascript" src="' + jspagesrc + '" ></script>'
  }
  if (type == 'css') {
    const csspagesrc = path_join(csspath, src)
    return '<link rel="stylesheet" href="' + csspagesrc + '" />'
  }
}

function staticMapper(ctx, mapper, route, routerPrefix) {
  const urlObj = Url.parse(ctx.url)
  const _id = md5(urlObj.pathname)
  
  return Cache.ifid(_id, () => {
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
    
    Cache.set(_id, pageData)
    return pageData
  })
}

function defineMyRouter(myOptions, router, prefix, customControl, controlPages) {
  const allMethods = AKSHOOKS.get().context.configs.routerOptions.allMethods
  const betterControl = customControl ? control_custrom.call(router, router, customControl) : control_mirror.call(router, router, controlPages)
  _.map(myOptions, (rules, key)=>{
    const methodKey = key.toLowerCase()
    if (allMethods.indexOf(methodKey) > -1) {
      rules = [].concat(rules)
      rules.forEach( rule=>{
        router[methodKey](rule, betterControl)
      })
    } else {
      if (prefix) {
        AKSHOOKS.append({ [prefix]: {
          [key]: rules
        }})
      }
    }
  })
}

/**
 * 路由分配
 * {param1} koa implement
 * {param2} map of static file
 * return rende pages
**/
async function init(app, prefix, options) {
  let _controlPages = await controlPages()
  const AotooConfigs = AKSHOOKS.get().context.configs
  const allMethods = AotooConfigs.routerOptions.allMethods
  const router = (()=>{
    if (prefix) {
      return new Router({prefix})
    } else {
      return new Router()
    }
  })()
  let customControl
  if (options&&options.customControl) {
    customControl = options.customControl
    delete options.customControl
  }
  const myOptions = _.merge({}, AotooConfigs.routerOptions.parameters, options)
  const betterControl = customControl ? control_custrom.call(router, router, customControl) : control_mirror.call(router, router, _controlPages)
  if (_.isPlainObject(options)) {
    defineMyRouter(myOptions, router, prefix, customControl, _controlPages)
  } else {
    _.map(myOptions, (rules, key) => {
      const methodKey = key.toLowerCase()
      if (allMethods.indexOf(methodKey) > -1) {
        rules = [].concat(rules)
        rules.forEach( rule => router[methodKey](rule, betterControl) )
      }
    })
  }
  app.use(router.routes())
  app.use(router.allowedMethods())
}

function control_custrom(router, myControl) {
  return async function(ctx, next){
    try {
      control_ctx_variable(ctx, router)
      if (ctx.fkproute) {
        return await myControl.call(router, ctx, next)
      }
    } catch (err) {
      return control_error(err, ctx)
    }
  }.bind(this)
}

function control_mirror(router, ctrlPages) {
  return async function(ctx, next){
    const isAjax = ctx.fkp.isAjax(ctx)
    try {
      control_ctx_variable(ctx, router)
      if (ctx.fkproute) {
        let pageData = staticMapper(ctx, ctx.fkp.staticMapper, ctx.fkproute, ctx.routerPrefix)
        if (pageData) {
          let [pdata, rt, xdata, hitControlFile] = await controler(ctx, ctx.fkproute, pageData, ctrlPages, router)
          rt = preRender(rt, ctx)
          // return await renderPage(ctx, rt, pdata)
          if (xdata) {
            if (hitControlFile) {
              return await renderPage(ctx, rt, pdata)
            }
          } else {
            if (!hitControlFile) {
              return await renderPage(ctx, rt, pdata)
            }
          }
        }
      }
    } catch (err) {
      return control_error(err, ctx)
    }
  }.bind(this)
}

function control_ctx_variable(ctx, router) {
  let routerPrefix = router.opts.prefix
  let isRender = filterRendeFile(ctx.params, ctx.url)
  let route = isRender ? makeRoute(ctx) : false
  DEBUG('router path = %s', route)
  DEBUG('router prefix = %s', routerPrefix)
  if (route) {
    ctx.fkproute = ctx.aotooRoutePath = route
    ctx.routerPrefix = ctx.aotooRoutePrefix = routerPrefix
    const hooksKey = routerPrefix ? Path.join(routerPrefix, route||'') : route
    ctx.hooksKey = hooksKey
    AKSHOOKS.append({
      [hooksKey]: { "runtime": {
        route: route,
        prefix: routerPrefix,
        path: hooksKey
      }}
    })
  }
}

function control_error(err, ctx) {
  const message = err.message
  const route = ctx.routerPrefix || ctx.fkproute
  const isAjax = ctx.fkp.isAjax(ctx)
  if (route === '404') {
    return ctx.body = '您访问的页面不存在'
  }

  const beforeError = AKSHOOKS.emit('beforeError', {err, ctx, isAjax})
  if (beforeError) return beforeError

  switch (message) {
    case '404':
      ctx.status = 404
      console.log('========= 路由访问错误或模板文件不存在 ==========')
      console.log(err)
      break;
    default:
      console.log(err)
      break;
  }

  const afterError = AKSHOOKS.emit('afterError', {err, ctx, isAjax})
  if (afterError) return afterError
}


async function controler(ctx, route, pageData, ctrlPages, routerInstance) {
  let xData = undefined
  let hitControlFile = false
  let passAccess = false
  let isAjax = ctx.fkp.isAjax(ctx)
  let routerPrefix = routerInstance.opts.prefix
  if (_.isString(routerPrefix) && routerPrefix.indexOf('/') == 0) {
    routerPrefix = routerPrefix.replace('/', '')
  }
  // 根据route匹配到control文件+三层路由
  const controlFile = Path.sep + route + '.js'
  if (ctrlPages.indexOf(controlFile) > -1) {
    hitControlFile = true
    xData = await getctrlData([businessPagesPath + '/' + route], route, ctx, pageData, routerInstance)
  }
  // 根据prefix匹配到control文件+三层路由
  else if (routerPrefix) {
    route = routerPrefix
    const hitedControlFile = []
    const controlFile = Path.join(Path.sep, routerPrefix)
    const controlIndexFile = Path.join(Path.sep, routerPrefix, 'index')
    const controlCatFile = Path.join(Path.sep, routerPrefix, (ctx.params.cat||''))
    Array.forEach([controlFile, controlIndexFile, controlCatFile], item => {
      const item_file = item + '.js'
      if (ctrlPages.indexOf(item_file) > -1) {
        hitControlFile = true
        hitedControlFile.push(Path.join(businessPagesPath, item))
      }
    })
    
    xData = await getctrlData(hitedControlFile, route, ctx, pageData, routerInstance)
  }
  // pages根目录+三层路由
  else {
    if (ctx.params.cat) {
      let paramsCatFile = Path.join(businessPagesPath, ctx.params.cat)
      let controlFile = paramsCatFile+'.js'
      const xRoute = ctx.params.cat
      if (existsControlFun[controlFile] || fs.existsSync(controlFile)) {
        hitControlFile = true
      }
      xData = await getctrlData([paramsCatFile], xRoute, ctx, pageData, routerInstance)
    }
  }
  // 根据 Fetch.apilist 匹配到api接口，从远程借口拿去数据
  if (!xData) {
    let apilist = Fetch.apilist
    if (apilist.list[route] || route === 'redirect') {
      passAccess = true
      hitControlFile = true
      xData = await getctrlData(['./passaccesscontrol'], route, ctx, pageData, routerInstance)
    }
  }
  
  // xData = { nomatch: true }
  // if (passAccess || isAjax) pageData = xData
  // return [pageData, route]
  
  pageData = xData || pageData
  return [pageData, route, xData, hitControlFile]
}

var existsControlFun = {}
// match的control文件，并返回数据
async function getctrlData(_path, route, ctx, _pageData, routerInstance) {
  let _names = []
  if (Array.isArray(_path)) {
    for (let _filename of _path) {
      _filename = Path.resolve(__dirname, _filename + '.js')
      _names.push(_filename)
    }
  }

  if (existsControlFun[_names[0]]) {
    const controlFun = existsControlFun[_names[0]]
    const controlConfig = controlFun ? controlFun.call(ctx, _pageData) : undefined
    if (controlConfig) {
      return await control(route, ctx, _pageData, routerInstance, controlConfig)
    } else {
      throw new Error('控制器文件不符合规范')
    }
  }

  if (fs.existsSync(_names[0])) {
    const controlModule = require(_names[0])
    if (controlModule) {
      const controlFun = typeof controlModule == 'function' 
      ? controlModule 
      : controlModule.getData && controlModule.getData && typeof controlModule.getData == 'function' 
      ? controlModule.getData 
      : undefined

      if (controlFun) {
        existsControlFun[_names[0]] = controlFun
        const controlConfig = controlFun ? controlFun.call(ctx, _pageData) : undefined
        if (controlConfig) {
          _pageData = await control(route, ctx, _pageData, routerInstance, controlConfig)
        } else {
          throw new Error('控制器文件不符合规范')
        }
      }
    } else {
      _pageData = undefined
    }
  } else {
    _pageData = undefined
  }
  DEBUG('getctrlData return = %O', _pageData)
  return _pageData
}

function preRender(rt, ctx) {
  if (rt) {
    const mydata = AKSHOOKS.get()
    const context = mydata.context   // aotoo-koa-server entry instance
    const myroute = ctx.fkproute
    const prefix = ctx.routerPrefix
    const viewsRoot = context.state.viewsRoot
    const absOriRoute = Path.join(viewsRoot, myroute + '.html')
    const viewsFiles = context.state.views
  
    if (prefix) {
      return rt
    }
  
    if (viewsFiles.indexOf(absOriRoute)>-1) {
      return rt === myroute ? rt : myroute
    }
  }
}

// dealwith the data from controlPage
async function renderPage(ctx, route, data) {
  const isAjax = ctx.fkp.isAjax(ctx)
  data = AKSHOOKS.emit('beforeRender', data) || data
  switch (ctx.method) {
    case 'GET':
      if (isAjax) return ctx.body = data
      if (route) {
        return await ctx.render(route, data)
      } else {
        throw new Error(`${ctx.url} not found`) // 路由访问错误或模板文件不存在
      }
    case 'POST':
      return ctx.body = data
  }

  // try {
  //   DEBUG('renderPage pageData = %O', data)
  //   DEBUG('renderPage route = %s', route)
  //   route = preRender(route, ctx)
  //   if (route) {
  //     data = AKSHOOKS.emit('pageWillRender', data) || data
  //     switch (ctx.method) {
  //       case 'GET':
  //         if (isAjax) return ctx.body = data
  //         return await ctx.render(route+'.html', data)
  //       case 'POST':
  //         return ctx.body = data
  //     }
  //   } else {
  //     throw new Error('路由访问错误或模板文件不存在')
  //   }
  // } catch (e) {
  //   console.log(e);
  //   AKSHOOKS.emit('pageRenderError', { err: e, isAjax, ctx })
  //   if (isAjax) {
  //     ctx.body = {
  //       error: 'node - 找不到相关信息'
  //     }
  //   } else {
  //     ctx.status = 404
  //     if (route == '404') {
  //       ctx.body = '您访问的页面不存在!'
  //     } else {
  //       if (AKSHOOKS.hasOn('404')) {
  //         return await AKSHOOKS.emit('404', ctx)
  //       }
  //       return await ctx.redirect('/404')
  //     }
  //     // return await ctx.render('404')
  //   }
  // }
}

init.makeRoute = makeRoute
init.getRoute = makeRoute
init.staticMapper = staticMapper
init.renderPage = renderPage
init.pages = function (_path) {
  businessPagesPath = _path
}

module.exports = init
