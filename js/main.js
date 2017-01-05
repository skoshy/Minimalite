// Get settings
var prefs = {};

chrome.storage.sync.get('name', function (result) {
	if (typeof result.name == "undefined") {
		saveSetting("User", "name");
	} else {
		prefs.name = result.name;
	}
});

chrome.storage.sync.get('notes', function (result) {
	if (typeof result.notes == "undefined" || result.notes == "") {
		saveSetting("Type notes here", "notes");
	} else {
		prefs.notes = result.notes;
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
	$('.name').html(prefs.name);
	$('.notes').html(prefs.notes);
	$('.centered_box, .wallpaper').fadeIn();

	/* Set up saving your name by editing the name box */
	$('[contentEditable]').on('input', function(e) {
		console.log(e);
		el = $(e.target);
		contentType = el.attr('data-content-type');

		// only keep text, trim it, then shorten it to a max of 30 characters
		newText = el.text().replace(/(?:\r\n|\r|\n)/g, '<br />');
		if (contentType == "name") {
			if (newText == "") {
				newText = "User";
			}
			newText = newText.substring(0, 30);
		} else if (contentType == "notes") {
			if (newText == "") {
				newText = "Type notes here";
			}
		}
		el.html(newText);
	});
	$('[contentEditable]').blur(function(e) {
		el = $(e.target);
		contentType = el.attr('data-content-type');

		newText = $.trim(el.text());
		el.html(newText);

		saveSetting(newText, contentType);
	});

	/*
		location stuff to use eventually eventually
		navigator.geolocation.getCurrentPosition(function(position) {
			do_something(position.coords.latitude, position.coords.longitude);
		});
	*/
});

function saveSetting(newText, key) {
	prefs[key] = newText;
	newSetting = {};
	newSetting[key] = newText;
	chrome.storage.sync.set(newSetting, function() {});
	return newText;
}