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
	console.log('refreshing channels...' + bot.channels);
	rsp.status(200).json({channelList: bot.channels});
});

app.get('/api/connected-channels', function(req, rsp, next) {
	console.log('refreshing connected channels...' + bot.client.channels.map(function(ch){return ch.slice(1)}));
	rsp.status(200).json({channelList: bot.client.channels.map(function(ch){return ch.slice(1)})}); // remove leading '#'
});

app.post('/api/add-channel', function(req, rsp, next) {
	console.log(req.query);
	bot.addChannel(req.query.chan, function(msg) {
		rsp.status(200).send(msg);
	});
});

app.post('/api/connect-channel', function(req, rsp, next) {
	console.log(req.query);
	bot.connectToChannel(req.query.chan, function(msg) {
		rsp.status(200).send(msg);
	});
});

app.post('/api/chat', function(req, rsp) {
	console.log(req.query);
	if(req.query && req.query.chan){
		var chan = "#" + req.query.chan.toLowerCase();
		if(bot.client.channels.indexOf(chan) > -1){
			bot.client.say(chan, req.body.message);
			rsp.status(200).send();
		} else {
			rsp.status(404).send();
		}
	} else {
		for(var i=0; i<bot.client.channels.length; i++){
			console.log(req.body);
			console.log(bot.client.channels[i], req.body.message);
			bot.client.say(bot.client.channels[i], req.body.message);
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
