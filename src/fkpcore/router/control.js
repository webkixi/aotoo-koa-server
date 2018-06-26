"use strict";

function Control(ctx, oridata, routerIns){
  this.ctx = ctx || null
  this.get = undefined
  this.post = undefined
  this.data = oridata
  this.opts = {}
  this.store = {}
  this.initStat = false
  this.routerIns = routerIns
}

Control.prototype = {
  init: function(options){
    try {
      var dft = {
        get: this.get,
        post: this.post,
        GET: this.get,
        POST: this.post
      }
      if (_.isPlainObject(options)) dft = _.extend(dft, options)
      this.initStat = true
      this.opts = dft

    } catch (e) {
      console.log(e);
    }
  },
  run: function(ctx, options){
    try {
      const routerIns = this.routerIns
      this.ctx = ctx
      if (!this.initStat) if (_.isPlainObject(options)) this.init(options)
      let opts = this.opts
      let mtd = ctx.method
      let _data = this.data

      const _get = opts.get || opts.GET
      const _post = opts.post || opts.POST

      if (mtd === 'GET' && _.isFunction(_get)) {
        _data = _get.call(routerIns, ctx)
      }

      if (mtd === 'POST' && _.isFunction(_post)){
        _data = _post.call(routerIns, ctx)
      }
      return _data
    } catch (e) {
      console.log(e);
    }
  },
  set: function(name, data){
    if (!name || !data) return
    this.store[name] = data
  }
}

const dft = {
  get: '',
  GET: '',

  post: '',
  POST: '',

  put: '',
  PUT: '',

  delete: '',
  DELETE: ''
}

function myControl(route, ctx, odata, routerIns, options) {
  var controlConfigs = _.merge({}, dft, options)
  const _get = controlConfigs.get || controlConfigs.GET
  const _post = controlConfigs.post || controlConfigs.POST
  const _put = controlConfigs.put || controlConfigs.PUT
  const _delete = controlConfigs.delete || controlConfigs.DELETE

  switch (ctx.method) {
    case 'GET':
      if (_.isFunction(_get)) {
        return _get.call(routerIns, ctx)
      }
      break;

    case 'POST':
      if (_.isFunction(_post)) {
        return _post.call(routerIns, ctx)
      }
      break;

    case 'PUT':
      if (_.isFunction(_put)) {
        return _put.call(routerIns, ctx)
      }
      break;

    case 'DELETE':
      if (_.isFunction(_delete)) {
        return _delete.call(routerIns, ctx)
      }
      break;
  }
}

function control(route, ctx, odata, routerIns){
  // return new Control(ctx, odata, routerIns)
  let _id = route+'_controler'
  return Cache.ifid(_id, function(){
    let instance = new Control(ctx, odata, routerIns)
    Cache.set(_id, instance)
    return instance
  })
}

module.exports = myControl
// export default myControl
