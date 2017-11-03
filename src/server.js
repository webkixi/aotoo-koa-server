import Koa from 'koa'
import aotoo from 'aotoo-common'   // global.Aotoo
import render from 'koa-art-template'
import statics from 'koa-static-cache'
import bodyparser from 'koa-bodyparser'
import core, {fkp} from './fkpcore'

const app = new Koa()

class aotooServer {
  constructor(opts={}){
    this.middlewares = []
    
    let theApis = {
      list: opts.apis || {}
    }

    this.configs = {
      keys: opts.keys||['aotoo koa'],    // cookie session关键字
      index: opts.index||'index',        // 默认首页

      apis: theApis,                      // api接口集合
      mapper: opts.mapper||{js: {}, css: {}},  // 静态资源映射文件

      root: opts.root,              // 渲染默认目录
      pages: opts.pages,        // control层文件夹，必须
      pluginsFolder: opts.pluginsFolder   // 插件文件夹
    }

    this.state = {
      views: false,
      bodyparser: false
    }

    if (this.configs.mapper) {
      let _public
      let mapper = this.configs.mapper
      if (mapper.public) {
        _public = mapper.public
        delete mapper.public
      }
      if (_public) {
        Aotoo.inject.public = _public
      }
      Aotoo.inject.mapper = mapper
    }
  }

  public(opts){
    Aotoo.inject.public = opts
  }

  // 注册KOA2的中间间，与KOA2语法保持一致
  async use(midw){
    app.use(midw)
  }

  // 注册一个Aotoo插件方法
  plugins(name, fn){
    fkp.plugins(name, fn)
  }

  // 注册一个Aotoo助手方法
  utile(name, fn) {
    fkp.utileHand(name, fn)
  }

  callback(){
    return app.callback(arguments)
  }

  // 指定站点静态路径，如 /images, /uploader, /user
  async statics(dist, opts, files){
    let dft = {
      dynamic: false,
      buffer: false,
      gzip: false
    }
    if (opts) {
      dft = _.merge(dft, opts)
    }

    app.use( statics(dist, dft, files) )
  }

  // 注册api接口集，用于做接口层的数据访问
  async apis(obj={}){
    if (typeof obj == 'object') {
      this.configs.apis = obj
    }
  }


  // 注册POST中间件，可以通过 ctx.bodys来访问post数据
  async bodyparser(obj={}) {
    if (typeof obj == 'object') {
      this.state.bodyparser = true
      app.use( bodyparser(obj) )
    }
  }


  // 注册渲染方法
  async views(dist, opts){
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

    let dft = {
      root: dist,
      extname: '.html',
      debug: process.env.NODE_ENV !== 'production'
    }
    dft = _.merge({}, dft, opts)
    this.state.views = true
    render(app, dft)
  }


  // 初始化
  async init(){
    try {
      if (!this.configs.pages) {
        throw '必须指定control目录'
      }
      if (!this.state.views) {
        if (!this.configs.root) {
          throw '必须指定模板引擎的views目录'
        } else {
          this.views(this.configs.root)
        }
      }
      if (!this.state.bodyparser) {
        app.use( bodyparser() )
      }
      return await _init.call(this)
      
    } catch (e) {
      console.error(e);
    }
  }

  async listen(port, dom, cb){
    const server = await this.init()
    server.listen(port, dom, cb)
  }
}


async function _init() {
  app.keys = this.configs.keys
  const server = await core.call(this, app, this.configs)
	app.on('error', async (err, ctx) => {
		console.error('server error', err, ctx)
	})

  return server
}

module.exports = function(opts){
  try {
    if (!opts.pages) throw '必须指定 pages 目录选项, pages目录放置control层文件'
    return new aotooServer(opts)
  } catch (e) {
    console.error(e);
  } 
}
