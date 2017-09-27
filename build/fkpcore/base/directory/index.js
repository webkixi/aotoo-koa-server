'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var index = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(fkp, dir) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (!_fs2.default.existSync(dir)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt('return', folderInfo(dir));

          case 3:
            _context.next = 8;
            break;

          case 5:
            _context.prev = 5;
            _context.t0 = _context['catch'](0);

            debug('parsedir: ' + _context.t0.message);

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 5]]);
  }));

  return function index(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = function (fkp) {
  return index;
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function folderInfo(_dir) {
  var tree = [];
  function loopDir($dir, parent) {
    $dir = $dir + '/*';
    _glob2.default.sync($dir).forEach(function (item) {
      var stat = _fs2.default.statSync(item);
      var obj = _path2.default.parse(item);
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
//# sourceMappingURL=../../../maps/fkpcore/base/directory/index.js.map
