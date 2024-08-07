/*
* Author: DC-Nam
* WARNING: Do not change the author's name
*/


class Command {
	constructor(config) {
			this.config = config;
			this.count_req = 0;
	}

	run({
			event: {
					messageReply,
					senderID,
				threadID, mentions//dijt me may truonggg
			},
			args,
			api,
	}) {
			if (senderID == api.getCurrentUserID())return;
			var userID = Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : args.length > 0 ? args[0] : messageReply ? messageReply.senderID : senderID
			mqttClient.publish('/ls_req', JSON.stringify({
				"app_id": "2220391788200892",
				"payload": JSON.stringify({
				  "tasks": [
					{
					  "label": "359",
					  "payload": JSON.stringify({
						"contact_id": userID,
						"sync_group": 1,
						"text": "",
                        "thread_id": threadID
					  }),
					  "queue_name": "messenger_contact_sharing",
					  "task_id": 216,
					  "failure_count": null
					}
				  ],
				  "epoch_id": this.generateOfflineThreadingID(),
				  "version_id": "7214102258676893"
				}),
				"request_id": ++this.count_req,
				"type": 3
			  }))
			
	}

	getGUID() {
		var sectionLength = Date.now();
		var id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
			/[xy]/g,
			function(c) {
				var r = Math.floor((sectionLength + Math.random() * 16) % 16);
				sectionLength = Math.floor(sectionLength / 16);
				var _guid = (c == "x" ? r : (r & 7) | 8).toString(16);
				return _guid;
			}
		);
		return id;
	}

	generateOfflineThreadingID() {
			var ret = Date.now();
			var value = Math.floor(Math.random() * 4294967295);
			var str = ("0000000000000000000000" + value.toString(2)).slice(-22);
			var msgs = ret.toString(2) + str;
			return this.binaryToDecimal(msgs);
	}

	binaryToDecimal(data) {
			var ret = "";
			while (data !== "0") {
					var end = 0;
					var fullName = "";
					var i = 0;
					for (; i < data.length; i++) {
							end = 2 * end + parseInt(data[i], 10);
							if (end >= 10) {
									fullName += "1";
									end -= 10;
							} else {
									fullName += "0";
							}
					}
					ret = end.toString() + ret;
					data = fullName.slice(fullName.indexOf("1"));
			}
			return ret;
	}

}


module.exports = new Command({
	name: 'contact',
	version: '0.0.1',
	hasPermssion: 0,
	credits: 'Niio-team',//truong oc cawcj
	description: 'send contact message bot',
	commandCategory: 'Tiện ích',
	usages: '[]',
	cooldowns: 3,
})