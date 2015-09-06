var irc = require('tmi.js');

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
	//console.log(user.username + ": " + msg);
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
		bot.channels = channels;
		clientOptions.channels = channels;
		connectingChannels = channels.map(function(ch){return {channelName: ch, callback: function(){}}});
		client.connect();
	});
}

bot.addChannel = function(channelName, callback) {
	/*
		This should do some checking to make sure the channel is a real channel. Maybe
		by using the Twitch API? Anyway for now, don't check.
	*/
	console.log('trying to add', channelName);
	console.log("to", client);
	
	if(bot.channels.indexOf(channelName) > -1){
		callback('duplicate');
	} else {
		console.log('added', channelName);
		bot.channels.push(channelName);
		callback('success');
	}
}

var connectingChannels = [];

client.on("roomstate", function (channel, state) {
    // Triggered whenever a 'join' completes
	var matchingChan = connectingChannels.filter(function(ch){return channel.toLowerCase() == "#" + ch.channelName.toLowerCase()});
	var match = matchingChan[0];
	if(match){
		connectingChannels.splice(connectingChannels.indexOf(match),1);
		match.callback(state);
	} else {
		console.log("Why did we join this channel? We were not supposed to. %s", channel);
		console.log("We should be joining from", connectingChannels);
	}
	
});

bot.connectToChannel = function(chan, callback) {
	
	connectingChannels.push({channelName: chan, callback: callback});
	client.join(chan);
	
}

module.exports = bot;
