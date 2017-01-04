var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var explogger = require('express-logger');
var expsession = require('express-session');
var fs = require('fs');
var mongoose = require('mongoose');
var MongoSessionStore = require('session-mongoose')(require('connect'));
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

var opts = {
  server: {
    socketOptions: { keepAlive: 1 }
  }
};

app.set('port', process.env.PORT || 3000);

switch (app.get('env')){
  case 'development':
    mongoose.connect(credentials.mongo.development.connectionString, opts);
    app.use(morgan('dev'));
    break;
  case 'production':
    mongoose.connect(credentials.mongo.production.connectionString, opts);
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

var sessionStore = new MongoSessionStore({
  url: credentials.mongo[app.get('env')].connectionString
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser(credentials.cookieSecret));
app.use(expsession({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
  store: sessionStore
}));

app.use(express.static(__dirname + '/public'));

require('./routes.js')(app);

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
