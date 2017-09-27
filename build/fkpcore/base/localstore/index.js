'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.default = function (fkp) {
  return localStore;
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _diskdb = require('diskdb');

var _diskdb2 = _interopRequireDefault(_diskdb);

var _path2 = require('path');

var _path3 = _interopRequireDefault(_path2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const dbpath = Path.join(__dirname, 'server/db/diskdb/collections')
var dbpath = _path3.default.join(__dirname, 'collections');
if (!_fs2.default.existsSync(dbpath)) {
  _fs2.default.mkdirSync(dbpath, '0777');
}

function mkdirsSync(dirpath, mode) {
  mode = '0777';
  if (!_fs2.default.existsSync(dirpath)) {
    var pathtmp;
    var dirs = dirpath.split(_path3.default.sep).filter(function (dirname) {
      return !!dirname;
    });
    dirs.map(function (dirname) {
      if (pathtmp) pathtmp = _path3.default.join(pathtmp, dirname);else {
        pathtmp = dirname;
      }
      if (!_fs2.default.existsSync(pathtmp)) {
        if (!_fs2.default.mkdirSync(pathtmp, mode)) {
          return false;
        }
      }
    });
  }
  return true;
}

// function mkdir(directory){
//   const _path = Path.join(dbpath, directory)
//   if (!fs.existsSync(_path)) {
//     fs.mkdirSync(_path, '0777')
//   }
// }

function createDataBase(_path, collections) {
  var db = _diskdb2.default.connect(_path);
  collections = [].concat(collections);
  db.loadCollections(collections);
  return db;
}

var _localDB = function () {
  function _localDB(collections, databasePath) {
    (0, _classCallCheck3.default)(this, _localDB);

    this.collections = collections;
    var db = createDataBase(databasePath, collections);
    this.control = db[collections];
  }

  (0, _createClass3.default)(_localDB, [{
    key: 'count',
    value: function count() {
      return this.control.count();
    }
  }, {
    key: 'find',
    value: function find(query) {
      if (!query) this.control.find();
      return this.control.find(query);
    }
  }, {
    key: 'findOne',
    value: function findOne(query) {
      if (!query) return this.control.findOne();
      return this.control.findOne(query);
    }
  }, {
    key: 'update',
    value: function update(query, dataToBeUpdate, opts) {
      var dft = (0, _assign2.default)({}, { multi: false, upsert: false }, opts);
      return this.control.update(query, dataToBeUpdate, dft);
    }
  }, {
    key: 'set',
    value: function set(articls) {
      var count = this.count();
      articls.id = count;
      this.control.save(articls);
    }
  }, {
    key: 'get',
    value: function get(query) {
      return this.control.findOne(query);
    }
  }, {
    key: 'remove',
    value: function remove(query, delAll) {
      if (query) {
        this.control.remove(query, delAll);
      } else {
        this.control.remove();
      }
    }
  }, {
    key: 'removeAll',
    value: function removeAll(query) {
      this.remove(query || {}, true);
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.remove();
    }
  }]);
  return _localDB;
}();

function localStore(fkp, collections) {
  var databasePath = dbpath;
  var oldCollections = collections;
  if (typeof collections == 'string') {
    if (collections.indexOf('/') > 0) {
      var parts = collections.split('/');
      collections = parts.pop();
      if (parts.length) {
        databasePath = _path3.default.join(dbpath, parts.join('/'));
        if (!_fs2.default.existsSync(databasePath)) {
          mkdirsSync(databasePath);
        }
      }
    }

    var $id = 'LocalDB_' + oldCollections;
    return Cache.ifid($id, function () {
      try {
        var ldb = new _localDB(collections, databasePath);
        Cache.set($id, ldb);
        return ldb;
      } catch (e) {
        console.log(e);
      }
    });
  }
}
//# sourceMappingURL=../../../maps/fkpcore/base/localstore/index.js.map
