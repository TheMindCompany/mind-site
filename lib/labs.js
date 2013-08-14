var mongo = require('mongoose')
  , cfg = require('./../config/config')
  , Schema = mongo.Schema;

var Entry =  new Schema({
    title:      {type: String, required: true, sparse: true, unique:true},
    author:     {type: String, required: true}, 
    written_on: {type: Date, default: Date.now},
    article:     {type: String, default:' '}
});

var Labs = mongo.model('Labs', Entry);

function open() {
	mongo.connect('mongodb://' + cfg.mongo_host + ':' + cfg.mongo_port + '/laboratory');
	var db = mongo.connection;
	db.on('error', console.error.bind(console, 'connection error: '));

  return db;
}

function last (cb) {
	var db = open();
  
	db.once('open', function () {    
		Labs.findOne({}, {}, { sort: { 'written_on' : -1 } }, cb);
	});
}

function all (cb) {
	var db = open();
  
	db.once('open', function () {    
		Labs.find({}, cb);
	});
}

module.exports.add = function (title, user, date, content, cb) {	
	var db = open();

	var entry;
  if (date == null) {
    entry = new Labs({
		  title: title, 
		  author: user, 
		  article: content
	  });	
  } else {
    entry = new Labs({
		  title: title, 
		  author: user, 
		  written_on: date, 
		  article: content
	  });	
  }
	entry.save(function(err, labs) {
		if (err) {
			cb(err, null);
		} else {
			cb(null, labs);
		}
		mongo.disconnect();
	});
};

module.exports.lastEntry = function (cb) {	
  last(function(err, data) {
		mongo.disconnect();
		if (err) {
			cb(err, null);
		} else if (data) {
      cb(null, data);
    }
	});
};

module.exports.labs = function (cb) {	
  all(function(err, data) {
		mongo.disconnect();
		if (err) {
			cb(err, null);
		} else if (data) {
      cb(null, data);
    }
	});
};
