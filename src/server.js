import fs from "fs";
import Koa from 'koa'
import glob from "glob";
import path from 'path'
import 'aotoo'
import 'aotoo-web-widgets'
import md5 from "blueimp-md5";
import render from 'koa-art-template'
import statics from 'koa-static-cache'
import bodyparser from 'koa-bodyparser'
import core, { fkp } from './fkpcore'
import fetch from './fkpcore/modules/fetch'
import cache from './fkpcore/modules/cache'

ReactDom = require('react-dom/server')
const AKSHOOKS = SAX('AOTOO-KOA-SERVER')
global.ReactDomServer = ReactDom
global.AotooServerHooks = AKSHOOKS
Aotoo.render = ReactDomServer.renderToString
Aotoo.html = ReactDomServer.renderToStaticMarkup

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
    , timeout: 100000
  },

  cacheOptions: {
    max: 300
    , length: function (n, key) { return n * 2 + key.length }
    , dispose: function (key, value) { }
    , maxAge: 2 * 60 * 60 * 1000
  },

  bodyOptions: null,

  routerOptions: {
    allMethods: ['get', 'post', 'put', 'del'],
    parameters: {
      get: [
        '/',
        '/:cat',
        '/:cat/:title',
        '/:cat/:title/:id'
      ],
      post: [
        '/',
        '/:cat',
        '/:cat/:title',
        '/:cat/:title/:id'
      ]
    },
    prefixes: { }
  }
}


class aotooServer {
  constructor(opts = {}) {
    this.middlewares = []
    this._public = {
      js: '/js',
      css: '/css'
    }

    opts = _.merge({}, DEFAULTCONFIGS, opts)

    this.configs = {
      keys: opts.keys || ['aotoo koa'],    // cookie session关键字
      index: opts.index || 'index',        // 默认首页

      apis: opts.apis,                      // api接口集合
      mapper: opts.mapper,  // 静态资源映射文件

      fetchOptions: opts.fetchOptions,
      cacheOptions: opts.cacheOptions,
      bodyOptions: opts.bodyOptions,
      routerOptions: opts.routerOptions,

      root: opts.root,              // 渲染默认目录
      pages: opts.pages||opts.pagesFolder||opts.controls,        // control层文件夹，必须
      pluginsFolder: opts.pluginsFolder   // 插件文件夹
    }

    this.state = {
      views: false,
      bodyparser: false,
      status: false
    }

    if (this.configs.bodyOptions) {
      this.state.bodyparser = true
      app.use(bodyparser(this.configs.bodyOptions))
    }

    // 传入apis
    global.Fetch = this.fetch = fetch({ apis: this.configs.apis, ...this.fetchOptions});
    global.Cache = this.cache = cache(this.configs.cacheOptions)

    if (this.configs.mapper) {
      let _public
      let mapper = this.configs.mapper
      if (mapper.public) {
        _public = mapper.public
        // delete mapper.public
      }
      if (_public) {
        this._public = _public
        Aotoo.inject.public = _public
      }
      Aotoo.inject.mapper = mapper
    }

    this.on = function(name, cb) {
      if (name === 'error') app.on(name, cb)
      AKSHOOKS.on(name, cb)
    }
    this.one = AKSHOOKS::AKSHOOKS.one
    this.off = AKSHOOKS::AKSHOOKS.off
    this.emit = AKSHOOKS::AKSHOOKS.emit
    this.hasOn = AKSHOOKS::AKSHOOKS.hasOn
    this.append = AKSHOOKS::AKSHOOKS.append
    this.set = AKSHOOKS::AKSHOOKS.set
    this.get = AKSHOOKS::AKSHOOKS.get
  }
  
  setFetchOptions(opts){
    DEFAULTCONFIGS.fetchOptions.apis = this.fetch.apis
    const _opts = _.merge({}, DEFAULTCONFIGS.fetchOptions, opts)
    this.configs.fetchOptions = _opts
    global.Fetch = this.fetch = fetch(_opts)
  }

  setCacheOptions(opts){
    const _opts = _.merge({}, DEFAULTCONFIGS.cacheOptions, opts)
    this.configs.cacheOptions = _opts
    global.Cache = this.cache = cache(_opts)
  }

  setRouterOptions(opts){
    const _opts = _.merge({}, DEFAULTCONFIGS.routerOptions, opts)
    this.configs.routerOptions = _opts
  }

  setRouterPrefixes(opts){
    if (!this.state.status) {
      const _opts = _.merge({}, this.configs.routerOptions.prefixes, opts)
      this.configs.routerOptions.prefixes = _opts
    } else {
      console.log('===========');
      console.log('初始化状态才能设置前缀路由');
    }
  }

  public(opts) {
    this._public = opts
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
    dft = _.merge(dft, opts)

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
    if (!this.state.bodyparser && typeof obj == 'object') {
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
          // glob.sync(dist + '/**/*.html').forEach(function (item) {
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
    this.state.status = 'running'
    server.listen(port, dom, cb)
  }
}


async function _init() {
  try {
    AKSHOOKS.append({ 
      entry: this ,
      context: this
    })
    const {keys, apis, mapper} = this.configs
    app.keys = this.configs.keys

    if (!apis.list) {
      throw new Error('api 列表必须封装为list的子属性')
    }

    if (!mapper.js || !mapper.css) {
      throw new Error('请将静态资源列表分别配置作为mapper.js和mapper.css的子元素')
    }

    const server = await core.call(this, app, this.configs)
  
    return server
  } catch (error) {
    console.log(error.stack);
  }
}

module.exports = function (opts) {
  return new aotooServer(opts)
}
