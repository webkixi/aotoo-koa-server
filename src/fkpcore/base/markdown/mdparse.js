const marked = require('./marked')
const render = new marked.Renderer()
const renderer = require('./markdownrender').default(render)

function strLen(str){
  return str.replace(/[^\x00-\xff]/g,"aaa").length;
}

 /*
  * markdown解析白名单
  * markdown扩展语法中的自定义变量，一般用于数据库存储
  * 匹配 `@@@` 内的内容
  * 白名单内容做为 json 传递到后端
  */
const accessVar = [
    'tags',
    'cats',
    'css',
    'js',
    'author',
    'desc',
    {'分类': 'cats'},   //支持中文 key
    {'作者': 'author'}
]


function _createDiv(raw){
  let prope = {}
  // const regDiv = /^ *(<>|&lt;&gt;)?([\.\#]*(\S+)?) *(?:\n+|$)/ig
  const regDiv = /^ *(<>)?([\.\#]*(\S+)?) *(?:\n+|$)/ig
  
  const regAttr = /[\.\#](\w+)?/ig
  const _text = regDiv.exec(raw)
  if (_text) {
    const _attr = _text[2]
    const attrs = _attr.match(regAttr)
    if (attrs && attrs.length) {
      attrs.map( attr => {
        if (attr.charAt(0) == '#') prope.id = attr.substring(1)
        if (attr.charAt(0) == '.') {
          if (!prope.className) prope.className = attr.substring(1)
          else {
            prope.className += ' '+ attr.substring(1)
          }
        }
      })
      return '<div id="'+(prope.id||'')+'" class="'+(prope.className||'')+'"></div>'
    } else {
      return '<div></div>'
    }
  }
}

function creatDiv(raw){
  if (raw && typeof raw == 'object'){
    return _createDiv(raw.text)
  } else {
    raw = raw.replace(/(<\/p>|<\/li>)?/ig, '')
    raw = raw.replace(/<br>&lt;&gt;/ig, '@@@')
    var raws = raw.split('@@@')
    if (raws.length > 1) {
      var divAry = raws.map(function(div){
        return _createDiv(div)
      })
      return divAry.join('\n')
    } else {
      return _createDiv(raws[0])
    }
  }
}

function getValue(key, val){
  if (key && val) {
    if (key == 'tags') {
      return val.split(/[,|' ']/g)
    } else {
      return val
    }
  }
}

function getConfig(md_raw, cvariable){
  const rev = /^(@{3,}) *\n?([\s\S]*) *\n+\1 *(?:\n+|$)/i;
  const rev2 = /(.*)(?: *\:(.+) *(?:\n+|$))/ig;
  const rev3 = /^[\w\-\u4e00-\u9fa5\uFE30-\uFFA0\/\\\.]+/i;  //检测合法的key, value
  const cnReg = /^[\u4e00-\u9fa5\uFE30-\uFFA0]+$/;   // 检测中文

  const re5 = /^ *(['"]?\w*['"]?) *\: *(['"]?\w*['"]?)/

  let tmp = md_raw.match(rev);
  if (tmp && tmp[2]) {
    tmp = tmp[2].replace(/['" ]/ig, '')
    let tmp2 = tmp.match(rev2)
    if (tmp2) {
      tmp2.map(function(item, i){
        const tmp = item.split(':')
        const k = _.trim(tmp[0])
        const v = _.trim(tmp[1])
        const _v = rev3.test(v)
        if (!cnReg.test(k) && accessVar.indexOf(k)>-1 ){
          if (_v) cvariable[k] = getValue(k, v)
        } else {
          const _obj = _.find(accessVar, k);
          if (_obj) {
            if (_v) cvariable[_obj[k]] = getValue(_obj[k], v)
          }
        }
      })
    }
    md_raw = md_raw.replace(rev,'');
  }
  return [ md_raw, cvariable ]
}

function mkmd(raw, opts){   // out
  let dft = {
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: false,
    smartypants: false
  }

  if (_.isPlainObject(opts)) {
    dft = _.merge({}, dft, opts)
  }

  let props = {}, token
  let [ md_raw, cvariable ] = getConfig(raw, {})

  marked.setOptions(dft)
  const tokens = marked.lexer(md_raw)
  tokens.forEach(function(item, ii){
    switch (item.type) {
      case 'heading':
        if (item.depth == 1 && !props.title) {
          props.title = item.text
        }
        break;
      case 'blockquote_start':
        if (!props.desc) {
          const nextItem = tokens[ii+1]
          props.desc = cvariable.desc || nextItem.text
        }
        break;
    }
  })
  let mdcnt = {
    title: '',
    descript: '',
    content: '',
    imgs: [],
    img: '',
    menu: '',
    params: ''
  }
  
  try {
    mdcnt.title = (props.title && props.title.replace(/ \{(.*)\}/g, '')) || '还没有想好标题'
    mdcnt.descript = props.desc
    cvariable.desc = cvariable.desc || props.desc

    let content = marked.parser(tokens)

    // 插入div
    const regDiv = /<p>&lt;&gt;(.*)? *(?:\n+|$)/ig
    content = content.replace( regDiv, ($0, $1) => { return creatDiv($1+'\n') } )

    const regDiv2 = /<li><>(.*)? *(?:\n+|$)/ig
    content = content.replace( regDiv2, ($0, $1) => { return '<li>'+creatDiv($1+'\n')+'</li>' } )
    

    // 首图、图集
    const regImg = /<img [.]*(?:src=(['|"]?([^ |>]*)['|"]?)) [.]*/ig
    const imgs = content.match(regImg)
    if (imgs) {
      mdcnt.imgs = imgs
      mdcnt.img  = imgs[0]
    }

    // 菜单
    let mdMenus = ['<ul class="mdmenu>']
    const regMenu = /<(h[2]) *(?:id=['"]?(.*?)['"]?) *>(.*?)<\/\1>/ig
    const regMenu1 = /id=['"]?([^>]*)['"] *>(.*)</i
    const menus = content.match(regMenu)
    if (menus) {
      menus.map( item => {
        const cap = regMenu1.exec(item)
        if (cap) {
          const [xxx, href, title] = cap
          mdMenus.push('<li><a href="#'+(href||'')+'">'+ (title||'') + '</a></li>')
        }
      })
      mdMenus.push('</ul>')
      mdcnt.menu = mdMenus.join('\n')
    }

    mdcnt.params  = cvariable;
    mdcnt.content = content
    return mdcnt
  } catch (e) {
    throw e
  }
}
module.exports = mkmd
