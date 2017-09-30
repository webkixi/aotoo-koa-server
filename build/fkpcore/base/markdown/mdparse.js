'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var marked = require('./marked');
var render = new marked.Renderer();
var renderer = require('./markdownrender').default(render);

function strLen(str) {
  return str.replace(/[^\x00-\xff]/g, "aaa").length;
}

/*
 * markdown解析白名单
 * markdown扩展语法中的自定义变量，一般用于数据库存储
 * 匹配 `@@@` 内的内容
 * 白名单内容做为 json 传递到后端
 */
var accessVar = ['tags', 'cats', 'css', 'js', 'author', 'desc', { '分类': 'cats' }, //支持中文 key
{ '作者': 'author' }];

function _createDiv(raw) {
  var prope = {};
  // const regDiv = /^ *(<>|&lt;&gt;)?([\.\#]*(\S+)?) *(?:\n+|$)/ig
  var regDiv = /^ *(<>)?([\.\#]*(\S+)?) *(?:\n+|$)/ig;

  var regAttr = /[\.\#](\w+)?/ig;
  var _text = regDiv.exec(raw);
  if (_text) {
    var _attr = _text[2];
    var attrs = _attr.match(regAttr);
    if (attrs && attrs.length) {
      attrs.map(function (attr) {
        if (attr.charAt(0) == '#') prope.id = attr.substring(1);
        if (attr.charAt(0) == '.') {
          if (!prope.className) prope.className = attr.substring(1);else {
            prope.className += ' ' + attr.substring(1);
          }
        }
      });
      return '<div id="' + (prope.id || '') + '" class="' + (prope.className || '') + '"></div>';
    } else {
      return '<div></div>';
    }
  }
}

function creatDiv(raw) {
  if (raw && (typeof raw === 'undefined' ? 'undefined' : (0, _typeof3.default)(raw)) == 'object') {
    return _createDiv(raw.text);
  } else {
    raw = raw.replace(/(<\/p>|<\/li>)?/ig, '');
    raw = raw.replace(/<br>&lt;&gt;/ig, '@@@');
    var raws = raw.split('@@@');
    if (raws.length > 1) {
      var divAry = raws.map(function (div) {
        return _createDiv(div);
      });
      return divAry.join('\n');
    } else {
      return _createDiv(raws[0]);
    }
  }
}

function getValue(key, val) {
  if (key && val) {
    if (key == 'tags') {
      return val.split(/[,|' ']/g);
    } else {
      return val;
    }
  }
}

function getConfig(md_raw, cvariable) {
  var rev = /^(@{3,}) *\n?([\s\S]*) *\n+\1 *(?:\n+|$)/i;
  var rev2 = /(.*)(?: *\:(.+) *(?:\n+|$))/ig;
  var rev3 = /^[\w\-\u4e00-\u9fa5\uFE30-\uFFA0\/\\\.]+/i; //检测合法的key, value
  var cnReg = /^[\u4e00-\u9fa5\uFE30-\uFFA0]+$/; // 检测中文

  var re5 = /^ *(['"]?\w*['"]?) *\: *(['"]?\w*['"]?)/;

  var tmp = md_raw.match(rev);
  if (tmp && tmp[2]) {
    tmp = tmp[2].replace(/['" ]/ig, '');
    var tmp2 = tmp.match(rev2);
    if (tmp2) {
      tmp2.map(function (item, i) {
        var tmp = item.split(':');
        var k = _.trim(tmp[0]);
        var v = _.trim(tmp[1]);
        var _v = rev3.test(v);
        if (!cnReg.test(k) && accessVar.indexOf(k) > -1) {
          if (_v) cvariable[k] = getValue(k, v);
        } else {
          var _obj = _.find(accessVar, k);
          if (_obj) {
            if (_v) cvariable[_obj[k]] = getValue(_obj[k], v);
          }
        }
      });
    }
    md_raw = md_raw.replace(rev, '');
  }
  return [md_raw, cvariable];
}

function mkmd(raw, opts) {
  // out
  var dft = {
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: false,
    smartypants: false
  };

  if (_.isPlainObject(opts)) {
    dft = _.merge({}, dft, opts);
  }

  var props = {},
      token = void 0;

  var _getConfig = getConfig(raw, {}),
      _getConfig2 = (0, _slicedToArray3.default)(_getConfig, 2),
      md_raw = _getConfig2[0],
      cvariable = _getConfig2[1];

  marked.setOptions(dft);
  var tokens = marked.lexer(md_raw);
  tokens.forEach(function (item, ii) {
    switch (item.type) {
      case 'heading':
        if (item.depth == 1 && !props.title) {
          props.title = item.text;
        }
        break;
      case 'blockquote_start':
        if (!props.desc) {
          var nextItem = tokens[ii + 1];
          props.desc = cvariable.desc || nextItem.text;
        }
        break;
    }
  });
  var mdcnt = {
    title: '',
    descript: '',
    content: '',
    imgs: [],
    img: '',
    menu: '',
    params: ''
  };

  try {
    mdcnt.title = props.title && props.title.replace(/ \{(.*)\}/g, '') || '还没有想好标题';
    mdcnt.descript = props.desc;
    cvariable.desc = cvariable.desc || props.desc;

    var content = marked.parser(tokens);

    // 插入div
    var regDiv = /<p>&lt;&gt;(.*)? *(?:\n+|$)/ig;
    content = content.replace(regDiv, function ($0, $1) {
      return creatDiv($1 + '\n');
    });

    var regDiv2 = /<li><>(.*)? *(?:\n+|$)/ig;
    content = content.replace(regDiv2, function ($0, $1) {
      return '<li>' + creatDiv($1 + '\n') + '</li>';
    });

    // 首图、图集
    var regImg = /<img [.]*(?:src=(['|"]?([^ |>]*)['|"]?)) [.]*/ig;
    var imgs = content.match(regImg);
    if (imgs) {
      mdcnt.imgs = imgs;
      mdcnt.img = imgs[0];
    }

    // 菜单
    var mdMenus = ['<ul class="mdmenu>'];
    var regMenu = /<(h[2]) *(?:id=['"]?(.*?)['"]?) *>(.*?)<\/\1>/ig;
    var regMenu1 = /id=['"]?([^>]*)['"] *>(.*)</i;
    var menus = content.match(regMenu);
    if (menus) {
      menus.map(function (item) {
        var cap = regMenu1.exec(item);
        if (cap) {
          var _cap = (0, _slicedToArray3.default)(cap, 3),
              xxx = _cap[0],
              href = _cap[1],
              title = _cap[2];

          mdMenus.push('<li><a href="#' + (href || '') + '">' + (title || '') + '</a></li>');
        }
      });
      mdMenus.push('</ul>');
      mdcnt.menu = mdMenus.join('\n');
    }

    mdcnt.params = cvariable;
    mdcnt.content = content;
    return mdcnt;
  } catch (e) {
    throw e;
  }
}
module.exports = mkmd;
//# sourceMappingURL=../../../maps/fkpcore/base/markdown/mdparse.js.map
