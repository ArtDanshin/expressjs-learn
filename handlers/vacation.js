var Vacation = require('../models/vacations.js');
var VacationInSeasonListener = require('../models/vacationInSeasonListener');

Vacation.find(function(err, vacations){
  if (err) return console.error(err);

  if (vacations.length) return;

  new Vacation({
    name: 'Однодневный тур по реке Худ',
    slug: 'hood-river-day-trip',
    category: 'Однодневный тур',
    sku: 'HR199',
    description: 'Проведите день в плавании по реке Колумбия ' +
    'и насладитесь сваренным по традиционным рецептам ' +
    'пивом на реке Худ!',
    priceInCents: 9995,
    tags: ['однодневный тур', 'река худ', 'плавание', 'виндсерфинг', 'пивоварни'],
    inSeason: true,
    maximumGuests: 16,
    available: true,
    packagesSold: 0
  }).save();

  new Vacation({
    name: 'Отдых в Орегон Коуст',
    slug: 'oregon-coast-getaway',
    category: 'Отдых на выходных',
    sku: 'OC39',
    description: 'Насладитесь океанским воздухом ' +
    'и причудливыми прибрежными городками!',
    priceInCents: 269995,
    tags: ['отдых на выходных', 'орегон коуст',
      'прогулки по пляжу'],
    inSeason: false,
    maximumGuests: 8,
    available: true,
    packagesSold: 0,
  }).save();
  new Vacation({
    name: 'Скалолазание в Бенде',
    slug: 'rock-climbing-in-bend',
    category: 'Приключение',
    sku: 'B99',
    description: 'Пощекочите себе нервы горным восхождением ' +
    'на пустынной возвышенности.',
    priceInCents: 289995,
    tags: ['отдых на выходных', 'бенд', 'пустынная возвышенность', 'скалолазание'],
    inSeason: true,
    requiresWaiver: true,
    maximumGuests: 4,
    available: false,
    packagesSold: 0,
    notes: 'Гид по данному туру в настоящий момент ' +
    'восстанавливается после лыжной травмы.',
  }).save();
});

exports.list = function(req, res){
  Vacation.find({ available: true }, function(err, vacations){
    var context = {
      vacations: vacations.map(function(vacation){
        return {
          vacations: vacations.sku,
          name: vacation.name,
          description: vacation.description,
          price: vacation.getDisplayPrice(),
          inSeason: vacation.inSeason
        }
      })
    };
    res.render('vacations', context);
  })
};

exports.notifyWhenInSeason = function(req, res){
  res.render('notify-me-when-in-season', { sku: req.query.sku });
};

exports.notifyWhenInSeasonProcessPost = function(req, res){
  VacationInSeasonListener.update(
    { email: req.body.email },
    { $push: { skus: req.body.sku } },
    { upsert: true },
    function(err){
      if(err) {
        console.error(err.stack);
        req.session.flash = {
          type: 'danger',
          intro: 'Упс!',
          message: 'При обработке вашего запроса ' +
          'произошла ошибка.',
        };
        return res.redirect(303, '/vacations');
      }
      req.session.flash = {
        type: 'success',
        intro: 'Спасибо!',
        message: 'Вы будете оповещены, когда наступит ' +
        'сезон для этого тура.',
      };
      return res.redirect(303, '/vacations');
    }
  )
};