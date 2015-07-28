var irc = require('twitch-irc');

var credentials = require('./credentials');
var user = credentials.username;
var pass = credentials.pass; 

var loadChannelList = require('./load-channel-list');

var clientOptions = {
	options: {
		debug: true
	},
	identity: {
		username: user,
		password: pass
	}
}

var client = new irc.client(clientOptions);

client.addListener('chat', function(chan, user, msg) {
	console.log(user.username + ": " + msg);
});

var bot = {
	client: client
};

bot.connect = function() {
	loadChannelList(function(error, channels) {
		if(error){
			console.log('Error loading channel list: %s', error);
			channels = [];
		} else {
			console.log('Loaded channels: %s', channels);
		}
		clientOptions.channels = channels;
		client.connect();
	});
}

module.exports = bot;
