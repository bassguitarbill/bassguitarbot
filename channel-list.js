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

module.exports = getChannels


