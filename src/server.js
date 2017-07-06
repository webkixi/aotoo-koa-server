import Koa from 'koa'
import aotoo from 'aotoo-common'   // global.Aotoo
import views from 'koa-views'
import statics from 'koa-static-cache'
import bodyparser from 'koa-bodyparser'

global.debug = require('debug')
const fkp = require('./fkpcore').default
const app = new Koa()

class aotooServer {
  constructor(opts){
    this.middlewares = []
    this.configs = {
      keys: opts.keys||['agzgz gogogo'],
      index: opts.index||'index',
      pages: opts.pages,
      apis: opts.apis||{},
      mapper: opts.mapper||{},
      pluginsFolder: opts.pluginsFolder
    }
    this.state = {
      views: false,
      bodyparser: false
    }
  }

  async use(midw){
    app.use(midw)
  }

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

  async apis(obj={}){
    if (typeof obj == 'object') {
      this.configs.apis = obj
    }
  }

  async bodyparser(obj={}) {
    if (typeof obj == 'object') {
      this.state.bodyparser = true
      app.use( bodyparser(obj) )
    }
  }

  async views(dist, opts){
    let dft = {
      map: {
        html: (opts&&opts.html||'ejs')
      }
    }
    if (opts&&opts.extension) {
      dft.extension = opts.extension
    }
    if (opts&&opts.options) {
      dft.options = opts.options
    }
    this.state.views = true
    app.use( views(dist, dft) )
  }

  async init(){
    try {
      if (!this.state.views) {
        throw '必须指定模板引擎的views目录'
      }
      if (!this.state.bodyparser) {
        app.use( bodyparser() )
      }
      return await _init.call(this)
      
    } catch (e) {
      console.error(e);
    }
  }
}


async function _init() {
  app.keys = this.configs.keys
  const server = await fkp(app, this.configs)
	app.on('error', async (err, ctx) => {
		logger.error('server error', err, ctx)
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
