// Get settings
var prefs = {};
var settings = {
	"contentTypes": {
		"name": {
			"allowNewlines": false,
			"default": "User"
		},
		"notes": {
			"default": "Type notes here"
		}
	}
};

// Load in all data into prefs object
chrome.storage.sync.get(Object.keys(settings.contentTypes), function (result) {
	let keys = Object.keys(settings.contentTypes);
	for (i in keys) {
		key = keys[i];
		if (result.hasOwnProperty(key)) {
			prefs[key] = result[key];
		} else {
			saveSetting(settings.contentTypes[key].default, key);
		}
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

	// initialize displays
	$('.name').html(prepTextForDisplay(prefs.name));
	$('.notes').html(prepTextForDisplay(prefs.notes));

	// fade in
	$('.centered_box, .wallpaper').fadeIn();

	$('[contentEditable]').on('keydown', function(e) {
		el = $(e.target);
		contentType = el.attr('data-content-type');

		// don't allow new lines if not allowed for the content type
		if (settings.contentTypes[contentType].allowNewlines === false && e.keyCode === 13) {
			return false;
		}
	});
	$('[contentEditable]').on('drop paste', function(e) {
		// cancel paste
		e.originalEvent.preventDefault();

		// get text representation of clipboard
		var oldText;
		if (e.type == "paste") {
			oldText = e.originalEvent.clipboardData.getData("text/plain");
		} else if (e.type == "drop") {
			oldText = e.originalEvent.dataTransfer.getData("Text");
		}
		
		var text = prepTextForDisplay(oldText);

		// insert text manually
		document.execCommand("insertHTML", false, text);
	});
	$('[contentEditable]').blur(function(e) {
		el = $(e.target);
		contentType = el.attr('data-content-type');

		// parse the text. convert <br/> to newlines
		newSaveText = prepTextForSave(el.html());

		if (newSaveText == "") {
			newSaveText = settings.contentTypes[contentType].default;
		}

		newDisplayText = prepTextForDisplay(htmlDecode(newSaveText));
		el.html(newDisplayText);

		saveSetting(newSaveText, contentType);
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

function prepTextForDisplay(text) {
	return htmlEncode(text).replace(/(?:\r\n|\r|\n)/g, '<br />');
}

function prepTextForSave(text) {
	return $.trim(text).replace(/<\s*br.*?>/g, "\n");
}

function htmlEncode(value){
  //create a in-memory div, set it's inner text(which jQuery automatically encodes)
  //then grab the encoded contents back out.  The div never exists on the page.
  return $('<div/>').text(value).html();
}

function htmlDecode(value) {
  return $('<div/>').html(value).text();
}