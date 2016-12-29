var express = require('express');

var app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res){
  res.type('text/plain');
  res.send('Meadowlark Travel')
})

app.get('/about', function(req, res){
  res.type('text/plain');
  res.send('О Meadowlark Travel');
})

app.use(function(req, res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Не найдено');
})

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('text/plain');
  res.status(500);
  res.send('500 - Ошибка сервера');
})

app.listen(app.get('port'), function(){
  console.log('Express запущен на http://localhost:' + app.get('port') + ' ; нажмите Ctrl + C для завершения');
})
