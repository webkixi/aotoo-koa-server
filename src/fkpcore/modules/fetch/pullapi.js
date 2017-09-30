import path from 'path'
import {stringify} from 'querystring'
const DEBUG = debug('fkp:modules:pullapi')

function getMyApi(api, apilist){
  const apiAry = api.split(':')
  let len = apiAry.length
  const select = apilist[ _.trim(apiAry[0]) ]
  if (len > 1 && select) {
    const nAry = apiAry.splice(1)
    const nApi = nAry.join(':')
    const nCollect = select
    return getMyApi(nApi, nCollect)
  } else {
    return select
  }
}

module.exports = function(){
  return {
    _parseClientForm: function(api, param={}, method='get'){
      let url = undefined
      this.fetchRemote = false
      // if(objtypeof(param)!=='object') return [null, { message: 'pullApiData === 请指定正确的参数'}]
      if(!api) return [null, { message: 'pullApiData === 请指定正确的参数'}]
      if(typeof param !== 'object') param = {}

      /**
       前端通过api.requ('http://www.xxx.com/api')获取外部远程数据
       http://www.xxx.com/api部分会被存在parma._redirect的key值中
       api会自动转成 'redirect'
       ajax的方法(post/get)，通过param参数传入，key值名为ajaxtype，这个等同于jq的名字
      */
      if (api.indexOf('redirect')===0){
        url = param._redirect;
        delete param._redirect
        if (param.ajaxtype){
          method = param.ajaxtype
          delete param.ajaxtype
        }
        if (param && param.method) {
          method = param.method
          delete param.method
        }
        let len = Object.keys(param)
        if (len.length===0) param = {}
      }

      else if (api.indexOf('http')===0) {
        this.fetchRemote = true
        method = 'get'
        url = api
      }

      else {
        // url = this.apilist.list[api]
        url = getMyApi(api, this.apilist.list)
        if( !url ) return [null, null]
      }

      let query=undefined
      method = method.toLowerCase();
      if (method==='get')  query = {json: param}
      if (method==='post') query = {json: param}
      return [url, query]
    },

    getApi: function(api){
      return getMyApi(api, this.apilist.list)
    },

    setApi: function(api_collect){
      this.apilist.list = api_collect || {}
    },

    appendApi: function(api_collect){
      this.apilist.list = _.merge({}, this.apilist.list, api_collect)
    },

    get: async function(api, param){
      DEBUG('get api %s', api)
      let [_api, _param] = this._parseClientForm(api, param, 'get')
      if (!_api) return {error: "60001", message: "指定api不存在"}
      if (_param && _param.json && _param.json.test && _param.json.test == '123') delete _param.json.test
      if (_param && _param.json && _param.json._stat_ ) delete _param.json._stat_
      DEBUG('get param %O', _param)
      let _data = await this._get(_api, _param)
      return {data: _data}
    },

    post: async function(api, param){
      DEBUG('post api %s', api)
      let [_api, _param] = this._parseClientForm(api, param, 'post')
      if (!_api) return {error: "60001", message: "指定api不存在"}
      if (_param && _param.form && _param.form.test && _param.form.test == '123') delete _param.form.test
      DEBUG('post param %O', _param)
      let _data = await this._post(_api, _param)
      return {data: _data}
    }
  }
}
