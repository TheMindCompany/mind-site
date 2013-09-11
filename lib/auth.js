var mongo = require('mongoose')
  , Schema = mongo.Schema
  , open = require('./mongo.js');

var Credential =  new Schema({
    user:       {type: String, lowercase: true, required: true, sparse: true, unique:true},
    password:   {type: String, required: true}, 
    user_type:  {type: String, default:'user'},
    _profile:   {type: Schema.Types.ObjectId, ref: 'UserProfiles'}
});

var AboutCredential =  new Schema({
    _id:     {type: Schema.Types.ObjectId, ref: 'UserAuths'},
    first:     {type: String, default:''},
    middle:    {type: String, default:''},
    last:      {type: String, default:''},
    birth:     {type: Date, default: Date.now},
    city:      {type: String, default:''},
    state:     {type: String, default:''},
    gender:    {type: String, default:''},
    fav_quote: {type: String, default:''},
    fav_quote_author: {type: String, default:''},
    about:     {type: String, default:''},
    user_image:{type: String, default:''},
    joined:    {type: Date, default: Date.now}
}, { _id: false });

var Auth = mongo.model('UserAuths', Credential);
var Profile = mongo.model('UserProfiles', AboutCredential);

module.exports.create = function (login, password, type, cb) {	
	var db = open.open_user_db();
	
	var userAuth;
  if (type) {
    userAuth = new Auth({
		  user: login, 
		  password: password,
		  user_type: type
	  });
	} else {
	  userAuth = new Auth({
		  user: login, 
		  password: password
	  });
	}
	userAuth.save(function(err, user) {
		if (err) {
			console.log(err);
			cb(null, err);
		}   
	  var userProfile = new Profile({
      _id: userAuth._id
    });		
    userProfile.save(function(err, user) {
      if (err) {
	      console.log(err);
	      cb(null, err);
      }
	    cb(user, null);
	    mongo.disconnect();
    });
	}); 
};

function isUser(login, callback){
	var db = open.open_user_db();

	db.once('open', function cb () {    
		Auth.findOne({'user': login}, callback);
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
		  getProfile(user._id,function(err, profile) {
		    mongo.disconnect();
		    if (err) {
		      cb(null, err);
		    } else {
			    cb(profile, null);
			  }
			});
			return;
		} 
		cb(null, 'Invalid Password'); 
		return;
	});
};

function getProfile(profileID, cb){
	var db = open.open_user_db();
	db.once('open', function () {    
		Profile.findOne({'_id': profileID}).populate('_id', 'user user_type').exec(cb);
	});
};

module.exports.profile = function (profileID, cb) {
  getProfile(profileID, function (err, user){
    mongo.disconnect();
    if (err){
      cb(err, null);
    } else {
      cb(null, user);
    }
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
  //console.log(req.session.user);
	if (req.session.user) {
	  if (req.session.user._id.user_type === 'admin') {
		  next();
	  } else if (req.session.user._id.user_type === 'user') {    
		  res.redirect('/');
    }
	} else {
    res.redirect('/login');
	}
};

module.exports.profileUpdate = function (id, profile, cb) {   
	var db = open.open_user_db();
	
  function getData(profileID, cb){
	  db.once('open', function () {    
		  Profile.findOne({'_id': profileID}).populate('_id', 'user user_type').exec(cb);
	  });
  };

  getData(id, function (err, user){
    if (err){
      console.log(err);
      cb(err, null);
    } else {  
      if (profile.first){
        console.log('Updating first name...');
        Profile.update({_id: id}, {first: profile.first}, { multi: true }, function (err, numberAffected, raw) {
          if (err) return handleError(err);
          console.log('The number of updated documents was %d', numberAffected);
          console.log('The raw response from Mongo was ', raw);
        });
      }
      if (profile.middle){
        console.log('Updating middle name...');
        Profile.update({_id: id}, {middle: profile.middle}, { multi: true }, function (err, numberAffected, raw) {
          if (err) return handleError(err);
          console.log('The number of updated documents was %d', numberAffected);
          console.log('The raw response from Mongo was ', raw);
        });
      }
      if (profile.last){
        console.log('Updating last name...');
        Profile.update({_id: id}, {last: profile.last}, { multi: true }, function (err, numberAffected, raw) {
          if (err) return handleError(err);
          console.log('The number of updated documents was %d', numberAffected);
          console.log('The raw response from Mongo was ', raw);
        });
      }
      if (profile.birth){
        console.log('Updating birth...');
        Profile.update({_id: id}, {birth: profile.birth}, { multi: true }, function (err, numberAffected, raw) {
          if (err) return handleError(err);
          console.log('The number of updated documents was %d', numberAffected);
          console.log('The raw response from Mongo was ', raw);
        });
      }
      if (profile.city){
        console.log('Updating city...');
        Profile.update({_id: id}, {city: profile.city}, { multi: true }, function (err, numberAffected, raw) {
          if (err) return handleError(err);
          console.log('The number of updated documents was %d', numberAffected);
          console.log('The raw response from Mongo was ', raw);
        });
      }
      if (profile.state){
        console.log('Updating state...');
        Profile.update({_id: id}, {state: profile.state}, { multi: true }, function (err, numberAffected, raw) {
          if (err) return handleError(err);
          console.log('The number of updated documents was %d', numberAffected);
          console.log('The raw response from Mongo was ', raw);
        });
      }
      if (profile.gender){
        console.log('Updating gender...');
        Profile.update({_id: id}, {gender: profile.gender}, { multi: true }, function (err, numberAffected, raw) {
          if (err) return handleError(err);
          console.log('The number of updated documents was %d', numberAffected);
          console.log('The raw response from Mongo was ', raw);
        });
      }
      if (profile.fav_quote){
        console.log('Updating favorite quote...');
        Profile.update({_id: id}, {fav_quote: profile.fav_quote}, { multi: true }, function (err, numberAffected, raw) {
          if (err) return handleError(err);
          console.log('The number of updated documents was %d', numberAffected);
          console.log('The raw response from Mongo was ', raw);
        });
      }
      if (profile.fav_quote_author){
        console.log('Updating favorite quote author...');
        Profile.update({_id: id}, {fav_quote_author: profile.fav_quote_author}, { multi: true }, function (err, numberAffected, raw) {
          if (err) return handleError(err);
          console.log('The number of updated documents was %d', numberAffected);
          console.log('The raw response from Mongo was ', raw);
        });
      }
      if (profile.about){
        console.log('Updating about...');
        Profile.update({_id: id}, {about: profile.about}, { multi: true }, function (err, numberAffected, raw) {
          if (err) return handleError(err);
          console.log('The number of updated documents was %d', numberAffected);
          console.log('The raw response from Mongo was ', raw);
        });
      }
      if (profile.user_image){
        console.log('Updating user image...');
        Profile.update({_id: id}, {user_image: profile.user_image}, { multi: true }, function (err, numberAffected, raw) {
          if (err) return handleError(err);
          console.log('The number of updated documents was %d', numberAffected);
          console.log('The raw response from Mongo was ', raw);
        });
      }  
      mongo.disconnect();  
         
	    var db = open.open_user_db();
      getData(id, function (err, user2){
        mongo.disconnect();  
        if (err){
          console.log(err);
          cb(err, null);
        } else {  
          console.log(user2);
          cb(null, user2);
        }
      });   
      //console.log(userProfile);
      //cb(null, user);
    }
  });  
}
