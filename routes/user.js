var Auth = require('./../lib/auth.js');

exports.registerform = function (req, res) {
  res.render('register', { title: 'The Mind Company | Register Account' });
};

exports.register = function (req, res) {
	Auth.create (req.body.user, req.body.password, req.body.type, function (user, err){
		if (user) {
			req.session.user = user;
			res.redirect('/');
			console.log('Logging in.');
		} else {
		  res.render('register', { title: 'The Mind Company | Register Account' });
		}
	});
};

exports.loginform = function (req, res) {
  res.render('login', { title: 'The Mind Company | Login' });
};

exports.login = function (req, res) {
	Auth.auth (req.body.user,req.body.password,function(user, msg) {
	  if (user) {
		  req.session.user = user;
      if (user._id.user_type === 'user') {
		    res.redirect('/');
		    console.log('! Login: User');
      } else if (user._id.user_type === 'admin') {
		    res.redirect('/admin-panel');
		    console.log('! Login: Administrator');
      }
	  } else {
		  res.render('login', { title: 'The Mind Company | Login', msg: 'You have entered a invalid user / password!'});
		  console.log('Login Failed! : ' + msg );
	  }
	});
};

exports.profile = function (req, res) {
  Auth.profile (req.param('profileID'), function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.render('profile', { title: 'Profile for ', profile: data });
    }
  });
}

exports.profileEdit = function (req, res) {
  Auth.profile (req.param('profileID'), function (err, data) {
    if (err) {
      console.log(err);
    } else {
      //console.log(req.session.user._id._id);
      if (req.session.user && data._id._id == req.session.user._id._id){
        res.render('profileEdit', { title: 'Profile for ', profile: data });
      } else {      
        res.redirect('/profile/' + req.param('profileID'));
      }
    }
  });
}

exports.profilePost = function (req, res) {
  //console.log(req.session.user.first);
  //console.log(req.body.first);
  var profile,
    first  = (req.body.first != '' && req.session.user.first != req.body.first) ? req.body.first : null,
    middle = (req.body.middle != '' && req.session.user.middle != req.body.middle) ? req.body.middle : null,
    last   = (req.body.last != '' && req.session.user.last != req.body.last) ? req.body.last : null,
    birth  = (req.body.birth != '' && req.session.user.birth != req.body.birth) ? req.body.birth : null,
    city   = (req.body.city != '' && req.session.user.city != req.body.city) ? req.body.city : null,
    state  = (req.body.state != '' && req.session.user.state != req.body.state) ? req.body.state : null,
    gender = (req.body.gender != '' && req.session.user.gender != req.body.gender) ? req.body.gender : null,
    fav_quote = (req.body.fav_quote != '' && req.session.user.fav_quote != req.body.fav_quote) ? req.body.fav_quote : null,
    fav_quote_author = (req.body.fav_quote_author != '' && req.session.user.fav_quote_author != req.body.fav_quote_author) ? req.body.fav_quote_author : null,
    about = (req.body.about != '' && req.session.user.about != req.body.about) ? req.body.about : null,
    user_image = (req.body.user_image != '' && req.session.user.user_image != req.body.user_image) ? req.body.user_image : null; 
  
  profile = {
    first:     first,
    middle:    middle,
    last:      last,
    birth:     birth,
    city:      city,
    state:     state,
    gender:    gender,
    fav_quote: fav_quote,
    fav_quote_author: fav_quote_author,
    about:     about,
    user_image:user_image
  };
  Auth.profileUpdate (req.param('profileID'), profile, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      //console.log(req.session.user);
      //console.log(data);
      req.session.user = data;
      if (req.session.user && data) {
        if (data._id._id == req.session.user._id._id) {
          res.render('profileEdit', { title: 'Profile for ', profile: data });
        } else {      
          res.redirect('/profile/' + req.param('profileID'));
        }
      }
    }
  });
}
