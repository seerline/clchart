/// ///////////////////////////
// 从服务器获取数据部分代码
/// ///////////////////////////
var client = {}

function connect_server() {
  // client.ws = new WebSocket('ws://192.168.3.118:7329');
  client.ws = new WebSocket('ws://192.168.1.186:7329');
  console.log('connection ...')
  // client.ws = new WebSocket('ws://localhost:8888');
  // ws.binaryType = 'blob';
  // client.ws.binaryType = 'arraybuffer';
}

connect_server();

client.ws.onopen = function (e) {
  // client.ws.status = 'open';
  console.log('connection to server opened')
}
client.ws.onclose = function (e) {
  // client.ws.status = 'close';
  connect_server();
  console.log('connection closed')
}
client.ws.onerror = function (evt) {
  console.log(evt)
}

function _makeid() {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 20; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

// function make_command_buffer(sign, command) {
//   let count = command.length + 1
//   let com = '*' + count + '\r\n'
//   com += '$' + sign.length + '\r\n' + sign + '\r\n';
//   for (let k = 0; k < command.length; k++) {
//     com += '$' + command[k].length + '\r\n' + command[k] + '\r\n';
//   }
//   return com
// }

function make_command_buffer(sign, command) {
  // console.log('<===', typeof command, command);
  let com = sign + ':{'
  for (let k = 0; k < command.length; k++) {
    let isjson = '"';
    if(command[k][0]==='['||command[k][0]==='{')
    {
      isjson = '';
    }
    switch (k) {
      case 0:
        com += '"com":' + isjson + command[k] + isjson
        break
      case 1:
        com += '"key":' + isjson + command[k] + isjson
        break    
      case 2:
        com += '"argv":' + isjson + command[k] + isjson
        break         
      default:
        com += '"argv' + (k - 2) + '":' + isjson + command[k] + isjson
        break
    }
    if (k < command.length - 1) {
      com += ','
    }
  }
  com += '}'
  return com
}

client.ws.onmessage = function (message) {
  let start = message.data.indexOf(':');
  let sign = message.data.substr(0, start);

  console.log('===>', typeof message.data, message.data);

  if (client.wait.commands[sign] !== undefined) {
    client.wait.messages[client.wait.commands[sign]] =
      JSON.parse(message.data.substr(start + 1, message.data.length));
  }
  //   console.log('-->', client.wait.messages, client.wait.commands[sign]);
  let all = true;
  for (const item in client.wait.commands) {
    // console.log('--- ss --- ', client.wait.commands[item]);
    if (client.wait.messages[client.wait.commands[item]] === undefined) {
      all = false
      break
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
  }
  for (let index = 0; index < commands.length; index++) {
    let sign = _makeid()
    client.wait.commands[sign] = commands[index].key
    // console.log(sign + ' ' + commands[index].com);

    let sendstr = make_command_buffer(sign, commands[index].com)

    console.log('<===', sendstr)

    client.ws.send(sendstr)
  }
  // console.log(client.wait.commands);
}

function client_config_set(key, value) {
  if (window.localStorage) {
    window.localStorage.setItem(key, value)
  }
}

function client_config_get(key) {
  if (window.localStorage) {
    return window.localStorage.getItem(key)
  }
}

function client_config_clear() {
  if (window.localStorage) {
    window.localStorage.clear()
  }
}

function client_config_remove(key) {
  if (window.localStorage) {
    window.localStorage.removeItem(key)
  }
}