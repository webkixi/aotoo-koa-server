'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mocklist = require('apis/mocklist');

var _mocklist2 = _interopRequireDefault(_mocklist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return {
    mock: function mock(api, param) {
      return (0, _mocklist2.default)(this.ctx, api, param);
    }
  };
};
//# sourceMappingURL=../../../maps/fkpcore/modules/fetch/mockapi.js.map
