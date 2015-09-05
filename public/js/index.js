$(document).ready(function(){
	refreshChannels();
	setupAddChannel();
});

function makeChannelsClickable() {
	$('.channel').each(function(i,ch){
		$(ch).click(selectChannel);
	});
}

function selectChannel(ev){
	$('.channel').removeClass('selected');
	$(ev.currentTarget).addClass('selected');
}

function refreshChannels() {
	$.getJSON('../api/current-channels', function(data) {
		var selectedChannel = $('.channel.selected');
		$('.channel').remove();
		data.channelList.forEach(function(ch){
			var channel = $(document.createElement('li'))
				.addClass('channel')
				.append('<span>' + ch + '</span>')
				.append("<div class='marker offline'>&nbsp;</div>");
			$('.channel-list').prepend(channel);
		});
		makeChannelsClickable();
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
	});
}