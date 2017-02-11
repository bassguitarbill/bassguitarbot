$(document).ready(function(){
    refreshChannels();
    setupAddChannel();
    refreshBotStatus();
    window.setInterval(refreshBotStatus, 1000);
});

function makeChannelsClickable() {
    $('.channel').click(selectChannel);
}

function selectChannel(ev){
    $('.channel').removeClass('selected');
    $(ev.currentTarget).addClass('selected');
}

function refreshChannels() {
    $.getJSON('../api/current-channels', function(data) {
        console.log(data);
        var selectedChannel = $('.channel.selected');
        $('.channel').remove();
        data.channelList = data.channelList ? data.channelList : []
        console.log(data);
        data.channelList.forEach(function(ch){
            var channel = $(document.createElement('li'))
                .addClass('channel')
                .append('<span>' + ch + '</span>')
                .append("<div class='marker offline' id='marker-" + ch.toLowerCase() + "'>&nbsp;</div>");
            $('.channel-list').prepend(channel);
        });
        refreshConnectedChannels();
        makeChannelsClickable();
        setupConnectChannels();
    });


}

function refreshConnectedChannels() {
    $.getJSON('../api/connected-channels', function(data) {
        console.log(data);
        data.channelList.forEach(function(ch){
            $('#marker-' + ch)
                .removeClass('offline')
                .removeClass('connecting')
                .addClass('online');
        });
    });


}

function addChannel(channelName) {
    var chan = channelName || $('.new-channel-name').val();
    $.post('../api/add-channel?chan=' + chan, null, function(data){
        console.log(data);
        $('.new-channel-box').toggleClass('invisible');
        refreshChannels();
    }).fail(function(data){
        console.log(data);
        $('.new-channel-box').toggleClass('invisible');
    });
}

function setupAddChannel() {
    $('.marker.add-new').click(function(ev){
        $('.new-channel-box').toggleClass('invisible');
	$('.new-channel-name').focus();
    });
}

function connectChannel(channelName) {
    $.get("../api/is-connected", function(status) {
	if(status == "OPEN") {
    	    $('#marker-' + channelName).removeClass('offline').addClass('connecting');
	    $.post('../api/connect-channel?chan=' + channelName, null, function(data){
	        $('#marker-' + channelName).removeClass('connecting').addClass('online');
	        console.log(data);
	        refreshChannels();
	    }).fail(function(data){
	        console.log(data);
	    });
	} else {
	    console.log("Can't connect to " + channelName + ", bot is " + status)
	}
    })
}

var markerRegex = /marker-(.*)/
    function clickMarker(ev) {
        console.log(ev);
        if($(ev.target).hasClass('offline')){
            connectChannel(markerRegex.exec(ev.target.id)[1]);
        } else {
            console.log(ev.target.class);
        }
    }

function setupConnectChannels() {
    $('.channel>.marker').click(clickMarker);
}

function submit(){
    var msg = document.getElementById('messageField').value;
    var req = new XMLHttpRequest();
    var chan = $('.selected>span').text();
    req.open('POST', '../api/chat?chan=' + chan, true);
    req.setRequestHeader('content-type', 'application/json');
    req.send(JSON.stringify({
    	message: msg
    }));
    document.getElementById('messageField').value = "";
}

function connect() {
	$.post("../api/connect", data => refreshBotStatus())
}

function disconnect() {
	$.post("../api/disconnect", data => refreshBotStatus())
}

function refreshBotStatus() {
	$.get("../api/is-connected", status => $('.bot-status').text(status));
	$.get("../api/get-username", username => $('.bot-name').text(username));
}
