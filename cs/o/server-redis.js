
var class_redis_server = require('ioredis');
var class_redis_command = require('ioredis').Command;

var server = {};

server.redis_server = new class_redis_server({ // 9
  db: 0,
  family: 4, // 4 (IPv4) or 6 (IPv6)
  // port:  15003, host:  '139.196.252.87',
  // port:  6379, host:  '127.0.0.1',
  // port:  6379, host:  '192.168.1.205',
  port: 6379,
  host: '192.168.3.118',
  password: 'clxx1110',
});

var command = new class_redis_command('sisdb.get', ['sh600600._info'],
  // var command = new class_redis_command('sisdb.get', ['xxx.ss','{"format":"struct"}'], 
  {},
  // { replyEncoding: 'utf8' }, 
  function (error, result) {
    console.log(':::', typeof result, result.length, result, arguments.length);
    for (var i = 0; i < arguments.length; i++) {
      console.log(i, "--------:" + arguments[i]);
    }
  });
server.redis_server.sendCommand(command);