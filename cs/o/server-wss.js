
var class_websocket_server = require('ws').Server;

var wsserver = new class_websocket_server({ port: 8888 });

wsserver.binaryType = "blob";
console.log('client 8888 start');

wsserver.on('connection', function (ws) {
    console.log('client connected');
    // clientws = ws;
    ws.on('message', function (message) {
        console.log(message);
        // readredisvalue(ws,message);
        ws.send('server : ' + message);
    });
});
