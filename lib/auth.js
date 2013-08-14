var mongo = require('mongoose')
  , cfg = require('./../config/config')
  , Schema = mongo.Schema;

var Entity =  new Schema({
    user:       {type: String, lowercase: true, required: true, sparse: true, unique:true},
    password:   {type: String, required: true}, 
    first: String,
    middle:String,
    last:  String,
    birth: Date,
    gender:String,
    user_type:  {type: String, default:'user'},
    joined:  {type: Date, default: Date.now}
});

var User = mongo.model('User', Entity);

function open() {
	mongo.connect('mongodb://' + cfg.mongo_host + ':' + cfg.mongo_port + '/users');
	var db = mongo.connection;
	db.on('error', console.error.bind(console, 'connection error: '));

  return db;
}

function isUser(login, callback){
	var db = open();

	db.once('open', function cb () {    
		User.findOne({'user': login}, callback);
	});
};

module.exports.auth = function (login, password, cb) {	
	isUser(login, function(err, user) {
		mongo.disconnect();
		if (err) {
			cb(null, err);
			return;
		}
		if (!user || (user.user != login)) {
			cb(null, 'Invalid User'); 
			return; 
		}   
		if (user.password === password) {
			cb(user, null);
			return;
		} 
		cb(null, 'Invalid Password'); 
		return;
	});
};
module.exports.create = function (login, password, cb) {	
	var db = open();

	var userEntry = new User({
		user: login, 
		password: password
	});	
	userEntry.save(function(err, user) {
		if (err) {
			console.log(err);
			cb(null, err);
		} else {
			console.log(user);
			cb(user, null);
		}
		mongo.disconnect();
	});
};
module.exports.user = function (req, res, next) {
	if (req.session.user) {
		next();
	} else { 
		res.redirect('/');
	}
};
module.exports.admin = function (req, res, next) {
	if (req.session.user) {
	  if (req.session.user.user_type === 'admin') {
		  next();
	  } else if (req.session.user.user_type === 'user') {      
		  res.redirect('/');
    }
	} else {
    res.redirect('/login');
	}
};
