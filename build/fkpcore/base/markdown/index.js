'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.default = function (fkp) {
  return function (fkp) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return new MarkdownDocs(opts);
  };
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _blueimpMd = require('blueimp-md5');

var _blueimpMd2 = _interopRequireDefault(_blueimpMd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');
var mdParse = require('../markdown');

function getHomeStruct() {
  return {
    title: '',
    descript: '',
    path: '',
    url: '',
    img: '',
    config: '',
    exist: false
  };
}

function cloneIt(obj) {
  return JSON.parse((0, _stringify2.default)(obj));
}

// markdown目录及文档分析

var MarkdownDocs = function () {
  function MarkdownDocs() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, MarkdownDocs);

    this.opts = opts;
  }

  // 分析目录并返回目录结构
  // 递归遍历所有文件及目录
  // 生成aotoo.transtree的数据树结构，参考aotoo.transtree


  (0, _createClass3.default)(MarkdownDocs, [{
    key: 'folderInfo',
    value: function folderInfo(_dir) {
      var opts = this.opts;
      var that = this;
      var tree = [];

      var rootobj = path.parse(_dir);
      var rootFeather = {
        title: rootobj.name,
        path: _dir,
        url: rootobj.name,
        idf: 'root'
      };

      function loopDir($_dir, parent, parentObj) {
        var $dir = $_dir + '/*';
        var $_dirObj = path.parse($_dir);
        var home = getHomeStruct();
        _glob2.default.sync($dir).forEach(function (item) {
          var stat = _fs2.default.statSync(item);
          var obj = path.parse(item);
          if (stat.isFile()) {
            // const raw = fs.readFileSync(item, 'utf-8')
            // const mdInfo = md(raw, {})

            // 目录描述图
            if (['.jpg', '.jpeg', '.png', '.gif'].indexOf(obj.ext) > -1) {
              if (obj.name.indexOf('index') > -1) {
                home.img = home.img ? home.img.concat(item) : [].concat(item);
              }
            }

            // 目录配置文件
            if (obj.name == 'config' && parent) {
              parentObj.config = require(item);
            }

            if (obj.ext == '.md') {
              var mdInfo = that.file(item);

              // 目录首页
              if (obj.name == 'index') {
                var _obj = path.parse(obj.dir);
                home.title = mdInfo.title || obj.name;
                home.descript = mdInfo.descript;
                home.path = item;
                home.url = _obj.name;
                home.img = home.img ? home.img : mdInfo.img;
                home.imgs = mdInfo.imgs;
                home.exist = true;
                home.params = mdInfo.params;
              } else {
                var feather = {
                  title: mdInfo.title,
                  descript: mdInfo.descript,
                  path: item,
                  url: obj.name + obj.ext,
                  img: mdInfo.img,
                  imgs: mdInfo.imgs,
                  params: mdInfo.params
                };
                if (parent) {
                  feather.url = parentObj.url + '/' + feather.url;
                  feather.parent = parent;
                }
                tree.push(feather);
              }

              // 将home文件加入
              if (parent) {
                parentObj.home = home;
              }
            }
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
              dirFeather.url = parentObj.url + '/' + dirFeather.url;
              dirFeather.parent = parent;
            }
            tree.push(dirFeather);
            loopDir(item, parentId, dirFeather);
          }
        });
      }
      var _rootFeather = cloneIt(rootFeather);
      tree.push(_rootFeather);
      loopDir(_dir, 'root', _rootFeather);

      return { tree: tree };
    }
  }, {
    key: 'parse',
    value: function parse(raw, opts) {
      return mdParse(raw, opts);
    }
  }, {
    key: 'file',
    value: function file(filename) {
      var that = this;
      var fileFeather = path.parse(filename);
      if (fileFeather.ext !== '.md') return;

      var opts = this.opts;
      if (_fs2.default.existsSync(filename)) {
        var fid = (0, _blueimpMd2.default)(filename);
        return Cache.ifid(fid, function () {
          var raw = _fs2.default.readFileSync(filename, 'utf-8');
          var mdInfo = that.parse(raw, opts);
          Cache.set(fid, mdInfo, 144 * 60 * 60 * 1000);
          return mdInfo;
        });
      }
    }
  }, {
    key: 'folder',
    value: function folder(dir) {
      if (dir && _fs2.default.existsSync(dir)) {
        return this.folderInfo(dir);
      }
    }

    // 查找文档目录下的分类目录，过滤文档目录下的文档

  }, {
    key: 'covers',
    value: function covers(dir) {
      var _this = this;

      var covers = [];
      if (dir && _fs2.default.existsSync(dir)) {
        _glob2.default.sync(dir).forEach(function (item) {
          var stat = _fs2.default.statSync(item);
          if (stat.isDirectory()) {
            var covs = _this.folder(item).tree;
            covs.forEach(function ($cov) {
              if ($cov.parent == 'root' && $cov.idf) {
                covers.push($cov);
              }
            });
          }
        });
      }
      return covers;
    }
  }]);
  return MarkdownDocs;
}();

/*
 * usage
 * const mdParse = ctx.fkp.markdown({ // marked的配置选项  })
 * mdParse.covers(path)
 * mdParse.folder(path)
 * mdParse.file(path)
 * 
 * path = 绝对路径
*/
//# sourceMappingURL=../../../maps/fkpcore/base/markdown/index.js.map
