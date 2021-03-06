define(['../modules/util'], function(Util) {
	var YoutubePlugin = function(mod) {
		mod.on('shout', function(ctx, evt) {
			var message = evt.message;

			if (message.indexOf('youtube.com') == -1 && message.indexOf('youtu.be') == -1) {
				return;
			}

			var url = /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/.exec(message);

			if (!url || url.length < 1) {
				return;
			}

			url = url[0];

			var video = '';

			if (url.indexOf('v=') != -1) {
				// The best way to do it. Parse all query string variables, then get the "v" variable.
				var queryString = url.substring(url.indexOf('?') + 1);

				if (queryString.indexOf('#') != -1) {
					queryString = queryString.substirng(0, queryString.indexOf('#'));
				}

				var parts = Util.parseQueryString(queryString);

				video = parts['v'];
			} else if (url.indexOf('youtu.be') != -1) {
				// This is messy, but without a parse url function it'll have to do.
				video = url.substring(url.lastIndexOf('/') + 1);

				if (video.indexOf('?') != -1) {
					video = video.substring(0, video.indexOf('?'));
				}
				if (video.indexOf('#') != -1) {
					video = video.substring(0, video.indexOf('#'));
				}
			}

			if (video == '') {
				return;
			}

			$.ajax({
				url: '//gdata.youtube.com/feeds/api/videos',
				data: {
					q: video,
					alt: 'json'
				},
				dataType: 'jsonp',
				success: function(result) {
					if (result['feed'] && result['feed']['entry'] && result['feed']['entry'].length > 0) {
						var length = parseInt(result['feed']['entry'][0]['media$group']['media$content'][0]['duration']);
						var title = result['feed']['entry'][0]['title']['$t'];

						var minutes = Math.floor(length / 60);
						var seconds = length % 60;

						InfernoShoutbox.postShout(message + " - " + Util.filterTitle(title) + " - [" + minutes + ":" + (seconds < 10 ? ('0' + seconds) : seconds) + "]");
					} else {
						InfernoShoutbox.postShout(message);
					}
				}
			});

			// Clear the text field
			InfernoShoutbox.clear();

			// Break the chain and make sure we don't handle the original method.
			ctx.breakHandlerChain();
			evt.message = false;
		});
	};

	return {
		init: YoutubePlugin
	}
});