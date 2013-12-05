var IS = IS || {};

IS.getQueryArgs = function() {
	var args = document.location.search.substring(1).split('&');

	argsParsed = {};

	for (i = 0; i < args.length; i++) {
		arg = unescape(args[i]);

		if (arg.indexOf('=') == -1) {
			argsParsed[arg.trim()] = true;
		} else {
			kvp = arg.split('=');
			argsParsed[kvp[0].trim()] = kvp[1].trim();
		}
	}

	return argsParsed;
}
