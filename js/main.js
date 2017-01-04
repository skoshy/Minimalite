// Get settings
var name;

chrome.storage.sync.get('name', function (result) {
	if (typeof result.name == "undefined") {
		changeName();
	} else {
		name = result.name;
	}
});

$( document ).ready(function() {
	var interval = setInterval(function() {
		var momentNow = moment();
		$('.time').html(momentNow.format('h:mm'));
	}, 100);
	$('.name').html(name);
	$('.name').click(function() {
		changeName();
	});
	$('.centered_box, .wallpaper').fadeIn();
	/*
		location stuff to use eventually eventually
		navigator.geolocation.getCurrentPosition(function(position) {
			do_something(position.coords.latitude, position.coords.longitude);
		});
	*/
});

function changeName() {
	name = window.prompt("What's your name?", "User");
	if (
		name != null &&
		$.trim(name) != ''
	) {
		name = $.trim(name);
		chrome.storage.sync.set({'name': name}, function() {});
		$('.name').html(name);
	}
}