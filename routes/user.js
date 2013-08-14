var Auth = require('./../lib/auth.js');

exports.registerform = function (req, res) {
  res.render('register', { title: 'The Mind Company | Register Account' });
};

exports.register = function (req, res) {
	Auth.create (req.body.user,req.body.password,function (user, err){
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
      if (user.user_type === 'user') {
			  res.redirect('/');
			  console.log('! Login: User');
      } else if (user.user_type === 'admin') {
			  res.redirect('/admin-panel');
			  console.log('! Login: Administrator');
      }
		} else {
			res.render('login', { title: 'The Mind Company | Login', msg: 'You have entered a invalid user / password!'});
			console.log('Login Failed! : ' + msg );
		}
	});
};

