var fs = require('fs');

var channelListPath = 'channels';

loadChannelNames = function(callback) {
	
	fs.readFile(channelListPath, 'utf8', function(error, data) {
		if(error){
			console.log(error);
			if(error.code == 'ENOENT'){
				fs.writeFile(channelListPath, "", function(err) {
					console.log('Trying to write blank channel list');
					if(err) {
						callback(err);
					} else {
						callback(null, []);
					}
				});
			} else {
				callback(error);
			}
		} else {
			callback(null, data.split(","));
		}
	});
}

module.exports = loadChannelNames;
		
	
