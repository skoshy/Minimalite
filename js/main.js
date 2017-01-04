$( document ).ready(function() {
	var interval = setInterval(function() {
		var momentNow = moment();
		$('.time').html(momentNow.format('hh:mm'));
	}, 100);
	$('.time').fadeIn();
});