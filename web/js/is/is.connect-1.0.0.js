var IS = IS || {};

/*
 * ! \class IS::Connection \brief Creates a new IS connection with host
 */

IS.Connection = function() {
	this.bConnected = false

	this.onConnectHooks = [];
	this.onDisconnectHooks = [];
	this.onMessageHooks = [];
	this.onStartHooks = [];
	this.onStopHooks = [];
	this.onFileHooks = [];
};

/*
 * ! \fn ISjs::Connection::connect \brief Setup IS connection \memberof
 * ISjs::Connection \param host (optional) The host of the ecsc that this
 * application should connect to. Defaults to 127.0.0.1. You must specify a host
 * if you are connecting to a remote IS server. \param port (optional) The port
 * on the host of the ecsc that this application should connect to. Defaults to
 * 7847 (IS default). You must specify a port if you change the port your local
 * or remote IS server is running on. \param channel (optional) The websocket
 * channel that this application should use to connect to the host. Defalut to
 * "/" \param role (optional) The IS role that this application is fulfilling
 * 
 */

IS.Connection.prototype.connect = function(host, port, channel) {
	this.host = host || "127.0.0.1";
	this.port = port || 7847;
	this.channel = channel || "/";

	this.socket = new WebSocket("ws://" + this.host + ":" + this.port
			+ this.channel);
	this.socket._parent = this;
	this.socket.onmessage = this.onWSMessage.bind(this);
	this.socket.onopen = this.onConnectionOpened.bind(this);
	this.socket.onclose = this.onConnectionClosed.bind(this);
};

/*
 * ! \fn IS::Connection::sendMessage \brief Send an IS message \memberof
 * IS::Connection \param key The type of message being sent. \param value the
 * value you are sending
 */
IS.Connection.prototype.sendMessage = function(type, data) {
	if (!this.bConnected) {
		if (console)
			console.warn("Not connected!");
		return;
	}

	var message = {'type': type, 'data': data};
	this.socket.send(JSON.stringify(message));
};

/*
 * ! \fn IS::Connection::onMessage \brief Pass in a function to receive
 * messages from IS \memberof IS::Connection \param fun function you would
 * like to be called; must catch (key, value)
 */

IS.Connection.prototype.onMessage = function(fun) {
	if (typeof fun !== "function") {
		console
				.warn("method passed to IS.Connection.onMessage is not a function");
	} else {
		// DEV NOTE: SHOULD WE CHECK FOR DUPLICATES?
		this.onMessageHooks.push(fun);
	}
};

/*
 * ! \fn IS::Connection::onConnect \brief Pass in a function in your add a
 * listener to "connect" events from IS. \memberof IS::Connection \param fun
 * function you would like to be called
 */

IS.Connection.prototype.onConnect = function(fun) {
	if (typeof fun !== "function") {
		console
				.warn("method passed to IS.Connection.onConnect is not a function");
	} else {
		// DEV NOTE: SHOULD WE CHECK FOR DUPLICATES?
		this.onConnectHooks.push(fun);
	}
};

/*
 * ! \fn IS::Connection::onDisconnect \brief Pass in a function in your add a
 * listener to "disconnect" events \memberof IS::Connection \param fun
 * function you would like to be called
 */

IS.Connection.prototype.onDisconnect = function(fun) {
	if (typeof fun !== "function") {
		console
				.warn("method passed to IS.Connection.onDisconnect is not a function");
	} else {
		// DEV NOTE: SHOULD WE CHECK FOR DUPLICATES?
		this.onDisconnectHooks.push(fun);
	}
};

/*
 * ! \fn IS::Connection::onFile \brief Pass in a function to receive files
 * from IS \memberof IS::Connection \param fun function you would like to be
 * called; must catch (filepath)
 */

IS.Connection.prototype.onFile = function(fun) {
	if (typeof fun !== "function") {
		console
				.warn("method passed to IS.Connection.onFile is not a function");
	} else {
		// DEV NOTE: SHOULD WE CHECK FOR DUPLICATES?
		this.onFileHooks.push(fun);
	}
};

/*
 * ! \fn IS::Connection::onConnectionOpened \memberof IS::Connection
 * \private
 */
IS.Connection.prototype.onConnectionOpened = function() {
	this.bConnected = true;
	if (console)
		console.log("IS connected");

	this.callAllFuncInArray(this.onConnectHooks);
};

/*
 * ! \fn IS::Connection::onConnectionClosed \memberof IS::Connection
 * \private
 */
IS.Connection.prototype.onConnectionClosed = function() {
	this.bConnected = false;
	this.callAllFuncInArray(this.onDisconnectHooks);
};

/*
 * ! \fn IS::Connection::callAllFuncInArray \brief A utility function to call
 * every function in an array of functions without any arguments \memberof
 * IS::Connection \private
 */
IS.Connection.prototype.callAllFuncInArray = function(array) {
	for ( var i in array) {
		array[i]();
	}
};

/*
 * ! \fn IS::Connection::onWSMessage \memberof IS::Connection \private
 */
IS.Connection.prototype.onWSMessage = function(evt) {
	var dataObj = JSON.parse(evt.data);
	if (dataObj.type) {
		for ( var i = 0; i < this.onMessageHooks.length; i++) {
			this.onMessageHooks[i](dataObj.type, dataObj.data);
		}
	} else {
		for ( var i = 0; i < this.onMessageHooks.length; i++) {
			this.onMessageHooks[i]("type", dataObj);
		}
	}
};
