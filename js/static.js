"use strict";

// constants
var domainMatchings = {
	"google.com": {"color": "rgba(66,133,244,0.7)", "icon": "/icons/sites/Google.svg"},
	"youtube.com": {"color": "rgba(224,47,47,.7)", "icon": "/icons/sites/YouTube.svg"},
	"facebook.com": {"color": "rgba(59,89,152,.7)", "icon": "/icons/sites/Facebook.svg"},
	"twitter.com": {"color": "rgba(29,161,242,.7)", "icon": "/icons/sites/Twitter.svg"},
	"reddit.com": {"color": "rgba(255,69,0,.7)", "icon": "/icons/sites/Reddit.svg"},
	"imgur.com": {"color": "rgba(0,0,0,.7)", "icon": "/icons/sites/Imgur.svg"},
	"amazon.com": {"color": "rgba(246,166,31,.7)", "icon": "/icons/sites/Amazon.svg"},
	"ebay.com": {"color": "rgba(255,255,255,.7)", "icon": "/icons/sites/eBay.svg"},

	"github.com": {"color": "rgba(0,0,0,.7)", "icon": "/icons/sites/Github.svg"},
	"stackoverflow.com": {"color": "rgba(244,128,36,.7)"},
	"yahoo.com": {"color": "rgba(64,0,144,.7)", "icon": "/icons/sites/Yahoo.svg"},
	"en.wikipedia.org": {"color": "rgba(207,208,210,.7)"},
	"netflix.com": {"color": "rgba(229,9,20,.7)", "icon": "/icons/sites/Netflix.svg"},
	"hulu.com": {"color": "rgba(102,170,51,.7)", "icon": "/icons/sites/Hulu.svg"},
	"soundcloud.com": {"color": "rgba(255,85,0,.7)", "icon": "/icons/sites/Soundcloud.svg"},
	"play.spotify.com": {"color": "rgba(0,217,95,.7)", "icon": "/icons/sites/Spotify.svg"},
	"cnn.com": {"color": "rgba(204,0,0,.7)", "icon": "/icons/sites/CNN.svg"},
	"nytimes.com": {"color": "rgba(26,26,26,.7)", "icon": "/icons/sites/NY Times.svg"},
	"baidu.com": {"color": "rgba(33,41,214,.7)", "icon": "/icons/sites/Baidu.svg"},
	"qq.com": {"color": "rgba(59,148,214,.7)"},
	"duolingo.com": {"color": "rgba(126,181,48,.7)", "icon": "/icons/sites/Duolingo.svg"},
	"vk.com": {"color": "rgba(80,114,153,.7)"},
	"linkedin.com": {"color": "rgba(0,119,181,.7)", "icon": "/icons/sites/LinkedIn.svg"},
	"tumblr.com": {"color": "rgba(54,70,93,.7)", "icon": "/icons/sites/Tumblr.svg"},
	"deviantart.com": {"color": "rgba(5,204,71,.7)", "icon": "/icons/sites/DeviantArt.svg"},
	"pinterest.com": {"color": "rgba(181,0,18,.7)", "icon": "/icons/sites/Pinterest.svg"},
	"espn.com": {"color": "rgba(221,0,0,.7)", "icon": "/icons/sites/ESPN.svg"},
	"okcupid.com": {"color": "rgba(255,89,126,.7)", "icon": "/icons/sites/OkCupid.svg"},
	"craigslist.org": {"color": "rgba(85,26,139,.7)", "icon": "/icons/sites/Craigslist.svg"},
	"messenger.com": {"color": "rgba(0,132,255,.7)", "icon": "/icons/sites/Messenger.svg"},
	"web.whatsapp.com": {"color": "rgba(52,191,73,.7)", "icon": "/icons/sites/WhatsApp.svg"},
	"papajohns.com": {"color": "rgba(0,151,115,.7)", "icon": "/icons/sites/Papa Johns.svg"},
	"play.hbogo.com": {"color": "rgba(46,176,229,.7)", "icon": "/icons/sites/HBO.svg"},
	"photos.google.com": {"color": "rgba(255,255,255,.7)", "icon": "/icons/sites/Google Photos.svg"},
	"drive.google.com": {"color": "rgba(0,0,0,.7)", "icon": "/icons/sites/Google Drive.svg"},
	"grubhub.com": {"color": "rgba(197,18,48,.7)", "icon": "/icons/sites/GrubHub.svg"},
	"yelp.com": {"color": "rgba(193,39,45,.7)", "icon": "/icons/sites/Yelp.svg"},
	"docs.google.com": {"color": "rgba(0,0,0,.7)", "icon": "/icons/sites/Google Drive.svg"},
	"slickdeals.net": {"color": "rgba(0,120,215,.7)", "icon": "/icons/sites/Slickdeals.svg"},
	"mail.google.com": {"color": "rgba(213,75,61,.7)", "icon": "/icons/sites/Gmail.svg"},
	"perksatwork.com": {"color": "rgba(241,95,34,.7)", "icon": "/icons/sites/PerksAtWork.svg"},
	"dawn.com": {"color": "rgba(255,255,255,.7)", "icon": "/icons/sites/Dawn.svg"},
	"trello.com": {"color": "rgba(0,145,228,.7)", "icon": "/icons/sites/Trello.svg"},
	"bbc.co.uk": {"color": "rgba(193,0,1,.7)", "icon": "/icons/sites/BBC.svg"},
	"bbc.com": {"color": "rgba(193,0,1,.7)", "icon": "/icons/sites/BBC.svg"},
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