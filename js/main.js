// Get settings
var name;

chrome.storage.sync.get('name', function (result) {
	if (typeof result.name == "undefined") {
		saveName("User");
	} else {
		name = result.name;
	}
});

$( document ).ready(function() {
	var interval = setInterval(function() {
		var momentNow = moment();
		$('.time').html(momentNow.format('h:mm'));

		var hour = momentNow.hours();
		var newWelcomeText;
		if (hour <= 3 || hour >= 6) {
			newWelcomeText = 'Good evening, ';
		} else if (hour >= 4 && hour <= 11) {
			newWelcomeText = 'Good morning, ';
		} else {
			newWelcomeText = 'Good afternoon, ';
		}
		$('.welcome_text').html(newWelcomeText);
	}, 100);
	$('.name').html(name);
	$('.centered_box, .wallpaper').fadeIn();

	/* Set up saving your name by editing the name box */
	$('.name').on('input', function(e) {
		// only keep text, trim it, then shorten it to a max of 30 characters
		newName = $.trim($(e.target).text());
		if (newName == "") {
			newName = "User";
		}
		$(e.target).html(newName.substring(0, 30));
	});
	$('.name').blur(function(e) {
		newName = $.trim($(e.target).text());
		saveName(newName);
	});

	/*
		location stuff to use eventually eventually
		navigator.geolocation.getCurrentPosition(function(position) {
			do_something(position.coords.latitude, position.coords.longitude);
		});
	*/
});

function saveName(newName) {
	name = newName;
	chrome.storage.sync.set({'name': name}, function() {});
	return name;
}