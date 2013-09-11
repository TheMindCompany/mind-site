var mongo = require('mongoose')
  , Schema = mongo.Schema
  , open = require('./mongo.js');

var NavPlace =  new Schema({
    title:    String,
    location: String, 
    nav_home: String,
    external: {type: String, default: 'true'},
    order:    String
});

var Navi = mongo.model('navigations', NavPlace);

function list(item, cb) {
	var db = open.open_nav();
  
	db.once('open', function () {    
		Navi.find({nav_home:item}, cb);
	});
}

module.exports.navList = function (item, cb) {
  list(item, function(err, data) {
		mongo.disconnect();
		if (err) {
			cb(err, null);
		} else if (data) {
      cb(null, data);
    }
	});
};
