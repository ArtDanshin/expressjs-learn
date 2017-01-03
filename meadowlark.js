var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var explogger = require('express-logger');
var fortune = require('./lib/fortune.js');
var weather = require('./lib/weather.js');
var credentials = require('./config/credentials.js');

var app = express();
var hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    section: function(name, options){
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.set('port', process.env.PORT || 3000);

switch (app.get('env')){
  case 'development':
    app.use(morgan('dev'));
    break;
  case 'production':
    app.use(explogger({
      path: __dirname + '/log/requests.log'
    }))
    break;
}

app.use(function(req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
});

app.use(function(req, res, next){
  if (!res.locals.partials) res.locals.partials = {};
  res.locals.partials.weatherContext = weather.getWeatherData();
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser(credentials.cookieSecret));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('home');
});

app.get('/contest/vacation-photo', function(req, res){
  var now = new Date();
  res.render('contest/vacation-photo', {
    year: now.getFullYear(),
    month: now.getMonth()
  })
});

app.post('/contest/vacation-photo/:year/:month', function(req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files){
    if (err) return res.redirect(303, '/error');
    console.log('received fields: ' + fields);
    console.log('received files: ' + files);
    res.redirect(303, '/thank-you');
  })
})

app.get('/newsletter', function(req, res){
  res.render('newsletter', { csrf: 'CSRF token goes here' });
})

app.post('/process', function(req, res){
  if (req.xhr || req.accepts('json.html') === 'json') {
    res.send({success: true});
  } else {
    res.redirect(303, '/thank-you' );
  }
});

app.get('/about', function(req, res){
  res.render('about', {
    fortune: fortune.getFortune(),
    pageTestScript: '/qa/tests-about.js'
  });
});

app.get('/tours/hood-river', function(req, res){
  res.render('tours/hood-river');
});

app.get('/tours/oregon-coast', function(req, res){
  res.render('tours/oregon-coast');
});

app.get('/tours/request-group-rate', function(req, res){
  res.render('tours/request-group-rate');
});

app.use(function(req, res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express запущен на http://localhost:' + app.get('port') + ' ; нажмите Ctrl + C для завершения');
});
