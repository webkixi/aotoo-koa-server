const fs = require('fs')
const path = require('path')
const glob = require('glob')
const DEBUG = debug('fkp:base:directory')

function folderInfo(_dir){
  let tree = []
  function loopDir($dir, parent){
    $dir = $dir+'/*'
    glob.sync($dir).forEach( item => {
      const stat = fs.statSync(item) 
      const obj  = path.parse(item)
      if (stat.isFile()) {
        let feather = {
          title: obj.name,
          path: item,
          url: obj.name
        }
        if (parent) {
          feather.parent = parent
        }
        tree.push(feather)
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
          dirFeather.parent = parent
        }
        tree.push(dirFeather)
        loopDir(item, parentId)
      }
    })
  }
  
  loopDir(_dir)
  return { tree }
}

function index(fkp, dir){
  try {
    if (fs.existSync(dir)) {
      return folderInfo(dir)
    }
  } catch (e) {
    DEBUG('parsedir: %s', e.message)
  }
}

module.exports = function(fkp){
  return index
}
