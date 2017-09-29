/**
 * Module dependencies.
 */
const DEBUG = debug('fkp:router')
const fs = require('fs');
const Path = require('path')
const Url = require('url')
const Router = require('koa-router')
const md5 = require('blueimp-md5')
const control = require('./control').default
// const businessPagesPath = '../../pages'
let businessPagesPath = ''


function getObjType(object){
  return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1].toLowerCase();
};
/**
 * 过滤渲染文件
 * {param1} {json}   this.params
 * {param2} {json}   json of parse this.path
 * return   {boleean}
**/
function filterRendeFile(pms, url){
    let rjson = Path.parse(url)
    let rtn = false;
    let ext = rjson.ext;
    let cat = pms.cat;

    let exts = ['.css','.js','.swf','.jpg','.jpeg','.png','.bmp','.ico'];
    let tempExts = ['.html','.shtml'];
    let noPassCat = ['css','js','img','imgs','image','images'];

    if(!ext) rtn = true;

    if(_.indexOf(tempExts, ext) > -1) rtn = true;
    if(_.indexOf(noPassCat, cat) > -1) rtn = false;

    return rtn;
}

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
  let ctrlFiles = []
  return Cache.ifid( _id, ()=> new Promise((res,rej)=>{
      return function getCtrlFiles(dir){
        fs.readdir(dir, (err, data) => {
          if(err) throw err
          data.map( file => {
            const _path = Path.join(dir, file)
            const stat = fs.statSync(_path)
            if (stat && stat.isDirectory()) return getCtrlFiles(_path)
            const okPath = _path.replace(controlPagePath, '')
            ctrlFiles.push(okPath)
            // ctrlFiles.push(Path.join(okPath))
          }) // end map
          Cache.set(_id, ctrlFiles)
          res(ctrlFiles)
        })
      }(controlPagePath)
    })
  )
}

function makeRoute(ctx, prefix){
  let params = ctx.params
  let _url = ctx.url
  const fkp = ctx.fkp
  const indexRoot = fkp.index
  ctx.local = Url.parse(ctx.url, true)


  let _ext = Path.extname(ctx.url)
  let ctxurl = ctx.url.slice(1).replace(_ext, '') || ''

  if (_url.indexOf('?')>-1){
    _url = _url.slice(0, _url.indexOf('?'))
    ctxurl = ctxurl.slice(0, ctxurl.indexOf('?'))
  }
  let rjson = Path.parse(_url)
  let route = false
  let cat = params.cat||'', title = params.title||'', id = params.id||'';
  let gtpy = getObjType;

  if(id){
    gtpy(id)==='number'
    ? route = title
      ? cat+'/'+title
      : cat
    : route = cat+'/'+title +'/' + id
  }

  else if(title){
    title = title.replace(rjson.ext,'');
    route = gtpy(title)==='number' ? cat : cat+'/'+title
  }

  else if(cat){
    cat = cat.replace(rjson.ext,'');
    route = gtpy(cat)==='number' ? indexRoot||'index' : cat
  }

  else{
    route = indexRoot||'index'
  }
  if (ctxurl && route !== ctxurl) route = ctxurl
  if (prefix) route = prefix.indexOf('/')==0 ? prefix.substring(1) : prefix
  return route
}

function staticMapper(ctx, mapper, route, routerPrefix){
  let tmpletStatic = (src, type) => {
    if (type == 'js') {
      return '<script type="text/javascript" src="/js/'+src+'" ></script>'
    }
    if (type == 'css') {
      return '<link rel="stylesheet" href="/css/'+src+'" />'
    }
  }

  if (_.isString(routerPrefix) && routerPrefix.indexOf('/')==0) routerPrefix = routerPrefix.replace('/','')
  if (!mapper) return false
  let pageData = {
    //静态资源
    commonjs: tmpletStatic((mapper.js.common||'common.js'), 'js'),   //公共css
    commoncss: tmpletStatic((mapper.css.common||'common.css'), 'css'), //公共js
    pagejs: '',
    pagecss: '',
    pagedata: {}
  }
  //静态资源初始化
  if(mapper.css[route]) pageData.pagecss = tmpletStatic(mapper.css[route], 'css')
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
  const router = prefix ? new Router({prefix: prefix}) : new Router()
  const routeParam = [
    '/',
    '/:cat',
    '/:cat/:title',
    '/:cat/:title/:id'
  ]
  if (options && _.isPlainObject(options)) {
    let customControl = false
    if (options.customControl) {
      customControl = options.customControl
    }
    _.map(options, (item, key) => {
      if (_.includes(['get', 'post', 'put', 'del'], key)) {
        if (typeof item == 'string') item = [item]
        if (!Array.isArray(item)) return
        item.forEach( rt=>{
          // if (key!='get' && rt.indexOf('p1')==-1) {
          if (key!='get') {
            if (rt!='/') {
              router[key](rt, router::(customControl||forBetter))
            }
          } else {
            router[key](rt, router::(customControl||forBetter))
          }
        })
      } else {
        routeParam.forEach( _path=>{
          router.get(_path, router::(customControl||forBetter))
          router.post(_path, router::(customControl||forBetter))
        })
      }
    })
  } else {
    routeParam.forEach( item=>{
      router.get(item, router::forBetter)
      if (item!='/') {
        router.post(item, router::forBetter)
      }
    })
  }

  app.use(router.routes())
  app.use(router.allowedMethods())

  async function forBetter(ctx, next) {
    try {
      let ignoreStacic = ['css', 'js', 'images', 'img']
      if (ignoreStacic.indexOf(ctx.params.cat)>-1) return
      return await this::dealwithRoute(ctx, ctx.fkp.staticMapper, _controlPages)
    } catch (e) {
      console.log(e.stack)
    }
  }
}

/**
 * 路由配置
 * {param1} koa implement
 * {param2} map of static file
 * return rende pages
**/
async function dealwithRoute(ctx, _mapper, ctrlPages){
  try {
    let isRender = filterRendeFile(ctx.params, ctx.url)
    let route = isRender ? makeRoute(ctx) : false
    if (!route) throw 'route配置不正确'
    ctx.fkproute = route
    let routerPrefix = this.opts.prefix
    ctx.routerPrefix = routerPrefix
    DEBUG('dealwithRoute route = %s', route)
    DEBUG('dealwithRoute routerPrefix = %s', routerPrefix)
  
    let pageData = staticMapper(ctx, _mapper, route, routerPrefix)
    if (!pageData) throw 'mapper数据不正确'
    return ctx::distribute(route, pageData, ctrlPages, this)
  } catch (e) {
    DEBUG('dealwithRoute error = %O', e)
    // console.log(e);
    // return ctx.redirect('404')
  }
}

// 分发路由
async function distribute(route, pageData, ctrlPages, routerInstance){
  let [pdata, rt] = await controler(this, route, pageData, ctrlPages, routerInstance)
  return await renderPage(this, rt, pdata)
}


// match的control文件，并返回数据
async function getctrlData(_path, route, ctx, _pageData, ctrl){
  try {
    let _names = []
    ctrl.set('route', route)
    if (Array.isArray(_path)) {
      for (let _filename of _path) {
        _filename = Path.resolve(__dirname, _filename+'.js')
        if (fs.existsSync(_filename)) {
          let _stat = fs.statSync(_filename)
          if (_stat && _stat.isFile()) _names.push(_filename)
        }
      }
    }
    if (_names.length) {
      let controlConfig = require(_names[0]).getData.call(ctx, _pageData)
      _pageData = await ctrl.run(ctx, controlConfig)
    } else {
      _pageData = false
    }
    return _pageData
  } catch (e) {
    DEBUG('getctrlData error = %O', e)
    return {nomatch: true}
  }
}

async function controler(ctx, route, pageData, ctrlPages, routerInstance){
  let routerPrefix = routerInstance.opts.prefix
  if (_.isString(routerPrefix) && routerPrefix.indexOf('/')==0) routerPrefix = routerPrefix.replace('/','')

  try {
    let ctrl = control(route, ctx, pageData, routerInstance)
    let passAccess = false
    if (ctrl.initStat){
      pageData = await ctrl.run(ctx)
      route = ctrl.store.route || route
    } else {

      let xData = false
      // 根据route匹配到control文件+三层路由
      const controlFile = Path.sep+route+'.js'
      if (ctrlPages.indexOf(controlFile)>-1){
        xData = await getctrlData([businessPagesPath+'/'+route], route, ctx, pageData, ctrl)
      }
      // 根据prefix匹配到control文件+三层路由
      else if (routerPrefix) {
        route = routerPrefix
        let prefixIndexFile =  Path.join(businessPagesPath, routerPrefix, '/index')
        let prefixCatFile =  Path.join(businessPagesPath, routerPrefix, ctx.params.cat||'')
        xData = await getctrlData([prefixIndexFile,prefixCatFile], route, ctx, pageData, ctrl)
      }
      // pages根目录+三层路由
      else {
        if (ctx.params.cat) {
          let paramsCatFile =  Path.join(businessPagesPath, ctx.params.cat)
          const xRoute = ctx.params.cat
          xData = await getctrlData([paramsCatFile], xRoute, ctx, pageData, ctrl)
        }
      }
      // 根据 Fetch.apilist 匹配到api接口，从远程借口拿去数据
      if (!xData) {
        let apilist = Fetch.apilist
        if( apilist.list[route] || route === 'redirect' ){
          passAccess = true
          xData = await getctrlData(['./passaccesscontrol'], route, ctx, pageData, ctrl)
        } else {
          xData = {nomatch: true}
        }
      }
      const isAjax = ctx.fkp.isAjax()
      if (passAccess || isAjax) pageData = xData
    }
    return [pageData, route]
  } catch (e) {
    DEBUG('controler error = %O', e)
    // console.log(e.stack);
  }
}

// dealwith the data from controlPage
async function renderPage(ctx, route, data, isAjax){
  try {
    DEBUG('renderPage pageData = %O', data)
    DEBUG('renderPage route = %s', route)
    switch (ctx.method) {
      case 'GET':
        let getStat = ctx.local.query._stat_
        if ((getStat && getStat === 'DATA') || isAjax ) return ctx.body = data
        if (data && data.nomatch) throw new Error('你访问的页面/api不存在')
        return await ctx.render(route, data)
      case 'POST':
        return ctx.body = data
    }
  } catch (e) {
    if (isAjax) {
      ctx.body = {
        error: '找不到相关信息'
      }
    } else {
      ctx.body = "<div>找不到页面，呃！</div>"
    }
    // return await ctx.render('404')
  }
}

init.makeRoute = makeRoute
init.getRoute = makeRoute
init.staticMapper = staticMapper
init.renderPage = renderPage
init.pages = function(_path){
  businessPagesPath = _path
}

module.exports = init
