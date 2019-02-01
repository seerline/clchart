
var class_websocket_server = require('ws').Server
var class_redis_server = require('ioredis')
var class_redis_command = require('ioredis').Command

var server = {
  target: {
    port: 8888
  },
  // source : { host:  '192.168.3.118', port : 6379, password: 'clxx1110' },
  source: {
    host: '192.168.1.205',
    port: 6379,
    password: 'clxx1110'
  },
  message: [] // 消息列表 [ { links:"", com:"", arvg:"" },{} ]
}

server.redis_server = new class_redis_server({ // 9
  db: 0,
  family: 4, // 4 (IPv4) or 6 (IPv6)
  host: server.source.host,
  port: server.source.port,
  password: server.source.password
})

// message 为来源链路等
function from_server_to_client (message, stream) {
  message.client.send(message.id + ' ' + stream)
}

function from_client_to_server (message, argv) {
  message.id = argv[0]
  let com = argv[1]
  let param = argv.slice(2)

  console.log(param)
  let command = new class_redis_command(com, param, // {},
    {
      replyEncoding: 'utf8'
    },
    function (error, result) {
      console.log(':::', typeof result, result, arguments.length)
      from_server_to_client(message, result)
      for (var i = 0; i < arguments.length; i++) {
        console.log(i, '--------:' + arguments[i])
      }
    })
  server.redis_server.sendCommand(command)
  }

// from_client_to_server({}, "sisdb.get", "sh6000001.queue",'{"format":"array"}');

server.wsserver = new class_websocket_server({
  port: server.target.port
})

// server.wsserver.binaryType = "blob";
console.log('client ', server.target.port, ' start')

server.wsserver.on('connection', function (client) {
  console.log('client connected')
  // clientws = ws;
  client.on('message', function (message) {
    console.log(message, message.split(' '))
    from_client_to_server({
      client
    }, message.split(' '))
    // client.send('server : ' + message);
  })
})
