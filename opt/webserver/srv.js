#!/usr/bin/node
var fs = require('fs');

var httpServer = require('http').createServer(handler);

var io = require('socket.io').listen(httpServer);

httpServer.listen(80,'10.10.11.10');

//io.enable('browser client minification');
//io.enable('browser client etag');
//io.enable('browser client gzip');
/*io.set('transports', [
	'websocket',
	'flashsocket',
	'xhr-polling',
	'jsonp-polling'
]);
*/

function handler (req,res) {

	var filename = '/io.html';

	fs.readFile(__dirname + filename,

	function (err,data) {
	
		if(err) {
			
			res.writeHead(500);
			return res.end('Error');
		}

		res.writeHead(200);
		res.end(data);
	});
} 

io.sockets.on('connection', function (socket) {
	
	console.log('socket.io conn');
});



console.log('Server running at http://10.10.11.10:80/');

