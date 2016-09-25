const quotes = require('./quotes')

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
                modonly: false,
		quotes: lines.shovelKnight.levelStart,
		response: function(chan, user, msg, cb) {
			var i = Math.floor(Math.random() * this.quotes.length);
			cb(this.quotes[i]);
		}
	},
	smrpg: {
		regex: /^!smrpg$/i,
                modonly: false,
		quotes: lines.smrpg.leftRightMid,
		response: function(chan, user, msg, cb) {
			if(user.username != "bassguitarbill")
				return "";
			var i = Math.floor(Math.random() * this.quotes.length);
			cb(this.quotes[i]);
		}
	},
	bcas: {
		regex: /^bcas owns$/i,
                modonly: false,
		quotes: [lines.bcas.owns],
		response: function(chan, user, msg, cb) {
			cb(this.quotes[0]);
		}
	},
        getQuote: {
            regex: /^!quote$/i,
            modonly: false,
            response: function(chan, user, msg, cb) {
                quotes.getRandomQuote(chan, (err, quote) => cb(quote))
            }
        },
        addQuote: {
            regex: /^!addquote (.+)/i,
            modonly: true,
            response: function(chan, user, msg, cb) {
                    var quote = this.regex.exec(msg)[1]
                    quotes.addQuote(chan, quote, msg => cb(msg))
            }
        }		
}


module.exports = listeners;
