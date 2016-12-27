var http = require('http');

http.createServer(function(req,res) {
  res.writeHead(200, { 'Content-Type': 'text/plain'});
  res.end('Hello world!');
}).listen(3000);

console.log('Сервер запущен на localhost:3000; нажмите Ctrl+C для завершения...')