'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var bot = require('./twitchbot');

var app = express();
app.use(bodyParser.json());

var plugins = require('./plugins');

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
    relpath = relpath || '/';
    relpath = relpath == '/' ? '/index.html' : relpath;
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
    // remove leading '#'
    var channelsSansHash = bot.client.channels.map(function(ch){return ch.slice(1)});
    console.log('refreshing connected channels...' + channelsSansHash);
    rsp.status(200).json({channelList: channelsSansHash});
});

app.post('/api/add-channel', function(req, rsp, next) {
    console.log("adding " + req.query.chan)
    bot.addChannel(req.query.chan, function(msg) {
        rsp.status(200).send(msg);
    });
});

app.post('/api/connect-channel', function(req, rsp, next) {
    console.log("connecting " + req.query.chan)
    bot.connectToChannel(req.query.chan, function(msg) {
        rsp.status(200).send(msg);
    });
});

app.post('/api/chat', function(req, rsp) {
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

app.post("/api/connect", function(req, rsp) {
	console.log("connecting - status = " + bot.connected());
    if(bot.connected() == "CLOSED")
        bot.connect()
    rsp.status(200).send();
})

app.post("/api/disconnect", function(req, rsp) {
	console.log("disconnecting - status = " + bot.connected());
    if(bot.connected() == "OPEN")
        bot.disconnect()
    rsp.status(200).send()
})

app.get("/api/is-connected", function(req, rsp) {
    rsp.status(200).send(bot.connected())
})

app.get("/api/get-username", function(req, rsp) {
    rsp.status(200).send(bot.getUsername())
})

app.get("/api/plugins/names", function(req, rsp) {
    plugins.getPluginNames((err, nameList) => {
	rsp.status(err ? 500 : 200).send(err || nameList);
    });
})	

app.get(/\/.*/, function(req, rsp) {
    rsp.status(404).end('There be dragons here');
});

var server = app.listen(8888, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});
