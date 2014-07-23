var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clients = [];

app.get('/', function(req, res){
	res.sendfile('index.html');
});

io.on('connection', function(socket){
	console.log('connection');
	clients.push(socket.id);

	if(clients.length > 1){
		socket.broadcast.to(clients[clients.length - 2]).emit('send_data');
	}

	socket.on('send_update', function(input_data){
		socket.broadcast.to(clients[clients.length - 1]).emit('new_client_update', input_data);
	});

	socket.on('new_user_text', function(new_data){
		io.sockets.emit('client_update_text', new_data);
	});

	socket.on('disconnect', function(){
		var remove_value = clients.indexOf(socket.id);
		clients.splice(remove_value, 1);
	});

});

http.listen(3000, function(){  
	console.log('listening on *:3000');
});