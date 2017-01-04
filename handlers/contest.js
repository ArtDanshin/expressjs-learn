var path = require('path'),
    fs = require('fs'),
    formidable = require('formidable');

var dataDir = __dirname + '/data';
var vacationPhotoDir = dataDir + '/vacation-photo';
fs.existsSync(dataDir) || fs.mkdirSync(dataDir);
fs.existsSync(vacationPhotoDir) || fs.mkdirSync(vacationPhotoDir);

function saveContestEntry(contestName, email, year, month, photoPath){
  //TODO... Это будет добавленно позднее
}

exports.vacationPhoto = function(req, res){
  var now = new Date();
  res.render('contest/vacation-photo', {
    year: now.getFullYear(),
    month: now.getMonth()
  })
};

exports.vacationPhotoProcessPost = function(req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files){
    if (err) {
      res.session.flash = {
        type: 'danger',
        intro: 'Упс!',
        message: 'Во время обработки отправленной Вами формы произошла ошибка. Пожалуйста попробуйте еще раз.'
      };
      return res.redirect(303, '/contest/vacation-photo');
    }
    var photo = files.photo;
    var dir = vacationPhotoDir + '/' + photo.name;
    var path = dir + '/' + photo.name;
    fs.mkdirSync(dir);
    fs.renameSync(photo.path, dir + '/' + photo.name);
    saveContestEntry('vacation-photo', fields.email, req.params.years, req.params.nonth, path);
    req.session.flash = {
      type: 'success',
      intro: 'Удачи!',
      message: 'Вы стали участником конкурса'
    };
    res.redirect(303, '/contest/vacation-photo/entries');
  })
};