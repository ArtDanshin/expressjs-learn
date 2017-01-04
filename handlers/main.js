exports.home = function(req, res){
  res.render('home');
};

exports.about = function(req, res){
  res.render('about', {
    fortune: fortune.getFortune(),
    pageTestScript: '/qa/tests-about.js'
  });
};

exports.newsletter = function(req, res){
  res.render('newsletter', { csrf: 'CSRF token goes here' });
};

exports.process = function(req, res){
  if (req.xhr || req.accepts('json.html') === 'json') {
    res.send({success: true});
  } else {
    res.redirect(303, '/thank-you' );
  }
};