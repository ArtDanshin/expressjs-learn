var main = require('./handlers/main.js'),
    contest = require('./handlers/contest.js'),
    vacation = require('./handlers/vacation.js'),
    tours = require('./handlers/tours.js');

module.exports = function(app){

  // miscellaneous routes
  app.get('/', main.home);
  app.get('/about', main.about);
  app.get('/newsletter', main.newsletter);
  app.post('/process', main.process);

  // contest routes
  app.get('/contest/vacation-photo', contest.vacationPhoto);
  app.post('/contest/vacation-photo/:year/:month', contest.vacationPhotoProcessPost);

  // vacation routes
  app.get('/vacations', vacation.list);
  app.get('/notify-me-when-in-season', vacation.notifyWhenInSeason);
  app.post('/notify-me-when-in-season', vacation.notifyWhenInSeasonProcessPost);

  // tours routes
  app.get('/tours/hood-river', tours.hoodriver);
  app.get('/tours/oregon-coast', tours.oregoncoast);
  app.post('/tours/request-group-rate', tours.request);
};