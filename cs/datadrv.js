/// ///////////////////////////
// 从服务器获取数据部分代码
/// ///////////////////////////
var client = {};

// client.ws = new WebSocket("ws://192.168.3.118:8888");
client.ws = new WebSocket("ws://localhost:8888");

function _makeid() {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 20; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}
client.ws.onopen = function (e) {
  console.log('connection to server opened');
}
client.ws.onclose = function (e) {
  console.log('connection closed');
}
client.ws.onerror = function (evt) {
  console.log(evt);
};
// ws.binaryType = "blob";
//ws.binaryType = 'arraybuffer';
client.ws.onmessage = function (message) {
  //   console.log("-->",typeof message.data, message.data);
  let start = message.data.indexOf(' ');
  let sign = message.data.substr(0, start);

  if (client.wait.commands[sign] !== undefined) {
    client.wait.messages[client.wait.commands[sign]] =
      JSON.parse(message.data.substr(start + 1, message.data.length));
  }
  //   console.log("-->", client.wait.messages, client.wait.commands[sign]);
  let all = true;
  for (const item in client.wait.commands) {
    // console.log('--- ss --- ', client.wait.commands[item]);
    if (client.wait.messages[client.wait.commands[item]] === undefined) {
      all = false;
      break;
    }
  }
  if (all) {
    client.wait.callback(client.wait.messages);
  }
}

// 当发出的指令全部返回后，就回调函数
function send_client_command(commands, call) {
  client.wait = {
    callback: call,
    commands: {},
    messages: {}
  };
  for (let index = 0; index < commands.length; index++) {
    let sign = _makeid();
    client.wait.commands[sign] = commands[index].key;
    // console.log(sign + ' ' + commands[index].com);
    client.ws.send(sign + ' ' + commands[index].com);
  }
  console.log(client.wait.commands);
}
