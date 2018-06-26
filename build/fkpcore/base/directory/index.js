'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var DEBUG = debug('fkp:base:directory');

function folderInfo(_dir) {
  var tree = [];
  function loopDir($dir, parent) {
    $dir = $dir + '/*';
    glob.sync($dir).forEach(function (item) {
      var stat = fs.statSync(item);
      var obj = path.parse(item);
      if (stat.isFile()) {
        var feather = {
          title: obj.name,
          path: item,
          url: obj.name
        };
        if (parent) {
          feather.parent = parent;
        }
        tree.push(feather);
      }

      if (stat.isDirectory()) {
        var parentId = _.uniqueId(obj.name + '_');
        var dirFeather = {
          title: obj.name,
          path: item,
          url: obj.name,
          idf: parentId
        };
        if (parent) {
          dirFeather.parent = parent;
        }
        tree.push(dirFeather);
        loopDir(item, parentId);
      }
    });
  }

  loopDir(_dir);
  return { tree: tree };
}

function index(fkp, dir) {
  try {
    if (fs.existSync(dir)) {
      return folderInfo(dir);
    }
  } catch (e) {
    DEBUG('parsedir: %s', e.message);
  }
}

module.exports = function (fkp) {
  return index;
};
//# sourceMappingURL=../../../maps/fkpcore/base/directory/index.js.map
