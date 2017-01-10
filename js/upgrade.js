"use strict";

upgrade();

function upgrade() {
	// Load in prefs local data
	chrome.storage.local.get(["prefsLocal"], function (data) {
		if (data.hasOwnProperty("prefsLocal")) {
			prefsLocal = data.prefsLocal;
		}

		let prefsVersion = getVersionNumber();

		if (versionCompare(scriptVersion, prefsVersion) > 0) {
			// upgrade
			console.log("Upgrading script...");

			// change daily URL wallpaper from old to new.
			if (
				prefs.custom_image == "https://source.unsplash.com/category/nature/1280x720/daily"
				|| prefs.custom_image == "https://source.unsplash.com/category/nature/1920x1080/daily"
			) {
				saveSetting(settings.contentTypes.custom_image.default, 'custom_image', true);
				updatePrefsDisplay('custom_image');
			}

			// if icons not set for any bookmarks, set them.
			$.each(prefs.bookmarks, function(bkmkIndex, bkmkVal) {
				if (typeof bkmkVal.icon == "undefined") {
					// this is duplicated code for now
					let domainMatched = domainMatchings[getDomainFromUrl(bkmkVal.link).replace(/^www\./, '')];
					if (typeof domainMatched != "undefined") {
						bkmkVal.color = domainMatched.color;
						bkmkVal.icon = domainMatched.icon;
					}
				}
			});
			saveSetting(prefs.bookmarks, "bookmarks", true);
			updatePrefsDisplay('bookmarks');
		}

		// finally, set the prefsLocal.version to the script's version
		prefsLocal.version = scriptVersion;
		saveSetting(prefsLocal, "prefsLocal", false);
	});
}

function getVersionNumber() {
	if (typeof prefsLocal == "undefined" || typeof prefsLocal.version == "undefined") {
		return "0.0.0";
	} else {
		return prefsLocal.version;
	}
}