var lines = {
		
	"shovelKnight": {
	
		"levelStart": [
		
			"-IT'S SHOVELING TIME-",
			"-GET DIGGING-",
			"-DIG IN-",
			"-LET'S GET SHOVELING-",
			"-STRIKE THE EARTH-",
			"-SHARPEN THY SHOVEL-",
			"-FOR SHOVELRY-"
		]
	},
	"smrpg": {
		"leftRightMid": [
			"TEAM LEFT",
			"TEAM MID",
			"TEAM RIGHT"
		]
	},
	"bcas": {
		"owns": "ｂｃａｓ ｏｗｎｓ"
	}
}

var listeners = {
	
	shovelKnight: {
		regex: /^!shovel$/,
		quotes: lines.shovelKnight.levelStart,
		response: function(chan, user, msg) {
			var i = Math.floor(Math.random() * this.quotes.length);
			return this.quotes[i];
		}
	},
	smrpg: {
		regex: /^!smrpg$/i,
		quotes: lines.smrpg.leftRightMid,
		response: function(chan, user, msg) {
			if(user.username != "bassguitarbill")
				return "";
			var i = Math.floor(Math.random() * this.quotes.length);
			return this.quotes[i];
		}
	},
	bcas: {
		regex: /^bcas owns$/i,
		quotes: [lines.bcas.owns],
		response: function(chan, user, msg) {
			return this.quotes[0];
		}
	}
		
};


module.exports = listeners;