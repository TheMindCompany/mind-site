
/**
 * Module dependencies.
 */

var express = require('express')
  , app = express()
  , http = require('http').createServer(app)
  , io = require('socket.io').listen(http)
  , path = require('path')
  , util = require('util')
  , connect = require('connect')
  , cookie = require('cookie');

var Auth = require('./lib/auth.js');

var store = new express.session.MemoryStore();

// all environments

app.configure(function() {
	//Display configuration.
	app.set('port', process.env.PORT || 80);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	// Set session features.
	app.use(express.cookieParser('thisIsASecret'));
	app.use(express.session({ store: store, secret: 'thisIsASecret', key: 'something'}));
	
  app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico'))); 
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Directory navigation
var routes = require('./routes')
  , user = require('./routes/user')
  , admin = require('./routes/admin');

// General functions
app.post('/email', routes.email);

// Registrastion & Login
app.get('/register', user.registerform);
app.post('/register', user.register);
app.get('/login', user.loginform);
app.post('/login', user.login);

// General Pages
app.get('/', routes.index);
// Blog
app.get('/blog', routes.blog);
app.get('/blog/:htmlID', routes.blogID);
// Tutorials
app.get('/tutorials', routes.tuts);
app.get('/tutorials/:htmlID', routes.tutsID);
// Labs
app.get('/laboratory', routes.labs);
app.get('/laboratory/:htmlID', routes.labsID);

// Account Pages
app.get('/profile/:profileID', user.profile);
app.get('/profile/:profileID/edit', user.profileEdit);
app.post('/profile/:profileID/edit', user.profilePost);
// Admin Pages
app.get('/admin-panel', Auth.admin, admin.index);
app.post('/blog/post', Auth.admin, admin.blog_post);
app.post('/tuts/post', Auth.admin, admin.tuts_post);
app.post('/labs/post', Auth.admin, admin.labs_post);

http.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Configure socket.io. 
io.configure(function() {
	io.set('transports', [ 'websocket', 'xhr-polling' ]); 
	io.set('authorization', function(handshake, cb) {
		if (handshake.headers.cookie){
			handshake.cookie = cookie.parse(handshake.headers.cookie);
			handshake.sessionID = connect.utils.parseSignedCookie(handshake.cookie['something'], 'thisIsASecret');
			if (handshake.cookie['something'] === handshake.sessionID){
				return cb('Your a cookie faker.', false);
			}
		} else {
			return cb('Unable to establish session.', false);
		}
		cb(null, true);
	});
});

io.sockets.on('connection', function(socket){
	console.log('Connected: ' + socket.handshake.address.address + ':' + socket.handshake.address.port);	
});	
