"use strict";

// constants
var domainMatchings = {
	"google.com": {"color": "rgba(66,133,244,0.7)", "icon": "/icons/sites/google.svg"},
	"youtube.com": {"color": "rgba(224,47,47,.7)", "icon": "/icons/sites/youtube.svg"},
	"facebook.com": {"color": "rgba(59,89,152,.7)", "icon": "/icons/sites/facebook.svg"},
	"twitter.com": {"color": "rgba(29,161,242,.7)", "icon": "/icons/sites/twitter.svg"},
	"reddit.com": {"color": "rgba(255,69,0,.7)", "icon": "/icons/sites/reddit.svg"},
	"imgur.com": {"color": "rgba(0,0,0,.7)", "icon": "/icons/sites/imgur.svg"},
	"amazon.com": {"color": "rgba(246,166,31,.7)", "icon": "/icons/sites/amazon.svg"},
	"ebay.com": {"color": "rgba(255,255,255,.7)", "icon": "/icons/sites/ebay.svg"},

	"github.com": {"color": "rgba(0,0,0,.7)", "icon": "/icons/sites/github.svg"},
	"stackoverflow.com": {"color": "rgba(244,128,36,.7)"},
	"yahoo.com": {"color": "rgba(64,0,144,.7)", "icon": "/icons/sites/yahoo.svg"},
	"en.wikipedia.org": {"color": "rgba(207,208,210,.7)"},
	"netflix.com": {"color": "rgba(229,9,20,.7)", "icon": "/icons/sites/netflix.svg"},
	"hulu.com": {"color": "rgba(102,170,51,.7)", "icon": "/icons/sites/hulu.svg"},
	"soundcloud.com": {"color": "rgba(255,85,0,.7)", "icon": "/icons/sites/soundcloud.svg"},
	"play.spotify.com": {"color": "rgba(0,217,95,.7)", "icon": "/icons/sites/spotify.svg"},
	"cnn.com": {"color": "rgba(204,0,0,.7)", "icon": "/icons/sites/cnn.svg"},
	"nytimes.com": {"color": "rgba(26,26,26,.7)"},
	"baidu.com": {"color": "rgba(33,41,214,.7)"},
	"qq.com": {"color": "rgba(59,148,214,.7)"},
	"duolingo.com": {"color": "rgba(126,181,48,.7)"},
	"vk.com": {"color": "rgba(80,114,153,.7)"},
	"linkedin.com": {"color": "rgba(0,119,181,.7)", "icon": "/icons/sites/linkedin.svg"},
	"tumblr.com": {"color": "rgba(54,70,93,.7)", "icon": "/icons/sites/tumblr.svg"},
	"pinterest.com": {"color": "rgba(181,0,18,.7)"},
	"espn.com": {"color": "rgba(221,0,0,.7)", "icon": "/icons/sites/espn.svg"},
	"okcupid.com": {"color": "rgba(255,89,126,.7)", "icon": "/icons/sites/okcupid.svg"},
	"craigslist.org": {"color": "rgba(85,26,139,.7)", "icon": "/icons/sites/craigslist.svg"},
	"messenger.com": {"color": "rgba(0,132,255,.7)", "icon": "/icons/sites/messenger.svg"},
	"web.whatsapp.com": {"color": "rgba(52,191,73,.7)", "icon": "/icons/sites/whatsapp.svg"},
	"papajohns.com": {"color": "rgba(223,30,57,.7)"},
	"play.hbogo.com": {"color": "rgba(46,176,229,.7)", "icon": "/icons/sites/hbo.svg"},
	"photos.google.com": {"color": "rgba(255,255,255,.7)", "icon": "/icons/sites/googlephotos.svg"},
	"drive.google.com": {"color": "rgba(0,0,0,.7)", "icon": "/icons/sites/googledrive.svg"},
	"docs.google.com": {"color": "rgba(0,0,0,.7)", "icon": "/icons/sites/googledrive.svg"},
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