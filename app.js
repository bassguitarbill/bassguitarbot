var express = require('express');
var bodyParser = require('body-parser');

var bot = require('./twitchbot');

var app = express();
app.use(bodyParser.json());

app.get('/', function(req, rsp, next) {
	
	var options = {
		root: 	__dirname + '/public/',
		headers:{
			'x-timestamp': 	Date.now(),
			'x-sent':	true
		}
	};
	rsp.sendFile('index.html', options, function(err) {
		if (err) {
			console.log(err);
			rsp.status(err.status).send('There be dragons here').end();
		} else {
			console.log("Sent index.html");
		}
	});
});

app.get(/\/.*/, function(req, rsp) {
	rsp.status(404).end('There be dragons here');
});

app.post('/api/broadcast', function(req, rsp) {
	for(var i=0; i<bot.client.currentChannels.length; i++){
		console.log(bot.client.currentChannels[i], req.body.message);
		bot.client.say(bot.client.currentChannels[i], req.body.message);
	}
	rsp.status(200).send();
}); 

var server = app.listen(8888, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Listening at http://%s:%s', host, port);
	bot.connect();
});
