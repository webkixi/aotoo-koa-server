const DEBUG = debug('fkp:router:passaccesscontrol')
const AKSHOOKS = SAX('AOTOO-KOA-SERVER')

function passaccess(oridata) {
  return {
    get: async function(ctx){
      let passdata = await Fetch.get(ctx.fkproute, ctx.query)
      passData = AKSHOOKS.emit('apiControl-get', { data: passdata, ctx }) || passdata
      return passdata
    },

    post: async function(ctx){
      let passdata = await Fetch.post(ctx.fkproute, ctx.request.body)
      passData = AKSHOOKS.emit('apiControl-post', { data: passdata, ctx }) || passdata
      if (passdata && passdata[1]) {
        if (passdata[0].headers.login){
          ctx.response.set('login', passdata[0].headers.login); //设置response的header
        }
        return passdata[1]
      } else {
        if (passdata && passdata[1]==='') return {success: '1010', message: "链接正确，但数据为空"}
      }
      DEBUG('%s', 'java/php后端返回数据出错')
      return {error: "60002", message: "java或者php返回数据错误"}
    }
  }
}

export { passaccess as getData }
