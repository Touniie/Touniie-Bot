"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
	return async function setMessage(text, messageID, callback) {
		var resolveFunc = function () { };
		var rejectFunc = function () { };
		var returnPromise = new Promise(function (resolve, reject) {
			resolveFunc = resolve;
			rejectFunc = reject;
		});
		if (!callback) {
			callback = function (err, data) {
				if (err) return rejectFunc(err);
				resolveFunc(data);
				data
			};
		}
		let count_req = 0
		var form = JSON.stringify({
			"app_id": "2220391788200892",
			"payload": JSON.stringify({
				tasks: [{
					label: '742',
					payload: JSON.stringify({
						message_id: messageID,
						text: text,
					}),
					queue_name: 'edit_message',
					task_id: Math.random() * 1001 << 0,
					failure_count: null,
				}],
				epoch_id: utils.generateOfflineThreadingID(),
				version_id: '6903494529735864',
			}),
			"request_id": ++count_req,
			"type": 3
		});
		mqttClient.publish('/ls_req', form)

		return returnPromise;
	};
};
