var fs = require('fs');

const pluginPath = 'plugins'
const chanPath = 'channels'
const pluginManifest = 'plugin-manifest.json'

function getPluginNames(callback) {
    fs.readdir(pluginPath, (err, filenames) => {
	callback(err || filenames);
    })
}

function getPluginManifest(chan, callback) {
    var path = chanPath + '/' + chan + '/' + pluginManifest
    fs.readFile(path, 'utf8', (err, data) => {
	if(err && err.code == "ENOENT") {
	    fs.writeFile(path, "{\"plugin-instances\":[]}", err => {
		if(err) {
		    callback(err)
	    	} else {
		    console.log("Successfully generated manifest for " + chan)
		    callback(null,[])
	    	}
	    })
	} else if (err) {
	    callback(err)
	} else {
	    var mf = JSON.parse(data)
	    if(mf && mf['plugin-instances'])
	    	callback(null, mf['plugin-instances'])
	    else
		callback('plugin-instances.json is incorrectly formed')
	}
    })
}

function loadPlugins(chan, callback) {
    getPluginManifest(chan, (err, instances) => {
	if(err) {
	    callback(err);
	} else {
	    var pluginList = [];
	    instances.forEach(i => {
		var p = require('./plugins/' + i.type + '/main')
		pluginList.push(new p(chan, i.name, i.data));
	    });
	    callback(pluginList)	
	}
    })
}

module.exports = {
    getPluginNames: getPluginNames,
    getPluginManifest: getPluginManifest,
    loadPlugins: loadPlugins
}
