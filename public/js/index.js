$(document).ready(function(){
	refreshChannels();
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
		console.log(data);
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