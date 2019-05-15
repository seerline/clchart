/// ///////////////////////////
// 从服务器获取数据部分代码
/// ///////////////////////////
var sisdb = {
  // code : 'SH600600',
  // code : 'sz300573',  
  // code : 'sz300366',
  // code : 'SH601216',
  // code : 'SZ002110',
  // code : 'SZ000716',
  // code : 'SH600604',
  code : 'SH601128',
  // code : 'SH603226',
  // code : 'SZ002238',
  tradeDate : 20190429
} 

var sisClient = new SisClient.Client({
  SocketConstructor: WebSocket,
  // endpoint: 'ws://139.224.34.238:7329',
  endpoint: 'ws://192.168.3.118:7329',
})

