var mongo = require('mongoose')
  , cfg = require('./../config/config');

module.exports.open_db = function () {
	mongo.connect('mongodb://' + cfg.mongo_host + ':' + cfg.mongo_port + '/website');
	var db = mongo.connection;
	db.on('error', console.error.bind(console, 'connection error: '));
  return db;
}

module.exports.open_nav = function () {
	mongo.connect('mongodb://localhost/navigation');
	var db = mongo.connection;
	db.on('error', console.error.bind(console, 'connection error: '));
  return db;
}

module.exports.open_user_db = function () {
	mongo.connect('mongodb://' + cfg.mongo_host + ':' + cfg.mongo_port + '/users');
	var db = mongo.connection;
	db.on('error', console.error.bind(console, 'connection error: '));
  return db;
}
