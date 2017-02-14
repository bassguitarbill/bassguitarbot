
function getListeners() {
	return [
		getHelloListener(),
		getGoodbyeListener()
	];
}

function getHelloListener() {
	return {
		regex:/^hello plugin/i,
		modonly:false,
		response: function(chan, user, msg, cb) {
			cb("Well hello there, " + user + "!")
		}
	}
}

function getGoodbyeListener() {
	return {
		regex:/^bye/i,
		modonly:false,
		response: function(chan, user, msg, cb) {
			cb("Later, " + user)
		}
	}
}

module.exports = function(name, data) {
	return {
		getListeners: getListeners
	}
}
