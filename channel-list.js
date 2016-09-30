var fs = require('fs');

var channelsPath = 'channels'

function getChannels (callback) {

    fs.readdir(channelsPath, (error, filenames) => {
        // 'files' is an array of filenames
        if(error){
            console.err(error)
            callback(error)
        } else {
            // sync!!
            callback(null, filenames.filter(name => fs.statSync(channelsPath + '/' + name).isDirectory()))
        }

    })
}

module.exports = getChannels


