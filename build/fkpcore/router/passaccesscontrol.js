'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function passaccess(oridata) {
  return {
    get: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
        var passdata;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return Fetch.get(ctx.fkproute, ctx.query);

              case 2:
                passdata = _context.sent;
                return _context.abrupt('return', passdata);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function get(_x) {
        return _ref.apply(this, arguments);
      }

      return get;
    }(),

    post: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
        var passdata;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return Fetch.post(ctx.fkproute, ctx.body);

              case 2:
                passdata = _context2.sent;

                if (!(passdata && passdata[1])) {
                  _context2.next = 8;
                  break;
                }

                if (passdata[0].headers.login) {
                  ctx.response.set('login', passdata[0].headers.login); //设置response的header
                }
                return _context2.abrupt('return', passdata[1]);

              case 8:
                if (!(passdata && passdata[1] === '')) {
                  _context2.next = 10;
                  break;
                }

                return _context2.abrupt('return', Errors['1010']);

              case 10:
                debug('java/php后端返回数据出错');
                return _context2.abrupt('return', Errors['60002']);

              case 12:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function post(_x2) {
        return _ref2.apply(this, arguments);
      }

      return post;
    }()
  };
}

exports.getData = passaccess;
//# sourceMappingURL=../../maps/fkpcore/router/passaccesscontrol.js.map
