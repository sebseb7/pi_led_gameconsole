#!/usr/bin/env node
var fs = require('fs');

var httpServer = require('http').createServer(handler);

var io = require('socket.io').listen(httpServer);

//httpServer.listen(8000,'127.0.0.1');
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


var players = [];


players[0]=0;
players[1]=0;
players[2]=0;


io.sockets.on('connection', function (socket) {
	
	console.log('socket.io conn');
	

	
	socket.on('disconnect', function () {

		if(socket.playernumber != 0)
		{
			players[socket.playernumber-1]=0;
		}

	});


	var myPlayer=0;
	if(players[0]==0)
	{
		myPlayer=1;
	} else
	if(players[1]==0)
	{
		myPlayer=2;
	} else
	if(players[2]==0)
	{
		myPlayer=3;
	}

	if(myPlayer != 0)
	{
		players[myPlayer-1]=1;
	}


	socket.playernumber = myPlayer;

	socket.emit('player',myPlayer);
});



console.log('Server running at http://10.10.11.10:80/');

