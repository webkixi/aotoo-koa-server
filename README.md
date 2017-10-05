# aotoo-koa-server
web service, based on koa2, with router and plugins  
easier to build koa web service
aotoo-koa-server基于koa2完成，支持基础路由、镜像路由，静态资源，插件plugins机制等

# [demo source](https://github.com/webkixi/aks-sample)

* __支持KOA中间件(base on koa)__   	  
基于KOA2，支持 koa2 middleware

* __支持Aotoo组件(aotoo sync component)__   
使用Aotoo的组件，可以在NODE中使用，一套结构，多端使用，[【aotoo】](https://www.npmjs.com/package/aotoo)

* __支持镜像路由(mirror route)__    
按照目录命名规则，自动render及匹配相关静态资源  

* __灵活的自定义路由(custom route)__   
自定义路由机制  

* __多层restful(multiple restful api)__   
简单、多层restful支持，默认3层  

* __API机制(sandwich api across backend)__   
组件间通信简单、灵活

* __插件机制(plugins)__	   
方便快捷的开发组件

* __支持websocket__	   
组件都支持JSX与实例双模式


## 目录结构 

```
root
  │            
  ├── dist 
  │    ├── html 
  │    │    └── demo.html
  │    ├── js 
  │    │    └── demo.js
  │    └── css 
  │         └── demo.css
  │    
  ├── server 
  │    │
  │    ├── index.js
  │    │
  │    ├── pages 
  │    │    └── demo.js
  │    │
  │    └── plugins 
  │         └──docs
  │             └──index.js
  │
  └── .babelrc
```

## Babel依赖

```json
// .babelrc
{
  "presets": [
    "react",
    "es2015",
    "stage-0"
  ],
  "plugins": [
    [
      "transform-runtime",
      {
        "polyfill": true,
        "regenerator": true
      }
    ]
  ]
}
```

# 前端 
### 静态JS   
/dist/js/demo.js  

```js
console.log('i am demo.js')
```

### 静态CSS
/dist/css/demo.css  

```css
body{
  font-size: 16px;
}
```

# NODE端

## 初始化  

```bash
cd root
yarn init
yarn add aotoo-koa-server
```

## 配置
serve/index.js  

```js
const path = require('path')
const aks = require('aotoo-koa-server')

const _mapper = {
  js: {
    demo: 'demo.js'
  },
  css: {
    demo: 'demo.css'
  }
}

const app = aks({
  root: path.join(__dirname, '../dist/html'),  
  index: 'demo',
  pages: path.join(__dirname, './pages'),
  pluginsFolder: path.join(__dirname, './plugins'),
  mapper: _mapper
})

app.statics(path.join(__dirname, '../dist/js'), {
  prefix: '/js'
})

app.statics(path.join(__dirname, '../dist/css'), {
  prefix: '/css'
})


app.listen(3000)
```

## Control层  
/server/pages/demo.js(C)  
MVC的control层  

```js
function index(oridata) {
  return {
    get: async function(ctx){
      oridata.fkp = 'Aotoo-koa-server'
      return oridata;
    },

    post: async function(ctx){
      return {pdata: 'post数据'}
    }
  }
}
export { index as getData }
```

## View层
/dist/html/index.html(V)   
MVC的view层  
支持ejs、handbars语法，基于art-template模板引擎  

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    ...
  </head>
  <body>
    <h1>Hello <%=fkp%></h1>
  </body>
</html>
```

## 运行  

```bash
node server/index.js
```