'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (fkp) {
  return index;
};

var template = require('art-template');

// 压缩页面的css/js
// template.defaults.minimize = true;
// template.defaults.htmlMinifierOptions = {
//   collapseWhitespace: true,
//   minifyCSS: true,
//   minifyJS: true,
//   // 运行时自动合并：rules.map(rule => rule.test)
//   ignoreCustomFragments: []
// };

function index(fkp, raw) {
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var options = arguments[3];

  if (raw) {
    // const tempSet = {
    //   1: {
    //     evaluate:    /{{([\s\S]+?)}}/g,
    //     interpolate: /{{=([\s\S]+?)}}/g,
    //     escape:      /{{-([\s\S]+?)}}/g
    //   },

    //   2: {
    //     evaluate:    /{{{([\s\S]+?)}}}/g,
    //     interpolate: /{{{=([\s\S]+?)}}}/g,
    //     escape:      /{{{-([\s\S]+?)}}}/g
    //   }
    // }

    // if (typeof type == 'number') {
    //   _.templateSettings = tempSet[type]
    // }

    // const compiled = _.template(raw)
    // return compiled(data)


    // 将模板源代码编译成函数
    return template.render(raw, data, options);
  }
}
//# sourceMappingURL=../../../maps/fkpcore/base/template/index.js.map
