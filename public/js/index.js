$(document).ready(function(){
  function selectChannel(ev){
    $('.channel').removeClass('selected');
    $(ev.currentTarget).addClass('selected');
  }
  
  $('.channel').each(function(i,ch){
    $(ch).click(selectChannel);
  });
});