var address = 'localhost';
var socket = io.connect('http://' + address + ':8000');

socket.on('error', function(err) {
	console.error('Not Connected', err);
});

socket.on('connect', function() {

});
