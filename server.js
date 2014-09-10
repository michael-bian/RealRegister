var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var email_array = [];
var hour_array = [];


app.get('/', function(req, res){
	res.sendfile('index.html');
});

io.on('connection', function(socket){
	
	console.log('connection')

	socket.on('new_client_data', function(data){

		if(data.input_email_FC != "adminkappa@cranbrook.edu"){
			if(email_array.indexOf(data.input_email_FC) != -1){
				console.log('invalid (already exists)');
				socket.emit('fail_exising');

			} else {

				email_array.push(data.input_email_FC);
				hour_array.push(data.input_hour_FC);
				socket.emit('success');
			}
		} else { 
			console.log('admin access');
			socket.emit('admin_confirm', {email_array_FS: email_array, hour_array_FS: hour_array});
		}
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});