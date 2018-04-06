var noop = function(params) {}
var Server = require('socket.io');
var http = require('http')
var socket_config = {}
var io, sio = {
    on: noop,
    off: noop,
    emit: noop,
    use: noop
  }

function ioof(io){
  return function (path) {
    if (io){
      io.of(path)
      run()
    }
  }
}

function wspush(io) {
  return function (name, msg) {
    io.emit(name, msg);
  }
}

function wsuse(io) {
  return function(cb) {
    if (io) return io.use(cb)
  }
}

function wson() {  // cb is function and cb.length = 3 / cb({Json}, skt{SOCKET}, client{Json})
  var scfg = socket_config;
  return function(name, cb) {
    if (typeof cb == 'function') scfg[name] = cb
  }
}

function websocket(app){
  var scfg = socket_config;
  var _server_ = http.createServer(app.callback());
  io = new Server(_server_);

  sio = {
    on: wson(),
    of: ioof(io),
    emit: wspush(io),
    use: wsuse(io)
  }

  return _server_;
}

function mkon(socket) {
  // const client = socket.handshake
  Object.keys(socket_config).forEach( item => {
    var cb = socket_config[item]
    if (typeof cb == 'function') {
      socket.on(item, function(data) {
        cb(data, socket)
      })
    }
  })

  // var _keys = Object.keys(scfg)
  // _keys.map(function (item, i) {
  //   var _cb = mkmkon(scfg[item], socket)
  //   socket.on(item, _cb)
  // })
}

// function mkmkon(cb, _socket) {
//   const client = _socket.handshake
//   return function (data) {
//     cb.call({ io: io }, data, _socket, client)
//   }
// }

function run(){
  if (io){
    io.on('connection', function(socket){
      mkon(socket);
      // socket.on('first', function(data){
      //   io.emit('first', {data: { user: 'world',message:'ni mei' }});
      // })
      socket.on('disconnect', function(){
        console.log('user disconnect');
      })
    })
  }
}

module.exports = {
  init: websocket,
  of: ioof(io),
  run: run,
  sio: sio
}
