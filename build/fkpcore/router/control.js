"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function Control(ctx, oridata, routerIns) {
  this.ctx = ctx || null;
  this.get = undefined;
  this.post = undefined;
  this.data = oridata;
  this.opts = {};
  this.store = {};
  this.initStat = false;
  this.routerIns = routerIns;
}

Control.prototype = {
  init: function init(options) {
    try {
      var dft = {
        get: this.get,
        post: this.post,
        GET: this.get,
        POST: this.post
      };
      if (_.isPlainObject(options)) dft = _.extend(dft, options);
      this.initStat = true;
      this.opts = dft;
    } catch (e) {
      console.log(e);
    }
  },
  run: function run(ctx, options) {
    try {
      var routerIns = this.routerIns;
      this.ctx = ctx;
      if (!this.initStat) if (_.isPlainObject(options)) this.init(options);
      var opts = this.opts;
      var mtd = ctx.method;
      var _data = this.data;

      var _get = opts.get || opts.GET;
      var _post = opts.post || opts.POST;

      if (mtd === 'GET' && _.isFunction(_get)) {
        _data = _get.call(routerIns, ctx);
      }

      if (mtd === 'POST' && _.isFunction(_post)) {
        _data = _post.call(routerIns, ctx);
      }
      return _data;
    } catch (e) {
      console.log(e);
    }
  },
  set: function set(name, data) {
    if (!name || !data) return;
    this.store[name] = data;
  }
};

var dft = {
  get: '',
  GET: '',

  post: '',
  POST: '',

  put: '',
  PUT: '',

  delete: '',
  DELETE: ''
};

function myControl(route, ctx, odata, routerIns, options) {
  var controlConfigs = _.merge({}, dft, options);
  var _get = controlConfigs.get || controlConfigs.GET;
  var _post = controlConfigs.post || controlConfigs.POST;
  var _put = controlConfigs.put || controlConfigs.PUT;
  var _delete = controlConfigs.delete || controlConfigs.DELETE;

  switch (ctx.method) {
    case 'GET':
      if (_.isFunction(_get)) {
        return _get.call(routerIns, ctx);
      }
      break;

    case 'POST':
      if (_.isFunction(_post)) {
        return _post.call(routerIns, ctx);
      }
      break;

    case 'PUT':
      if (_.isFunction(_put)) {
        return _put.call(routerIns, ctx);
      }
      break;

    case 'DELETE':
      if (_.isFunction(_delete)) {
        return _delete.call(routerIns, ctx);
      }
      break;
  }
}

function control(route, ctx, odata, routerIns) {
  // return new Control(ctx, odata, routerIns)
  var _id = route + '_controler';
  return Cache.ifid(_id, function () {
    var instance = new Control(ctx, odata, routerIns);
    Cache.set(_id, instance);
    return instance;
  });
}

exports.default = myControl;
//# sourceMappingURL=../../maps/fkpcore/router/control.js.map
