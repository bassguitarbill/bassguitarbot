const fs = require('fs');


function hasQuotesPage(channelName, callback) {
    fs.stat(getQuoteFilePath(channelName), (err, stat) => {callback(!!stat)})        
}

function getQuotes(channelName, callback) {
    hasQuotesPage(channelName, exists => {
        if(exists) {
            fs.readFile(getQuoteFilePath(channelName), {encoding: "UTF-8"}, (err, data) => {
                if(err) throw err
                console.log(data)
                callback(data.split("\n").filter(line => !!line))
            })
        } else {
            fs.writeFile(getQuoteFilePath(channelName), "\n", err => {
                if (err) throw err
                callback([""])
            })
        }
    })
}

function getRandomQuote(channelName, callback) {
    getQuotes(channelName, qList => {
        console.log(qList[Math.floor(Math.random() * qList.length)])
        callback(null, qList[Math.floor(Math.random() * qList.length)])
    })
}

function addQuote(channelName, quote, callback) {
    fs.appendFile(getQuoteFilePath(channelName), quote + "\n", err => {
        if(err) console.log(err);
        callback(err ? "Couldn't add quote" : "Successfully added quote")
    })
}

function getQuoteFilePath(chan) {
    return 'channels/' + chan.toLowerCase() + '/quotes' 
}

module.exports = {
    getRandomQuote: getRandomQuote,
    addQuote: addQuote
} 
