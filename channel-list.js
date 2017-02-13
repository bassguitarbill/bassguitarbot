var fs = require('fs');

var channelsPath = 'channels'

function getChannels (callback) {
	
    fs.stat(channelsPath, (error, stat) => {
	if(error) {
	    fs.mkdir(channelsPath, () => {
		    callback(null, []);
		})
	} else {
            fs.readdir(channelsPath, (error, filenames) => {
                if(error){
                    console.log(error)
                    callback(error)
                } else {
                    // sync!!
                    callback(null, filenames.filter(name => fs.statSync(channelsPath + '/' + name).isDirectory()))
	        }
	    })
    	}
    })
}

function addChannel(channelName, callback) {
	getChannels((err, channelNames) => {
		if(err) {
			callback(err);
		} else if(channelNames.includes(channelName)) {
			callback(null, channelNames);
		} else {
			fs.mkdir(channelsPath + "/" + channelName.toLowerCase(), () => {
				getChannels(callback);
			});
		}
	});
}

module.exports = {
	getChannels:getChannels,
	addChannel:addChannel
}


