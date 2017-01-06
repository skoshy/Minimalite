// Get settings
var prefs = {};
var settings = {
	"contentTypes": {
		"name": {
			"allowNewlines": false,
			"default": "User",
			"maxCharacters": 30,
			"class": "name"
		},
		"notes": {
			"default": "Type notes here",
			"class": "notes"
		},
		"weather_location": {
			"default": "New York",
			"allowNewlines": false,
			"maxCharacters": 30
		},
		"custom_image": {
			"default": "https://source.unsplash.com/category/nature/1920x1080/daily",
			"class": "custom_image_field",
			"allowNewLines": false
		}
	}
};

var weather = {
	timeUpdated: "",
	location: "New York", // default

	city: "",
	currently: "",
	image: "",
	low: "",
	high: "",
	temp: "",
	todayCode: "",
	wind: {}
};

// Load in all data into prefs object
chrome.storage.sync.get(Object.keys(settings.contentTypes), function (result) {
	let keys = Object.keys(settings.contentTypes);
	for (i in keys) {
		key = keys[i];
		if (result.hasOwnProperty(key)) {
			prefs[key] = result[key];
		} else {
			saveSetting(settings.contentTypes[key].default, key, true);
			updatePrefsDisplay(key);
		}
	}
});

// Load in weather data from local store
chrome.storage.local.get(Object.keys(weather), function (data) {
	let keys = Object.keys(weather);
	let dataExists = false;
	for (i in keys) {
		key = keys[i];
		if (data.hasOwnProperty(key)) {
			dataExists = true;
			weather[key] = data[key];
		}
	}

	if (
		!dataExists || // if we've never gotten the weather before
		weather.timeUpdated < moment().format("x")-3600000 // or if the weather data is outdated
	) {
		console.log("Getting weather data...");
		getAndUpdateWeather(weather.location);
	}
});

$( document ).ready(function() {
	var interval = setInterval(function() {
		var momentNow = moment();
		$('.time').html(momentNow.format('h:mm'));

		var hour = momentNow.hours();
		var newWelcomeText;
		if (hour <= 3 || hour >= 18) {
			newWelcomeText = 'Good evening, ';
		} else if (hour >= 4 && hour <= 11) {
			newWelcomeText = 'Good morning, ';
		} else {
			newWelcomeText = 'Good afternoon, ';
		}
		$('.welcome_text').html(newWelcomeText);
	}, 100);

	// initialize displays
	updatePrefsDisplay("name");
	updatePrefsDisplay("notes");
	updatePrefsDisplay("custom_image");
	updateWeatherDisplay();

	// fade in
	$('.centered_box').fadeIn();
	$('.wallpaper img').on("load", function(e) {
		el = $(e.target);
		parent = el.parent();

		parent.fadeIn();
	});

	$('.prefs_button').click(function() {
		$('.prefs_panel').toggle();
	});

	$('[contentEditable]').on('keydown', function(e) {
		el = $(e.target);
		contentType = el.attr('data-content-type');

		// don't allow new lines if not allowed for the content type
		if (settings.contentTypes[contentType].allowNewlines === false && e.keyCode === 13) {
			return false;
		}

		// don't allow typing more characters if reached max
		if (
			settings.contentTypes[contentType].maxCharacters <= el.text().length
			&& e.key.length == 1 // this limits it to only keys that insert text
			&& !(e.keyCode == 8 || e.keyCode == 46) // check to see if we're hitting backspace or delete
			&& !(e.ctrlKey)
			&& !(e.altKey)
		) {
			return false;
		}
	});
	$('[contentEditable]').on('drop paste', function(e) {
		el = $(e.target);
		originalText = el.text();

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

		// don't allow new lines if not allowed for the content type
		if (settings.contentTypes[contentType].allowNewlines === false) {
			text = removeLinebreaksForDisplay(text);
		}

		// don't allow more characters if reached max
		if (settings.contentTypes[contentType].maxCharacters <= originalText.length+text.length) {
			return false;
		}

		// insert text manually
		document.execCommand("insertHTML", false, text);
	});
	$('[contentEditable]').blur(function(e) {
		el = $(e.target);
		contentType = el.attr('data-content-type');

		// parse the text. convert <br/> to newlines
		newSaveText = prepTextForSave(el.html());

		// if blank, change to default text
		if (newSaveText == "" || el.text() == "") {
			newSaveText = settings.contentTypes[contentType].default;
		}

		newDisplayText = prepTextForDisplay(htmlDecode(newSaveText));
		el.html(newDisplayText);

		if (contentType == "weather_location") {
			getAndUpdateWeather(newSaveText);
		} else {
			saveSetting(newSaveText, contentType, true);
			updatePrefsDisplay(contentType);
		}
	});

	/*
		location stuff to use eventually eventually
		navigator.geolocation.getCurrentPosition(function(position) {
			do_something(position.coords.latitude, position.coords.longitude);
		});
	*/
});

function saveSetting(newText, key, isSync) {
	prefs[key] = newText;
	newSetting = {};
	newSetting[key] = newText;

	if (isSync) {
		storageType = "sync";
	} else {
		storageType = "local";
	}

	chrome.storage[storageType].set(newSetting, function() {});
	return newText;
}

function prepTextForDisplay(text) {
	return htmlEncode(text).replace(/(?:\r\n|\r|\n)/g, '<br>');
}

function prepTextForSave(text) {
	return $.trim(text).replace(/<\s*br.*?>/g, "\n");
}

function updatePrefsDisplay(key) {
	$('.'+settings.contentTypes[key].class).html(prepTextForDisplay(prefs[key]));

	if (key == "custom_image") {
		if (prefs[key] == "") {
			$('.wallpaper').css('background-image', "");
			$('.wallpaper img').attr('src', "");
		} else {
			$('.wallpaper').css('background-image', "url("+prefs[key]+")");
			$('.wallpaper img').attr('src', prefs[key]);
		}
	}
}

function removeLinebreaksForDisplay(text) {
	return text.replace(/<\s*br.*?>/g, " ");
}

function htmlEncode(value){
  //create a in-memory div, set it's inner text(which jQuery automatically encodes)
  //then grab the encoded contents back out.  The div never exists on the page.
  return $('<div/>').text(value).html();
}

function htmlDecode(value) {
  return $('<div/>').html(value).text();
}

function getAndUpdateWeather(location) {
	$.simpleWeather({
		location: location,
		unit: 'f',
		woeid: '',
		success: function(weather) {
			console.log("Weather received! Updating...");
			updateWeather(weather);
			updateWeatherDisplay();
		},
		error: function(error) {
			console.log(error);
			$('.weather_location_container').effect("highlight", {color: "ff9595"}, 2000);
		}
	});
}

function updateWeather(weatherObj) {
	let keys = Object.keys(weatherObj);
	for (i in keys) {
		key = keys[i];

		if (weatherObj.hasOwnProperty(key)) {
			weather[key] = weatherObj[key];
			saveSetting(weather[key], key, false);
		}
	}

	// finally, update time updated
	weather.timeUpdated = moment().format("x");
	saveSetting(weather.timeUpdated, "timeUpdated", false);
}

function updateWeatherDisplay() {
	if (weather.city != "") {
		$('.weather .weather_high').html(weather.high+"&deg;");
		$('.weather .weather_low').html(weather.low+"&deg;");
		$('.weather .weather_icon').attr("src", "/icons/weather/"+weather.todayCode+".svg");
		$('.weather .weather_location').html(weather.city);
	}
}