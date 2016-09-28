/* 
        Twitch will destroy you if you chat too often.
        From the twitch.tv IRC documentation:

        If you send more than 20 commands or messages to the server within a 30 second period, 
        you will get locked out for 8 hours automatically. 
        These are not lifted so please be careful when working with IRC!

        So I need a way to make a queue that sends messages quickly as possible,
        but not too quickly in rapid succession.
        */

function DelayQueue(processMessageFunction, cooldownTime) {

    this.ready = true;
    this.messages = [];
    this.cooldownDuration = cooldownTime || 2000;
    this.process = processMessageFunction || function(msg){console.log(msg)};

    this.sendMessage = function() {
        if (this.ready && this.messages.length){
            this.process(this.messages.shift());
            this.setCooldown(this.cooldownDuration);
        }
    }

    this.setCooldown = function(duration) {
        this.ready = false;
        setTimeout(
            function(){
                this.ready = true;
                this.sendMessage();
            }.bind(this), duration);
    }
}

DelayQueue.prototype.addMessage = function(msg) {

    this.messages.push(msg);
    this.sendMessage();
}
module.exports.DelayQueue = DelayQueue;
