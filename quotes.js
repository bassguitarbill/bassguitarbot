const fs = require('fs');


function hasQuotesPage(channelName, callback) {
    fs.stat('quotes/' + channelName.toLowerCase(), (err, stat) => {callback(!!stat)})        
}

function getQuotes(channelName, callback) {
    hasQuotesPage(channelName, exists => {
        console.log('WE IN THEEEEEERE', channelName.toLowerCase(), exists)
        if(exists) {
            fs.readFile('quotes/' + channelName.toLowerCase(), {encoding: "UTF-8"}, (err, data) => {
                if(err) throw err
                console.log(data)
                callback(data.split("\n").filter(line => !!line))
            })
        } else {
            fs.writeFile('quotes/' + channelName.toLowerCase(), "\n", err => {
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
    fs.appendFile('quotes/' + channelName.toLowerCase(), quote + "\n", err => {
        if(err) console.log(err);
        callback(err ? "Couldn't add quote" : "Successfully added quote")
    })
}

module.exports = {
    getRandomQuote: getRandomQuote,
    addQuote: addQuote
} 
