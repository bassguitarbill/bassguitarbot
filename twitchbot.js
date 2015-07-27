var irc = require('twitch-irc');

var pass = require('./credentials').pass; 

var clientOptions = {
	options: {
		debug: true
	},
	identity: {
		username: 'bassguitarbot',
		password: pass
	},
	channels: ['bassguitarbill']
}

var client = new irc.client(clientOptions);

client.addListener('chat', function(chan, user, msg) {
	console.log(user.username + ": " + msg);
});

var bot = {
	client: client
};

bot.connect = function() {
	client.connect();
}

module.exports = bot;
