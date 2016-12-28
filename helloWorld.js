var http = require('http');

http.createServer(function(req,res) {
  var path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();
  switch(path) {
    case '':
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Homepage');
      break;
    case '/about':
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('0');
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Не найдено');
      break;
  }
}).listen(3000);

console.log('Сервер запущен на localhost:3000; нажмите Ctrl+C для завершения...')