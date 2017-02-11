var irc = require('tmi.js');

var credentials = require('./credentials');
var user = credentials.username;
var pass = credentials.pass;

var botName = user; 

var loadChannelList = require('./channel-list');

var listeners = require('./listeners');

var DelayQueue = require('./message-queue').DelayQueue;

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
    // The bot should not respond to itself.
    if(user.username.toLowerCase() == botName)
        return;

    for(l in listeners){
        if(listeners[l].regex.test(msg)){
            var chanWithoutHash = chan.substring(1)
            if(!listeners[l].modonly || (user.mod || user.username == chanWithoutHash)){
                //bot.client.say(chan, listeners[l].response(chan, user, msg));
                //var response = listeners[l].response(chan, user, msg);
                listeners[l].response(chanWithoutHash, user, msg, response => {bot.messageQueue.addMessage([bot.client, chan, response])})
            }
        }
    }
});

function dequeueMessage(rsp) {
    //var [say, chan, responseMsg] = rsp;
    //say(chan, responseMsg);
    rsp[0].say(rsp[1], rsp[2]);
}

var bot = {
    client: client,
    messageQueue: new DelayQueue(dequeueMessage),
    channels: []
};

function loadChannels() {

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
    });
}

loadChannels()

bot.connect = function() {
    client.connect();
}

bot.disconnect = function() {
    client.disconnect();
}

bot.connected = function() {
    return client.readyState()
}

bot.addChannel = function(channelName, callback) {
    /*
                This should do some checking to make sure the channel is a real channel. Maybe
                by using the Twitch API? Anyway for now, don't check.
                */
    console.log('trying to add', channelName);

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

bot.getUsername = function() {
    return client.getUsername()
}

module.exports = bot;
