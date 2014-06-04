#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var httpServer = require('http').createServer(handler);

var io = require('socket.io').listen(httpServer);
var net = require('net');
var client = new net.Socket();

client.connect(2020,'127.0.0.1', function() {

		console.log('CONNECTED');
});

httpServer.listen(8000,'0.0.0.0');
//httpServer.listen(8000,'192.168.2.1');
//httpServer.listen(80,'10.10.11.10');


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

	var filename = path.basename(req.url) || 'io.html';

	fs.readFile(__dirname + '/' +  filename,

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
var keys = [];


players[0]=0;
players[1]=0;
players[2]=0;

keys[0]=0;
keys[1]=0;
keys[2]=0;



io.sockets.on('connection', function (socket) {
	
	console.log('socket.io conn');
	

	
	socket.on('disconnect', function () {

		if(socket.playernumber != 0)
		{
			players[socket.playernumber-1]=0;
		}
		
		client.write(
		
			String.fromCharCode(keys[0]+players[0]*16)+
			String.fromCharCode(keys[1]+players[1]*16)+
			String.fromCharCode(keys[2]+players[2]*16))
		
		;

	});

	socket.on('keys', function (data) {

		console.log(socket.playernumber+':'+data);
		keys[socket.playernumber-1]=data;



		client.write(
		
			String.fromCharCode(keys[0]+players[0]*16)+
			String.fromCharCode(keys[1]+players[1]*16)+
			String.fromCharCode(keys[2]+players[2]*16))
		
		;
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
		
		client.write(
		
			String.fromCharCode(keys[0]+players[0]*16)+
			String.fromCharCode(keys[1]+players[1]*16)+
			String.fromCharCode(keys[2]+players[2]*16))
		
		;

	socket.emit('player',myPlayer);
});



console.log('Server running at http://10.10.11.10:80/');

