'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (fkp) {
  return index;
};

function index(fkp, raw) {
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var type = arguments[3];

  if (raw) {
    var tempSet = {
      1: {
        evaluate: /{{([\s\S]+?)}}/g,
        interpolate: /{{=([\s\S]+?)}}/g,
        escape: /{{-([\s\S]+?)}}/g
      },

      2: {
        evaluate: /{{{([\s\S]+?)}}}/g,
        interpolate: /{{{=([\s\S]+?)}}}/g,
        escape: /{{{-([\s\S]+?)}}}/g
      }
    };

    if (typeof type == 'number') {
      _.templateSettings = tempSet[type];
    }

    var compiled = _.template(raw);
    return compiled(data);
  }
}
//# sourceMappingURL=../../../maps/fkpcore/base/template/index.js.map
