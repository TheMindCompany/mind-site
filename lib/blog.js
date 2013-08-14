var mongo = require('mongoose')
  , cfg = require('./../config/config')
  , Schema = mongo.Schema;

var Entry =  new Schema({
    title:      {type: String, required: true, sparse: true, unique:true},
    author:     {type: String, required: true}, 
    written_on: {type: Date, default: Date.now},
    article:     {type: String, default:' '}
});

var Blog = mongo.model('Blog', Entry);

function open() {
	mongo.connect('mongodb://' + cfg.mongo_host + ':' + cfg.mongo_port + '/blogs');
	var db = mongo.connection;
	db.on('error', console.error.bind(console, 'connection error: '));

  return db;
}

function last (cb) {
	var db = open();
  
	db.once('open', function () {    
		Blog.findOne({}, {}, { sort: { 'written_on' : -1 } }, cb);
	});
}

module.exports.add = function (title, user, date, content, cb) {	
	var db = open();

	var entry;
  if (date == null) {
    entry = new Blog({
		  title: title, 
		  author: user, 
		  article: content
	  });	
  } else {
    entry = new Blog({
		  title: title, 
		  author: user, 
		  written_on: date, 
		  article: content
	  });	
  }
	entry.save(function(err, blog) {
		if (err) {
			cb(err, null);
		} else {
			cb(null, blog);
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
