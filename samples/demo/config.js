/// ///////////////////////////
// 从服务器获取数据部分代码
/// ///////////////////////////
var sisdb = {
  code : 'SH600600',
  // code : 'sz300344',  
  // code : 'sz300366',
  // code : 'sz000716',
  tradeDate : 20190419
} 

var sisClient = new SisClient.Client({
  SocketConstructor: WebSocket,
  endpoint: 'ws://139.224.34.238:7329',
  // endpoint: 'ws://192.168.3.118:7329',
})

