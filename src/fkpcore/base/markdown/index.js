import fs from 'fs'
import glob from 'glob'
import md5 from 'blueimp-md5'
const path = require('path')
const mdParse = require('../markdown')

function getHomeStruct(){
  return {
    title: '',
    descript: '',
    path: '',
    url: '',
    img: '',
    config: '',
    exist: false
  }
}

function cloneIt(obj){
  return JSON.parse(JSON.stringify(obj))
}

// markdown目录及文档分析
class MarkdownDocs {
  constructor(opts={}){
    this.opts = opts
  }


  // 分析目录并返回目录结构
  // 递归遍历所有文件及目录
  // 生成aotoo.transtree的数据树结构，参考aotoo.transtree
  folderInfo(_dir){
    const opts = this.opts
    const that = this
    let tree = []

    const rootobj = path.parse(_dir)
    let rootFeather = {
      title: rootobj.name,
      path: _dir,
      url: rootobj.name,
      idf: 'root'
    }

    function loopDir($_dir, parent, parentObj){
      const $dir = $_dir+'/*'
      const $_dirObj = path.parse($_dir)
      let home = getHomeStruct()
      glob.sync($dir).forEach( item => {
        const stat = fs.statSync(item) 
        const obj = path.parse(item)
        if (stat.isFile()) {
          // const raw = fs.readFileSync(item, 'utf-8')
          // const mdInfo = md(raw, {})

          // 目录描述图
          if (['.jpg', '.jpeg', '.png', '.gif'].indexOf(obj.ext)>-1) {
            if (obj.name.indexOf('index')>-1) {
              home.img = home.img ? home.img.concat(item) : [].concat(item)
            }
          }

          // 目录配置文件
          if (obj.name == 'config' && parent) {
            parentObj.config = require(item)
          }

          if (obj.ext == '.md') {
            const mdInfo = that.file(item)
            
            // 目录首页
            if (obj.name == 'index') {
              const _obj = path.parse(obj.dir)
              home.title = mdInfo.title||obj.name
              home.descript = mdInfo.descript
              home.path = item
              home.url = _obj.name
              home.img = home.img ? home.img : mdInfo.img
              home.imgs = mdInfo.imgs
              home.exist = true
              home.params = mdInfo.params
            } else {
              let feather = {
                title: mdInfo.title,
                descript: mdInfo.descript,
                path: item,
                url: obj.name+obj.ext,
                img: mdInfo.img,
                imgs: mdInfo.imgs,
                params: mdInfo.params
              }
              if (parent) {
                feather.url = parentObj.url+'/'+feather.url
                feather.parent = parent
              }
              tree.push(feather)
            }


            // 将home文件加入
            if (parent) {
              parentObj.home = home
            }
          }
        }

        if (stat.isDirectory()) {
          const parentId = _.uniqueId(obj.name+'_')
          let dirFeather = {
            title: obj.name,
            path: item,
            url: obj.name,
            idf: parentId
          }
          if (parent) {
            dirFeather.url = parentObj.url+'/'+dirFeather.url
            dirFeather.parent = parent
          }
          tree.push(dirFeather)
          loopDir(item, parentId, dirFeather)
        }
      })
    }
    let _rootFeather = cloneIt(rootFeather)
    tree.push(_rootFeather)
    loopDir(_dir, 'root', _rootFeather)
    
    return {tree}
  }

  parse(raw, opts){
    return mdParse(raw, opts)
  }

  file(filename){
    const that = this
    const fileFeather = path.parse(filename)
    if (fileFeather.ext !== '.md') return 
    
    const opts = this.opts
    if (fs.existsSync(filename)) {
      const fid = md5(filename)
      return Cache.ifid(fid, function(){
        const raw = fs.readFileSync(filename, 'utf-8')
        const mdInfo = that.parse(raw, opts)
        Cache.set(fid, mdInfo, 144*60*60*1000)
        return mdInfo
      })
    }
  }

  folder(dir){
    if (dir && fs.existsSync(dir)) {
      return this.folderInfo(dir)
    }
  }


  // 查找文档目录下的分类目录，过滤文档目录下的文档
  covers(dir){
    let covers = []
    if (dir && fs.existsSync(dir)) {
      glob.sync(dir).forEach( item => {
        const stat = fs.statSync(item) 
        if (stat.isDirectory()) {
          const covs = this.folder(item).tree
          covs.forEach( $cov=>{
            if ($cov.parent == 'root' && $cov.idf) {
              covers.push($cov)
            }
          }) 
        }
      })
    }
    return covers
  }
}

/*
 * usage
 * const mdParse = ctx.fkp.markdown({ // marked的配置选项  })
 * mdParse.covers(path)
 * mdParse.folder(path)
 * mdParse.file(path)
 * 
 * path = 绝对路径
*/
export default function(fkp){
  return function(fkp, opts={}){
    return new MarkdownDocs(opts)
  }
}