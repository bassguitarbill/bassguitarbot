'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var bot = require('./twitchbot');

var app = express();
app.use(bodyParser.json());


var publicPath = /web-interface(\/.*)/;
app.get(publicPath, function(req, rsp, next) {
	
	var options = {
		root: 	__dirname + '/public/',
		headers:{
			'x-timestamp': 	Date.now(),
			'x-sent':	true
		}
	};
	var relpath = publicPath.exec(req.path)[1];
	console.log(relpath);
	relpath = relpath || '/';
	relpath = relpath == '/' ? '/index.html' : relpath;
	console.log(relpath);
	rsp.sendFile(relpath, options, function(err) {
		if (err) {
			console.log(err);
			rsp.status(err.status).send('There be dragons here').end();
		} else {
			console.log("Sent %s", relpath);
		}
	});
});

app.get('/web-interface', function(req, rsp, next) {
	rsp.set({'Location': '/web-interface/'});
	rsp.sendStatus(301);
});

app.get('/api/current-channels', function(req, rsp, next) {
	console.log("something:");
	rsp.status(200).json({channelList: bot.client.currentChannels});
});

app.post('/api/broadcast', function(req, rsp) {
	console.log(req.query);
	if(req.query && req.query.chan){
		if(bot.client.currentChannels.indexOf(req.query.chan) > -1){
			bot.client.say(req.query.chan, req.body.message);
			rsp.status(200).send();
		} else {
			rsp.status(404).send();
		}
	} else {
		for(var i=0; i<bot.client.currentChannels.length; i++){
			console.log(req.body);
			console.log(bot.client.currentChannels[i], req.body.message);
			bot.client.say(bot.client.currentChannels[i], req.body.message);
		}
		rsp.status(200).send();
	}
}); 

app.get(/\/.*/, function(req, rsp) {
	rsp.status(404).end('There be dragons here');
});

var server = app.listen(8888, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Listening at http://%s:%s', host, port);
	bot.connect();
});
