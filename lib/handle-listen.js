
'use strict';

module.exports = handleListen;

var debug = require('debug')('firebase-server:listen');

function handleListen(message, connection) {
	var path = message.fullPath;
	var fbRef = message.fbRef(connection.server.baseRef);
	debug('Client listen ' + path);

	connection.auth.tryRead(message, connection)
		.then(function () {
			var sendOk = true;
			fbRef.on('value', function (snap) {
				if (snap.exportVal()) {
					connection.pushData(path, snap.exportVal());
				}
				if (sendOk) {
					sendOk = false;
					connection.send({d: {r: message.requestId, b: {s: 'ok', d: {}}}, t: 'd'});
				}
			});
		})
		.catch(debug);
}
