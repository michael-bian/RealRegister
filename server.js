var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var currentidnumber = 0;
var noteids = [];
var notes = [];
var clients = [];

app.get('/', function(req, res){
	res.sendfile('index.html');
});

io.on('connection', function(socket){
	console.log('connection');
	clients.push(socket.id);
	io.sockets.emit('new_count', clients.length);

	if(clients.length > 1){
		socket.broadcast.to(clients[clients.length - 2]).emit('send_data');
	}

	socket.on('send_update', function(){
		socket.broadcast.to(clients[clients.length - 1]).emit('new_client_update', notes);
	});

	socket.on('broadcast_request', function(){
		var currentidvalue = "id_" + currentidnumber;
		notes[currentidnumber] = "New Note";
		io.sockets.emit('broadcast_completion', currentidvalue);
		currentidnumber++;
	});

	socket.on('focus_confirmation', function(id){
		console.log(id + " has been focused by " + socket.id);
		socket.broadcast.emit('blur_request', id);
	});

	socket.on('new_client_text', function(data){
		var newValue = data.clientValue;
		var editId = data.elementid;
		var trueId = editId.replace('id_', '');
		notes[trueId] = data.clientValue;
		socket.broadcast.emit('client_update', {editValue: newValue, editID: editId});
	});

	socket.on('blur_confirmation', function(id){
		console.log(id + "has been blurred by " + socket.id);
		socket.broadcast.emit('focus_request', id);
	});

	socket.on('disconnect', function(){
		var remove_value = clients.indexOf(socket.id);
		clients.splice(remove_value, 1);
		io.sockets.emit('new_count', clients.length);
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});