var mongo = require('mongoose')
  , Schema = mongo.Schema
  , open = require('./mongo.js');

var Entry =  new Schema({
    html:       {type: String, required: true, unique:true},
    title:      {type: String, required: true, unique:true},
    author:     {type: String, required: true},
    author_name:{type: String, required: true}, 
    written_on: {type: Date, default: Date.now},
    article:    {type: String, default:' '},
    head_image: {type: String, default:''}
});

var Blog = mongo.model('Blog', Entry);

function last (cb) {
	var db = open.open_db();
  
	db.once('open', function () {    
		Blog.findOne({}, {}, { sort: { 'written_on' : -1 } }, cb);
	});
}

function all (cb) {
	var db = open.open_db();
  
	db.once('open', function () {    
		Blog.find({}, {}, { sort: { 'written_on' : -1 } }, cb);
	});
}

module.exports.add = function (html, title, user, date, content, headImage, cb) {	
	var db = open.open_db();
  console.log(user);
	var entry;
  if (date) {
    entry = new Blog({
		  html: html, 
		  title: title, 
		  author: user._id._id, 
		  author_name: user.first + ' ' + user.middle + ' ' + user.last,
		  written_on: date,  
		  article: content,  
		  head_image: headImage
	  });	
  } else {
    entry = new Blog({
		  html: html,
		  title: title, 
		  author: user._id._id, 
		  author_name: user.first + ' ' + user.middle + ' ' + user.last,
		  article: content,  
		  head_image: headImage
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

module.exports.blog = function (cb) {	
  all(function(err, data) {
		mongo.disconnect();
		if (err) {
			cb(err, null);
		} else if (data) {
      cb(null, data);
    }
	});
};
