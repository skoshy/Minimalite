"use strict";

/**
* Compares two software version numbers (e.g. "1.7.1" or "1.2b").
*
* This function was born in http://stackoverflow.com/a/6832721.
*
* @param {string} v1 The first version to be compared.
* @param {string} v2 The second version to be compared.
* @param {object} [options] Optional flags that affect comparison behavior:
* <ul>
*     <li>
*         <tt>lexicographical: true</tt> compares each part of the version strings lexicographically instead of
*         naturally; this allows suffixes such as "b" or "dev" but will cause "1.10" to be considered smaller than
*         "1.2".
*     </li>
*     <li>
*         <tt>zeroExtend: true</tt> changes the result if one version string has less parts than the other. In
*         this case the shorter string will be padded with "zero" parts instead of being considered smaller.
*     </li>
* </ul>
* @returns {number|NaN}
* <ul>
*    <li>0 if the versions are equal</li>
*    <li>a negative integer iff v1 < v2</li>
*    <li>a positive integer iff v1 > v2</li>
*    <li>NaN if either version string is in the wrong format</li>
* </ul>
*
* @copyright by Jon Papaioannou (["john", "papaioannou"].join(".") + "@gmail.com")
* @license This function is in the public domain. Do what you want with it, no strings attached.
*//**
* Compares two software version numbers (e.g. "1.7.1" or "1.2b").
*
* This function was born in http://stackoverflow.com/a/6832721.
*
* @param {string} v1 The first version to be compared.
* @param {string} v2 The second version to be compared.
* @param {object} [options] Optional flags that affect comparison behavior:
* <ul>
*     <li>
*         <tt>lexicographical: true</tt> compares each part of the version strings lexicographically instead of
*         naturally; this allows suffixes such as "b" or "dev" but will cause "1.10" to be considered smaller than
*         "1.2".
*     </li>
*     <li>
*         <tt>zeroExtend: true</tt> changes the result if one version string has less parts than the other. In
*         this case the shorter string will be padded with "zero" parts instead of being considered smaller.
*     </li>
* </ul>
* @returns {number|NaN}
* <ul>
*    <li>0 if the versions are equal</li>
*    <li>a negative integer iff v1 < v2</li>
*    <li>a positive integer iff v1 > v2</li>
*    <li>NaN if either version string is in the wrong format</li>
* </ul>
*
* @copyright by Jon Papaioannou (["john", "papaioannou"].join(".") + "@gmail.com")
* @license This function is in the public domain. Do what you want with it, no strings attached.
*/
function versionCompare(v1, v2, options) {
	var lexicographical = options && options.lexicographical,
	zeroExtend = options && options.zeroExtend,
	v1parts = v1.split('.'),
	v2parts = v2.split('.');

	function isValidPart(x) {
		return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
	}

	if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
		return NaN;
	}

	if (zeroExtend) {
		while (v1parts.length < v2parts.length) v1parts.push("0");
		while (v2parts.length < v1parts.length) v2parts.push("0");
	}

	if (!lexicographical) {
		v1parts = v1parts.map(Number);
		v2parts = v2parts.map(Number);
	}

	for (var i = 0; i < v1parts.length; ++i) {
		if (v2parts.length == i) {
			return 1;
		}

		if (v1parts[i] == v2parts[i]) {
			continue;
		}
		else if (v1parts[i] > v2parts[i]) {
			return 1;
		}
		else {
			return -1;
		}
	}

	if (v1parts.length != v2parts.length) {
		return -1;
	}

	return 0;
}

function getDomainFromUrl(url) {
	return url.split('/')[url.indexOf('//') < 0 ? 0 : 2].split(/[\/?:#&]/)[0]
};

function getFilenameFromUrl(url) {
	let myRegexp = /.*\/(.*)\./g;
	return myRegexp.exec(url)[1];
};

function getRandomRgb() {
	let toReturn = [];
	for (let i = 0; i < 3; i++) {
		toReturn.push(Math.floor(Math.random() * 256));
	}
	return toReturn;
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