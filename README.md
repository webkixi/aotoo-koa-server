# aotoo-koa-server
web service, based on koa2, with router and plugins  
easier to build koa service

## CONFIGS
- keys: koa2的keys，用于cookie的加密设置,
- apis: { list: {} }, aotoo-server的远程API访问，用于node端获取更后端(java,php)的数据
- index: 指定网站访问的首页
- pages: mvc的control层，必须指定
- mapper: 模板渲染时，对应的静态文件资源JSON
- pluginsFolder: 插件目录，需指定绝对路径

## API
- **use**  
  同 `koa.use` 支持所有koa的中间件  
  > aServer.use(midw)  
  midw: koa的中间件  
- **views**  
  基于koa-views, Template rendering middleware for koa    

  > aServer.views(dist, opts)   
  dist: 指定解析目录  
  opts: views的解析配置：参考-----  
- **statics**  
  基于koa-static-cache，Static server for koa
  > aServer.statics(dist, opts, files)
  dist: 指定解析目录  
  opts: views的解析配置：参考-----  
  files: 指定的特殊静态文件，参考-----  
  
- **init**  
  应用配置，最后一步执行，必须执行  
  >  aServer.init()

## USAGE

```js
  const app = require('aotoo-koa-server')({
    keys: ['aotoo yes'],
    
    // Fixed structure 固定结构，必须有list
    apis: { list: {} },   
      
      // 服务访问的首页 
    index: 'index',   
    
    // dir for control, it's required, control层目录，绝对路径
    pages: Path.join(__dirname, './pages'),   

	// Fixed structure 固定结构，必须有js 和 css
    mapper: {js:{}, css:{}},  

	// dir for plugins
    pluginsFolder: Path.resolve(__dirname, './plugins')  
  })

  app.views(HTMLDIST)

  app.statics(configs.static.uploads, {
    dynamic: true,
    prefix: '/uploader'
  })

  app.statics(configs.static.doc, {
    dynamic: true,
    prefix: '/docs'
  })

  app.statics(STATICSROOT, {
    dynamic: true,
    buffer: false,
    gzip: true
  })


  // the third party middleware
  // 第三方koa中间件
  app.use(session({
    key: 'aotoo-',
    cookie: { maxage: 24*3600*1000 }
  }))
  app.use(conditional())
  app.use(etag())
  app.use(logger())  
  // ...
  // ...

  const server = await app.init()
  server.listen(configs.port, function(){ 
    // ....
  })
```