# aotoo-koa-server
web service, based on koa2, with router and plugins  
easier to build koa web service
aotoo-koa-server基于koa2完成，支持基础路由、镜像路由，静态资源，插件plugins机制等

## USAGE
#### server.js
```js
const path = require('path')
const as = require('aotoo-koa-server')
const logger = require('koa-logger')

const app = as({
  index: 'index',
  root: path.join(__dirname, './html'),   // index.html
  pages: path.join(__dirname, './pages')  // pages/index.js
})

app.use(logger())  
app.listen(3000)
```

#### pages/index.js
```js
function index(oridata) {
  return {
    get: async function(ctx){
      const fkp = ctx.fkp
      oridata.fkp = 'Aotoo-koa-server'
      const test = <div>hello test</div>
      oridata.react = Aotoo.html(test)
      return oridata;
    },

    post: async function(ctx){
      return {pdata: '我是post数据'}
    }
  }
}
export { index as getData }
```

#### html/index.html
支持handbars语法，使用art-template模板引擎
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <h1>Hello <%=fkp%></h1>
  <%-react%>
</body>
</html>
```

## FEATHER
1. 标准MVC结构
2. 动态路由
3. 镜像路由
4. 扩展插件机制
5. 支持React同构，基于Aotoo库构建的插件同时适用前端与NODE端

## DEMO
请参考`aotoo-O`开源项目, `aotoo-O`是一套JS全栈脚手架，支持开发、测试、生产等各种复杂环境
[aotoo-O](https://github.com/webkixi/aotoo-O)

## INSTALL
```bash
  npm i aotoo-koa-server
  # or  
  yarn add aotoo-koa-server
```

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

- **utile**  
  为fkp增加助手方法  
  >  aServer.utile(name, fn)

- **plugins**  
  为fkp增加插件  
  >  aServer.plugins(name, fn)


## CONFIGS
- keys: koa2的keys，用于cookie的加密设置,
- apis: { list: {} }, aotoo-server的远程API访问，用于node端获取更后端(java,php)的数据
- index: 指定网站访问的首页
- pages: mvc的control层，必须指定
- mapper: 模板渲染时，对应的静态文件资源JSON
- pluginsFolder: 插件目录，需指定绝对路径

## USAGE
> server端配置，node提供路由，静态资源，views等web service
```js
  const app = require('aotoo-koa-server')({
    keys: ['aotoo yes'],
    
    // Fixed structure 固定结构，必须有list
    apis: { list: {} },   
      
      // 服务访问的首页 
    index: 'index',   
    
    // dir for control, it's required, it's control层目录，绝对路径(abs path)
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

  /*
  * ===============================
  * extend fkp
  * fkp is the core function of aotoo-koa-server
  * ===============================
  */

  // append fkp utile function
  app.utile('xxx', function(fkp){
    console.log('========= xxxx')
  })

  // append fkp plugins function
  app.plugins('aaa', function(ctx, args){
    const fkp = ctx.fkp
    fkp.xxx()  // ========= xxxx
    console.log(args)  // ========= plugin
  })
```

## FKP
> fkp is the core function of aotoo-koa-server

#### 使用fkp插件
> ===> aotoo-O/server/pages/index.js  [源码](https://github.com/webkixi/aotoo-O/blob/master/server/pages/index.js)
> pages目录是node端的control层，默认支持get/post等方法

```js
"use strict";
function index(oridata) {
  return {
    get: async function(ctx){
      const fkp = ctx.fkp
      fkp.aaa(arg)   // 参考上文用例
      return oridata;
    },

    post: async function(ctx){
      return {pdata: '我是post数据'}
    }
  }
}

export { index as getData }
```