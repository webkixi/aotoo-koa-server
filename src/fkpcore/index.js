import Path from 'path'
import request from 'request'

let fs = require('fs')
let socketio = require('./modules/wsocket'); global.Sio = socketio.sio
// let cache = require('./modules/cache');      global.Cache = cache
// let _fetch = require('./modules/fetch');
let router = require('./router')
const Promise = require('bluebird')
fs = Promise.promisifyAll(fs)

// 内部变量
let innerData = {
  route: {
    prefix: [],
    presets: {}
  }
}

const IGNORE_CHARS = ['_', '.']

// 实例, fkp中间件
function _fkp(ctx, opts){
  this.ctx = ctx
  this.opts = opts
  const that = this
  this.isAjax = function() {
    return header(that.ctx, 'X-Requested-With') === 'XMLHttpRequest';
  }
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

async function registerRouterPrefixes(app) {
  const AotooConfigs = AotooServerHooks.get().context.configs
  if (Object.keys(AotooConfigs.routerOptions.prefixes).length) {
    _.map(AotooConfigs.routerOptions.prefixes, async (params, prefix) => {
      const myOptions = _.merge({}, AotooConfigs.routerOptions.parameters, params)
      await router(app, prefix, myOptions)
    })
  }
}

async function _routepreset(app) {
  await registerRouterPrefixes(app)
  const presets = innerData.route.presets
  const preset_keys = Object.keys(presets)
  const short_prefix = []

  const multi_part_prefix = preset_keys.filter(item => item.split('/').length > 2)
  const single_part_prefix = preset_keys.filter(item => item.split('/').length <= 2)
  const sort_prefixs = [...multi_part_prefix, ...single_part_prefix]

  sort_prefixs.forEach(async (prefix) => {
    await router(app, prefix, presets[prefix])
  })
}

// 静态, fkp()返回实例
export function fkp(ctx, opts){
  let fkpInstanc = new _fkp(ctx, opts)
  for (const property of Object.entries(fkp)) {
    const [_name, _value] = property
    fkpInstanc[_name] = _value
  }
  return fkpInstanc
}

// manual set static property or fun or some resource
fkp.env = process.env.NODE_ENV == 'development' ? 'dev' : 'pro'

// Register utile function
fkp.utileHand = function(name, fn){
  if (typeof fn == 'function') {
    fkp[name] = function() {
      if (fn && typeof fn=='function') { return fn.apply(null, [fkp, ...arguments]) }
    }
  }
}

// Register plugins function
fkp.plugins = function(name, fn){
  if (typeof fn == 'function') {
    _fkp.prototype[name] = function() {
      if (fn && typeof fn=='function') { return fn.apply(this, [this.ctx, ...arguments]) }
    }
  }
}

// as plugins, it look nice
fkp.use = function(name, fn){
  _fkp.prototype[name] = function() {
    if (fn && typeof fn=='function') return fn.apply(this, [this.ctx, ...arguments])
  }
}

function valideFile(_file) {
  const firstChar = _file && _file.charAt(0)
  return IGNORE_CHARS.indexOf(firstChar) > -1 ? false : true
}

async function registerUtile(app) {
  // register utile
  const fkp = app.fkp
  const baseRoot = './base'
  let _utilesFiles = await fs.readdirAsync(Path.resolve(__dirname, baseRoot))
  if (_utilesFiles && _utilesFiles.length) {
    for (let utileFile of _utilesFiles) {
      if (valideFile(utileFile)) {
        let utileFun = require('./base/' + utileFile).default()
        fkp.utileHand(Path.parse(utileFile).name, utileFun)
      }
    }
  }
}

async function registerPlugins(pluginRoot, app) {
  const fkp = app.fkp
  const pluginStat = fs.statSync(pluginRoot)
  if (pluginStat.isDirectory()) {
    let _pluginFiles = await fs.readdirAsync(pluginRoot)
    if (_pluginFiles && _pluginFiles.length) {
      for (let pluginFile of _pluginFiles) {
        if (valideFile(pluginFile)) {
          let plugin = require(Path.join(pluginRoot, pluginFile)).default(fkp)
          fkp.plugins(Path.parse(pluginFile).name, plugin)
        }
      }
    }

    // let _pluginFiles = fs.readdirSync(pluginRoot)
    // if (_pluginFiles && _pluginFiles.length) {
    //   for (let pluginFile of _pluginFiles) {
    //     if (valideFile(pluginFile)) {
    //       let plugin = require(Path.join(pluginRoot, pluginFile)).default(fkp)
    //       fkp.plugins(Path.parse(pluginFile).name, plugin)
    //     }
    //   }
    // }
  }
}

export default async function(app, options) {
  const instance = this
  // =========== 注册fkp中间件 =============
  app.fkp = fkp

  let dfts = {
    apis: options.apis,
    pages: options.pages,      
    index: options.index,
    mapper: options.mapper,
    pluginsFolder: options.pluginsFolder
  }

  // 初始化controls目录
  router.pages(dfts.pages) 

  // 初始化socket.io
  let server = socketio.init(app)  

  // 传入apis
  // const fetch = _fetch({apis: dfts.apis});     
  // global.Fetch = fetch

  fkp.staticMapper = dfts.mapper
  fkp.router = router
  fkp.apilist = dfts.apis
  fkp.index = dfts.index
  fkp.statics = instance.statics.bind(instance)


  /**
   * 预动态设置路由, 在plugins方法中使用
   * @param  {String}  prefix        koa-router's prefix
   * @param  {JSON}  routerOptions   koa-router's route
  */
  fkp.routepreset = async function(prefix, routerOptions) {
    if (prefix) {
      prefix = Path.join('/', prefix)
      innerData.route.presets[prefix] = routerOptions
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
  }


  /*
  =============== 注册助手方法及plugins =============
  1、助手方法为一般的静态方法，第一个参数fkp，通过fkp.xxx调用，助手方法不能调用plugins方法
  2、插件方法为new fkp后的对象方法，带有this的上下文，第一个参数ctx，为koa环境对象，插件方法挂载在fkp上，调用方法同样为fkp.xxx
  =================================================*/

  try {
    // register utile
    await registerUtile(app)

    // register plugins
    const pluginRoot = dfts.pluginsFolder
    if ( pluginRoot && fs.existsSync(pluginRoot) ) {
      await registerPlugins(pluginRoot, app)
    }
  } catch (e) {
    console.log(e);
  }
  
  // 获取当前的路由信息
  fkp.getRouter = function(){
    return router.getRoute(ctx)
  }

  const myfkp = fkp(null)
  
  // 封装koa中间件
  app.use(async (ctx, next) => {
    // controle层使用的fkp都是实例化的fkp
    myfkp.ctx = ctx
    ctx.fkp = myfkp

    // 定义Fetch的上下文环境
    Fetch.init(ctx)
    await next()
  })
  
  await _routepreset(app)
  
  // 初始化路由
  await router(app)

  // socketio运行时
  socketio.run()
  return server
}
