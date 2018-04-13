import fs from "fs";
import glob from "glob";
import md5 from "blueimp-md5";
import Koa from 'koa'
import aotoo from 'aotoo-common'   // global.Aotoo
import render from 'koa-art-template'
import statics from 'koa-static-cache'
import bodyparser from 'koa-bodyparser'
import core, { fkp } from './fkpcore'
import fetch from './fkpcore/modules/fetch'
import cache from './fkpcore/modules/cache'

const myStore = SAX('AOTOO-KOA-SERVER')

const app = new Koa()
const DEFAULTCONFIGS = {
  mapper: {
    js: {},
    css: {},
    public: {
      js: '/js',
      css: '/css'
    }
  },
  
  apis: {
    list: {}
  },

  fetchOptions: {
    headers: { }
    , timeout: 10000
  },

  cacheOptions: {
    max: 300
    , length: function (n, key) { return n * 2 + key.length }
    , dispose: function (key, value) { }
    , maxAge: 2 * 60 * 60 * 1000
  },

  bodyOptions: {}
}


class aotooServer {
  constructor(opts = {}) {
    this.middlewares = []

    let theApis = {
      list: opts.apis || {}
    }

    this.configs = {
      keys: opts.keys || ['aotoo koa'],    // cookie session关键字
      index: opts.index || 'index',        // 默认首页

      apis: theApis || DEFAULTCONFIGS.apis,                      // api接口集合
      mapper: opts.mapper || DEFAULTCONFIGS.mapper,  // 静态资源映射文件

      fetchOptions: opts.fetchOptions || DEFAULTCONFIGS.fetchOptions,
      cacheOptions: opts.cacheOptions || DEFAULTCONFIGS.cacheOptions,
      bodyOptions: opts.bodyOptions || DEFAULTCONFIGS.bodyOptions,

      root: opts.root,              // 渲染默认目录
      pages: opts.pages||opts.pagesFolder||opts.controls,        // control层文件夹，必须
      pluginsFolder: opts.pluginsFolder   // 插件文件夹
    }

    this.state = {
      views: false,
      bodyparser: false
    }

    if (this.configs.bodyOptions) {
      this.state.bodyparser = true
      app.use(bodyparser(this.configs.bodyOptions))
    }

    // 传入apis
    global.Fetch = this.fetch = fetch({ apis: this.configs.apis, ...this.fetchOptions});
    global.Cache = this.cache = cache(this.cacheOptions)

    if (this.configs.mapper) {
      let _public
      let mapper = this.configs.mapper
      if (mapper.public) {
        _public = mapper.public
        // delete mapper.public
      }
      if (_public) {
        Aotoo.inject.public = _public
      }
      Aotoo.inject.mapper = mapper
    }
  }

  public(opts) {
    Aotoo.inject.public = opts
  }

  // 注册KOA2的中间间，与KOA2语法保持一致
  async use(midw) {
    app.use(midw)
  }

  // 注册一个Aotoo插件方法
  plugins(name, fn) {
    fkp.plugins(name, fn)
  }

  // 注册一个Aotoo助手方法
  utile(name, fn) {
    fkp.utileHand(name, fn)
  }

  callback() {
    return app.callback(arguments)
  }

  // 指定站点静态路径，如 /images, /uploader, /user
  async statics(dist, opts, files) {
    let dft = {
      dynamic: false,
      buffer: false,
      gzip: false
    }
    if (opts) {
      dft = _.merge(dft, opts)
    }

    app.use(statics(dist, dft, files))
  }

  // 注册api接口集，用于做接口层的数据访问
  async apis(obj = {}) {
    if (typeof obj == 'object') {
      this.configs.apis = obj
    }
  }


  // 注册POST中间件，可以通过 ctx.bodys来访问post数据
  async bodyparser(obj = {}) {
    if (typeof obj == 'object') {
      this.state.bodyparser = true
      app.use(bodyparser(obj))
    }
  }


  // 注册渲染方法
  async views(dist, opts) {
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

    if (typeof opts == 'function') {
      opts = {
        render: opts
      }
    }

    dft = _.merge({}, dft, opts)

    if (dist) {
      let views = []
      this.state.viewsRoot = dist
      if (fs.existsSync(dist)) {
        const distState = fs.statSync(dist)
        if (distState.isDirectory()) {
          glob.sync(dist + '/**/*.html').forEach(function (item) {
            views.push(item)
          })
        }
      }
      this.state.views = views
    }
    if (dft.render && typeof dft.render == 'function') {
      app.use(dft.render)
    } else {
      render(app, dft)
    }
  }


  // 初始化
  async init() {
    try {
      if (!this.configs.pages) {
        throw new Error('控制器目录没有指定')
      }
      if (!this.state.views) {
        if (!this.configs.root) {
          throw new Error('koa的模板解析引擎没有配置且需设置app.state.views=true; app.state.viewsRoot=HTMLDIST')
        } else {
          this.views(this.configs.root)
        }
      }
      if (!this.state.bodyparser) {
        app.use(bodyparser())
      }
      return await _init.call(this)

    } catch (e) {
      console.error(e);
    }
  }

  async listen(port, dom, cb) {
    const server = await this.init()
    server.listen(port, dom, cb)
  }
}


async function _init() {
  try {
    myStore.append({ entry: this })
    const {keys, apis, mapper} = this.configs
    app.keys = this.configs.keys

    if (!apis.list) {
      throw new Error('api 列表必须封装为list的子属性')
    }

    if (!mapper.js || !mapper.css) {
      throw new Error('请将静态资源列表分别配置作为mapper.js和mapper.css的子元素')
    }

    const server = await core.call(this, app, this.configs)
    app.on('error', async (err, ctx) => {
      console.error('server error', err, ctx)
    })
  
    return server
  } catch (error) {
    console.log(error.stack);
  }
}

module.exports = function (opts) {
  return new aotooServer(opts)
}
