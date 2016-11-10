var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

// connects the chat to the database
mongoose.connect('mongodb://origin-dev:pass1@ds149297-a0.mlab.com:49297/heroku_nrxdgp9h/chat', function(err){ 
	if(err) {
		console.log(err);
	} else {
		console.log('Connection Successful!');
	}
});

var chatSchema = mongoose.Schema({ // message setup
	message: String, 
	created: {type: Date, default: Date.now()}
});

var Chat = mongoose.model('Message', chatSchema);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
  	var newMsg = new Chat({message: msg}); // logs messages
  	newMsg.save(function(err) {
  		if(err) throw err;
    	io.emit('chat message', msg);
    });
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
