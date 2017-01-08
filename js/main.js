"use strict";

// constants
var domainMatchings = {
	"google.com": {"color": "rgba(66,133,244,.7)"},
	"youtube.com": {"color": "rgba(255,100,100,.7)"},
	"facebook.com": {"color": "rgba(59,89,152,.7)"},
	"twitter.com": {"color": "rgba(29,161,242,.7)"},
	"reddit.com": {"color": "rgba(255,69,0,.7)"},
	"imgur.com": {"color": "rgba(27,183,110,.7)"},
	"amazon.com": {"color": "rgba(222,181,32,.7)"},
	"ebay.com": {"color": "rgba(228,49,55,.7)"},

	"github.com": {"color": "rgba(0,0,0,.7)"},
	"stackoverflow.com": {"color": "rgba(244,128,36,.7)"},
	"yahoo.com": {"color": "rgba(64,0,144,.7)"},
	"en.wikipedia.org": {"color": "rgba(207,208,210,.7)"},
};

// Get settings
var prefs = {};
var settings = {
	"contentTypes": {
		"name": {
			"allowNewlines": false,
			"default": "Human",
			"maxCharacters": 30,
			"class": "name",
			"autoSelect": true,
		},
		"notes": {
			"default": "Type notes here",
			"class": "notes",
			"allowNewlines": true,
			"autoSelect": true,
		},
		"weather_location": {
			"default": "",
			"allowNewlines": false,
			"maxCharacters": 30,
			"autoSelect": true,
		},
		"custom_image": {
			"default": "https://source.unsplash.com/category/nature/1280x720/daily",
			"class": "custom_image_field",
			"allowNewlines": false,
			"autoSelect": true,
		},
		"blur": {
			"default": false,
			"class": "blur",
			"type": "checkbox"
		},
		"dim": {
			"default": true,
			"class": "dim",
			"type": "checkbox"
		},
		"dim_corners": {
			"default": false,
			"class": "dim_corners",
			"type": "checkbox"
		},
		"celsius": {
			"default": false,
			"class": "celsius",
			"type": "checkbox"
		},
		"bookmarks": {
			"default": [
				{
					"name": "Google",
					"link": "https://google.com",
					"color": domainMatchings["google.com"].color
				},
				{
					"name": "YouTube",
					"link": "https://youtube.com",
					"color": domainMatchings["youtube.com"].color
				},
				{
					"name": "Facebook",
					"link": "https://facebook.com",
					"color": domainMatchings["facebook.com"].color
				},
				{
					"name": "Twitter",
					"link": "https://twitter.com",
					"color": domainMatchings["twitter.com"].color
				},
				{
					"name": "Reddit",
					"link": "https://reddit.com",
					"color": domainMatchings["reddit.com"].color
				},
				{
					"name": "Imgur",
					"link": "https://imgur.com",
					"color": domainMatchings["imgur.com"].color
				},
				{
					"name": "Amazon",
					"link": "https://amazon.com",
					"color": domainMatchings["amazon.com"].color
				},
				{
					"name": "eBay",
					"link": "https://ebay.com",
					"color": domainMatchings["ebay.com"].color
				},
			]
		}
	}
};

var wallpapers = [
	{
		image: 'https://source.unsplash.com/1K5FKIyKVxQ'
	},
	{
		image: 'https://source.unsplash.com/duiETcZN7O4'
	},
	{
		image: 'https://source.unsplash.com/6xh7H5tWj9c'
	},
	{
		image: 'https://source.unsplash.com/NDuPLKYRXQU'
	},
	{
		image: 'https://source.unsplash.com/qLhCKmBjTec'
	},
	{
		image: 'https://source.unsplash.com/7cdFZmLlWOM'
	},
	{
		image: 'https://source.unsplash.com/0A_b9G-Rm6w'
	},
	{
		image: 'https://source.unsplash.com/fWTVzP0os44'
	}
];

var weather = {
	timeUpdated: "",

	weather_location: "New York",
	weather_location_id: "",
	currently: "",
	low: "",
	high: "",
	temp: "",
	condition_code: "",
	wind_speed: "",
	wind_degrees: ""
};

// load in top sites into the default spot
chrome.topSites.get(function(topSites) {
	let maxTopSites = topSites.length;
	$.each(settings.contentTypes.bookmarks.default, function(index, bookmark) {
		if (index >= maxTopSites) {
			return; // no more top sites to replace with defaults
		}

		bookmark.name = topSites[index].title;
		bookmark.link = topSites[index].url;

		// try to match the color based on the domain name. otherwise, generate a random one
		let domainMatched = domainMatchings[getDomainFromUrl(topSites[index].url).replace(/^www\./, '')];
		if (typeof domainMatched != "undefined") {
			bookmark.color = domainMatched.color;
		} else {
			let rgb = getRandomRgb();
			bookmark.color = "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+",.7)";
		}
	});
});

// Load in all data into prefs object
chrome.storage.sync.get(Object.keys(settings.contentTypes), function (result) {
	let keys = Object.keys(settings.contentTypes);
	for (let i in keys) {
		let key = keys[i];
		if (result.hasOwnProperty(key)) {
			prefs[key] = result[key];
		} else {
			saveSetting(settings.contentTypes[key].default, key, true);
		}
		$( document ).ready(function() {updatePrefsDisplay(key);});
	}
});

// Load in weather data from local store
chrome.storage.local.get(Object.keys(weather), function (data) {
	let keys = Object.keys(weather);
	let dataExists = false;
	for (let i in keys) {
		let key = keys[i];
		if (data.hasOwnProperty(key)) {
			dataExists = true;
			weather[key] = data[key];
		}
	}

	if (
		!dataExists || // if we've never gotten the weather before
		weather.timeUpdated < moment().format("x")-3600000 // or if the weather data is outdated
	) {
		if (weather.weather_location_id != "") {
			getAndUpdateWeather(weather.weather_location_id, true);
		} else {
			getAndUpdateWeather(weather.weather_location, false);
		}
	}

	$( document ).ready(function() {updateWeatherDisplay();});
});

$( document ).ready(function() {
	let interval = setInterval(function() {
		let momentNow = moment();
		$('.time').html(momentNow.format('h:mm'));

		let hour = momentNow.hours();
		let newWelcomeText;
		if (hour <= 3 || hour >= 18) {
			newWelcomeText = 'Good evening, ';
		} else if (hour >= 4 && hour <= 11) {
			newWelcomeText = 'Good morning, ';
		} else {
			newWelcomeText = 'Good afternoon, ';
		}
		$('.welcome_text').html(newWelcomeText);
	}, 100);

	// add in all wallpaper thumbs
	addWallpaperThumbs();

	// bookmarks stuff
	$('.bookmarks_editor input').on('focus click', function() {
		selectTextIfNeeded(this);
	})
	$('.bookmarks_editor .bookmarks_button_save').click(function() {
		saveBookmarks();
	});
	$('.bookmarks_editor .bookmarks_button_cancel').click(function() {
		hideBookmarkEditor();
	});
	

	// fade in
	$('.centered_box').fadeIn();
	$('.wallpaper img').on("load", function(e) {
		$(this).parent().fadeIn(50);
	});

	$('.reset_wallpaper_button').click(function() {
		let contentType = 'custom_image';

		saveSetting(settings.contentTypes[contentType].default, contentType, true);
		updatePrefsDisplay(contentType);
	});
	$('.reset_settings').click(function() {
		confirmResetSettings();
	});

	$('.prefs_button').click(function() {
		$('.prefs_panel').stop().fadeToggle(200);
	});

	$('.prefs_panel').closest('.widget_outer').mouseleave(function() {
		$(this).find('.prefs_panel').stop().fadeOut(200);
	});

	$('input[type="checkbox"]').change(function(e) {
		let el = $(this);
		let contentType = el.attr('data-content-type');

		saveSetting(this.checked, contentType, true);
		updatePrefsDisplay(contentType);
	});

	// makes it easy to focus on editable items. will auto select them, if the settings say to do so.
	$('[data-content-type]:not([type="checkbox"])').on("focus click", function(e) {
		let el = $(this);
		let contentType = el.attr('data-content-type');
		if (settings.contentTypes[contentType].autoSelect) {
			selectTextIfNeeded(this);
		}
	});
	$('[data-content-type]:not([type="checkbox"])').on('keydown', function(e) {
		let el = $(e.target);
		let contentType = el.attr('data-content-type');
		let text = getOrEditText(el, undefined, true);

		// don't allow new lines if not allowed for the content type. instead, submit.
		if (settings.contentTypes[contentType].allowNewlines === false && e.keyCode === 13) {
			submitContentEditable(el);
			return false;
		}

		// don't allow typing more characters if reached max
		if (
			settings.contentTypes[contentType].maxCharacters <= text.length
			&& e.key.length == 1 // this limits it to only keys that insert text
			&& !(e.keyCode == 8 || e.keyCode == 46) // check to see if we're hitting backspace or delete
			&& !(e.ctrlKey)
			&& !(e.altKey)
		) {
			return false;
		}
	});
	$('[data-content-type]:not([type="checkbox"])').on('drop paste', function(e) {
		let el = $(e.target);
		let originalText = getOrEditText(el, undefined, true);

		// cancel paste
		e.originalEvent.preventDefault();

		// get text representation of clipboard
		let text;
		if (e.type == "paste") {
			text = e.originalEvent.clipboardData.getData("text/plain");
		} else if (e.type == "drop") {
			text = e.originalEvent.dataTransfer.getData("Text");
		}

		// don't allow new lines if not allowed for the content type
		if (settings.contentTypes[contentType].allowNewlines === false) {
			text = removeLinebreaksForDisplay(text);
		}

		// don't allow more characters if reached max
		if (settings.contentTypes[contentType].maxCharacters <= originalText.length+text.length) {
			return false;
		}

		// insert text manually
		document.execCommand("insertHTML", false, convertLinebreaksToBrs(text));
	});
	$('[data-content-type]:not([type="checkbox"])').blur(function(e) {
		submitContentEditable(this);
	});

	/*
		location stuff to use eventually eventually
		navigator.geolocation.getCurrentPosition(function(position) {
			do_something(position.coords.latitude, position.coords.longitude);
		});
	*/
});

function addWallpaperThumbs() {
	$.each(wallpapers, function(index, wallpaper) {
		$('.wallpaper_thumbs').append(
			$('<img>')
				.attr('src', wallpaper.image+"/84x65")
				.attr('value', wallpaper.image+"/1280x720")
				.attr('data-content-type', 'custom_image')
				.click(function() {
					submitContentEditable(this);
				})
		);
	});
}

/*
	params
	- el -> element
	- text -> text to set. undefined if we're just getting the text.
	- isPlainText -> bool. true if getting/setting plain text (.text() instead of .html()). defaults to false
*/
function getOrEditText(el, text, isPlainText) {
	if (typeof isPlainText == "undefined") {
		isPlainText = false;
	}

	el = $(el);
	let tagName = el.prop('tagName');

	let toReturn = '';

	if (tagName == "DIV" || tagName == "SPAN") {
		if (typeof text == "undefined") {
			toReturn = htmlDecode(convertBrsToLinebreaks(el.html()));
		} else {
			toReturn = el.html(convertLinebreaksToBrs(htmlEncode(text)));
		}
	} else if (tagName == "INPUT") {
		if (typeof text == "undefined") {
			toReturn = el.val();
		} else {
			toReturn = el.val(text);
		}
	} else if (tagName == "IMG") {
		if (typeof text == "undefined") {
			if (typeof el.attr('value') != "undefined") {
				toReturn = el.attr("value");
			} else {
				toReturn = el.attr("src");
			}
		} else {
			if (typeof el.attr('value') != "undefined") {
				toReturn = el.attr("value", text);
			} else {
				toReturn = el.attr("src", text);
			}
		}
	}

	return $.trim(toReturn);
}

function submitContentEditable(el) {
	el = $(el);
	let contentType = el.attr('data-content-type');
	let text = getOrEditText(el);

	// if blank, change to default text
	if (text == "") {
		text = settings.contentTypes[contentType].default;
	}

	// if the value hasn't changed, don't do anything
	if (
		(contentType != "weather_location" && text == prefs[contentType])
		|| (contentType == "weather_location" && text == weather.weather_location)
	) {
		return;
	}

	if (contentType == "weather_location") {
		getAndUpdateWeather(text, false);
	} else {
		saveSetting(text, contentType, true);
		updatePrefsDisplay(contentType);
	}
}

function saveSetting(newText, key, isSync) {
	prefs[key] = newText;
	let newSetting = {};
	newSetting[key] = newText;

	let storageType;
	if (isSync) {
		storageType = "sync";
	} else {
		storageType = "local";
	}

	chrome.storage[storageType].set(newSetting, function() {});
	return newText;
}

function confirmResetSettings() {
	let r = confirm("Are you sure you want to reset all your Minimalite settings?");
	if (r == true) {
		resetSettings();
	}
}

function resetSettings() {
	chrome.storage.sync.clear();
	chrome.storage.local.clear();
	location.reload();
}

function prepTextForDisplay(text) {
	return htmlEncode(text).replace(/(?:\r\n|\r|\n)/g, '<br>');
}

function prepTextForSave(text) {
	return $.trim(text).replace(/<\s*br.*?>/g, "\n");
}

function updatePrefsDisplay(key) {
	let els = $('.'+settings.contentTypes[key].class);

	if (els.length != 0) {
		if (settings.contentTypes[key].type == "checkbox") {
			els.attr("checked", prefs[key]);
		} else {
			$.each(els, function(index, el) {
				getOrEditText(el, prefs[key]);
			});
		}
	}

	if (key == "bookmarks") {
		// first, delete all icons in the area
		$('.bookmarks .icon').remove();
		hideBookmarkEditor();
		// now re-add all of them
		$.each(prefs[key], function(index, bookmark) {
			$('.bookmarks .icons-container').append(
				$('<a>')
					.css('background-color', bookmark.color)
					.addClass('icon')
					.attr('data-color', bookmark.color)
					.attr('href', bookmark.link)
					.attr('title', bookmark.name)
					.html(bookmark.name.substring(0,2))
					.contextmenu(function() {
						showBookmarkEditor(this);
						return false;
					})
			);
		});
		$('.bookmarks .icons-container').sortable({
			stop: function(e, ui) {
				let bookmarksJson = getBookmarkIconsAsJson();
				saveSetting(bookmarksJson, 'bookmarks', true);
				updatePrefsDisplay('bookmarks');
			}
		});
	} else if (key == "custom_image") {
		if (prefs[key] == "") {
			$('.wallpaper').css('background-image', "");
			$('.wallpaper img').attr('src', "");
		} else {
			$('.wallpaper').css('background-image', "url("+prefs[key]+")");
			$('.wallpaper img').attr('src', prefs[key]);
		}
	} else if (key == "blur") {
		if (prefs[key]) {
			$('.wallpaper').addClass('blurred');
		} else {
			$('.wallpaper').removeClass('blurred');
		}
	} else if (key == "celsius") {
		updateWeatherDisplay();
	} else if (key == "dim") {
		if (prefs[key]) {
			$('.wallpaper').addClass('dimmed');
		} else {
			$('.wallpaper').removeClass('dimmed');
		}
	} else if (key == "dim_corners") {
		if (prefs[key]) {
			$('.widget_outer').addClass('dimmed');
		} else {
			$('.widget_outer').removeClass('dimmed');
		}
	}
}

function showBookmarkEditor(el) {
	el = $(el);
	let bookmarksEditor = $('.bookmarks_editor');

	// designate this is the bookmark being edited
	$('.bookmarks .icon').removeClass('being_edited');
	el.addClass('being_edited');

	bookmarksEditor.stop().fadeIn(200);
	bookmarksEditor.find('.bookmark_name').val(el.attr('title'));
	bookmarksEditor.find('.bookmark_link').val(el.attr('href'));
	bookmarksEditor.find('.bookmark_color').val(el.css('background-color')).colorPicker({
			positionCallback: function($elm) {
				let $UI = this.$UI; // this is the instance; this.$UI is the colorPicker DOMElement
				let parent = $('.bookmarks_editor');
				let position = $elm.offset(); // $elm is the current trigger that opened the UI
				let gap = this.color.options.gap; // this.color.options stores all options
				let top = parent.offset().top;
				let left = parent.offset().left+parent.width()+parseInt(parent.css('padding-left'))+parseInt(parent.css('padding-right'));

				// $UI.appendTo('#somwhereElse');
				// do here your calculations with top and left and then...
				return { // the object will be used as in $('.something').css({...});
					left: left,
					top: top
				}
			}
	});
}

function hideBookmarkEditor() {
	let bookmarksEditor = $('.bookmarks_editor');
	let el = $('.bookmarks .icon.being_edited');

	bookmarksEditor.fadeOut(200);
	el.removeClass('being_edited');
}

function saveBookmarks() {
	// we will gather all the data for the bookmarks into the same standardized json format. then we'll pass it to the save and update functions like normal
	let bookmarksEditor = $('.bookmarks_editor');
	let el = $('.bookmarks .icon.being_edited');

	el.attr('title', bookmarksEditor.find('.bookmark_name').val());
	el.attr('href', bookmarksEditor.find('.bookmark_link').val());
	el.attr('data-color', bookmarksEditor.find('.bookmark_color').val());

	let bookmarksJson = getBookmarkIconsAsJson();
	saveSetting(bookmarksJson, 'bookmarks', true);
	updatePrefsDisplay('bookmarks');
}

function getBookmarkIconsAsJson() {
	let bookmarkIcons = $('.bookmarks .icon');
	let bookmarkArray = [];
	$.each(bookmarkIcons, function(index, bookmarkIcon) {
		bookmarkIcon = $(bookmarkIcon);

		bookmarkArray.push({
			"name": bookmarkIcon.attr('title'),
			"link": bookmarkIcon.attr('href'),
			"color": bookmarkIcon.attr('data-color'),
		});
	});
	return bookmarkArray;
}

function removeLinebreaksForDisplay(text) {
	return text.replace(/(?:\r\n|\r|\n)/g, " ");
	// .replace(/<\s*br.*?>/g, " ")
}

function convertToCelsius(fahr) {
	return Math.round((fahr - 32) * (5/9));
}

function convertLinebreaksToBrs(text) {
	return text.replace(/(?:\r\n|\r|\n)/g, "<br>");
}

function convertBrsToLinebreaks(text) {
	return text.replace(/<\s*br.*?>/g, "\n");
}

function htmlEncode(value){
	//create a in-memory div, set it's inner text(which jQuery automatically encodes)
	//then grab the encoded contents back out.  The div never exists on the page.
	let newlineDelim = '%%%%%html_decode_newline%%%%%';
	let pattern = new RegExp(newlineDelim, 'g');
	return $('<div/>').text(
		value.replace(/(?:\r\n|\r|\n)/g, newlineDelim)
	).html().replace(pattern, "\n");
}

function htmlDecode(value) {
	let newlineDelim = '%%%%%html_decode_newline%%%%%';
	let pattern = new RegExp(newlineDelim, 'g');
	return $('<div/>').html(
		value.replace(/(?:\r\n|\r|\n)/g, newlineDelim)
	).text().replace(pattern, "\n");
}

function getAndUpdateWeather(location, isUsingWeatherId) {
	console.log("Getting weather...");

	let param;
	if (isUsingWeatherId) {
		param = 'id';
	} else {
		param = 'q';
	}

	$.get("http://api.k0shy.com/weather/?"+param+"="+location, function( data ) {
		console.log("Weather received! Updating...");
		updateWeather(data);
		updateWeatherDisplay();
	}).fail(function() {
		console.log(error);
		$('.weather_location_container').effect("highlight", {color: "ff9595"}, 2000);
	});
}

function updateWeather(weatherObj) {
	console.log("Saving weather to local storage");
	let keys = Object.keys(weatherObj);
	for (let i in keys) {
		let key = keys[i];

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
	console.log("Updating weather display");
	if (weather.weather_location != "") {
		let high = prefs['celsius'] ? convertToCelsius(weather.high) : weather.high;
		let low = prefs['celsius'] ? convertToCelsius(weather.low) : weather.low;

		$('.weather .weather_high').html(high+"&deg;");
		$('.weather .weather_low').html(low+"&deg;");
		$('.weather .weather_icon').removeClass(function(index, css) {
			return (css.match(/(^|\s)wi-owm-\S+/g) || []).join(' ');
		}).addClass('wi-owm-'+weather.condition_code);
		$('.weather_location').html(weather.weather_location);
	}
}

function getDomainFromUrl(url) {
	return url.split('/')[url.indexOf('//') < 0 ? 0 : 2].split(/[\/?:#&]/)[0]
};

function getRandomRgb() {
	let toReturn = [];
	for (let i = 0; i < 3; i++) {
		toReturn.push(Math.floor(Math.random() * 256));
	}
	return toReturn;
}

function getSelectionText() {
	let text = "";
	let activeEl = document.activeElement;
	let activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
	
	if (
		(activeElTagName == "textarea" || activeElTagName == "input") &&
		/^(?:text|search|password|tel|url)$/i.test(activeEl.type) &&
		(typeof activeEl.selectionStart == "number")
	) {
		text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
	} else if (window.getSelection) {
		text = window.getSelection().toString();
	}
	return text;
}

function selectTextIfNeeded(el) {
	el = $(el);

	// if this property should be auto selected, select it
	if (getSelectionText() == "") {
		let tagName = el.prop('tagName');
		if (tagName == "INPUT" || tagName == "TEXTAREA") {
			el.select();
		} else {
			// need to execute this command for contentEditable things
			document.execCommand('selectAll',false,null);
		}
	}
}