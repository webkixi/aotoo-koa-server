'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var index = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(fkp, url) {
    var _id;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _id = 'analyzeDir_' + url;
            return _context.abrupt('return', Cache.ifid(_id, function () {
              var dirdata = (0, _readhtmldir.analyzeDir)(url);
              Cache.set(_id, dirdata);
              return dirdata;
            }));

          case 5:
            _context.prev = 5;
            _context.t0 = _context['catch'](0);

            // debug('parsedir: ' + e.message)
            console.log(_context.t0);
            return _context.abrupt('return', false);

          case 9:
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

var _readhtmldir = require('./_readhtmldir');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var path = require('path');
var bluebird = require('bluebird');
var fs = bluebird.promisifyAll(require('fs'));
//# sourceMappingURL=../../../maps/fkpcore/base/analyzedir/index.js.map
