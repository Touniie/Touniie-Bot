const { ImgurClient } = require('imgur');
const fs = require("fs");
const { downloadFile } = require("../../utils/index");
const axios = require("axios")

module.exports.config = {
	name: "imgur",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "Niio-team",
	description: "Up ảnh or video lên imgur",
	commandCategory: "Ảnh",
	usages: "[reply]",
	cooldowns: 0
};
var list = [], status = false;
module.exports.handleEvent = async function({ api, event, args, Users }) {
	//console.log(list)
	const { threadID, type, messageReply, messageID } = event;
	if(status) {
		if(event.body === "."){
			async function getAttachments(attachments) {
				let startFile = 0;
				for (const data of attachments) {
					list.push({
							 ext: data.type == "photo" ? "jpg" :
								 data.type == "video" ? "mp4" :
									 data.type == "audio" ? "m4a" :
										 data.type == "animated_image" ? "gif" : "txt",
						 url: data.url
					 });
				}
			}
			await getAttachments(messageReply.attachments);
		}
	}
}
this.run = async function({ api, event, args }) {
	const { threadID, type, messageReply, messageID } = event;
	var msg = "";
	async function getAttachments(attachments) {
		let startFile = 0;
		for (const data of attachments) {
			const ext = data.ext
			const url = (await axios.get('https://niiozic.site/imgur',{params:{url:data.url}})).data.url;
			msg += `\n${url}`
		}
	}
	if (messageReply?.attachments || messageReply?.attachments.length >= 0) {
		const attachmentSend = [];
		await getAttachments(messageReply.attachments);
		return api.sendMessage(`${msg}`, threadID);
	}
	if(args[0] === "done"){
		if(list.length <= 0 ) return api.sendMessage("Vui lòng chọn ảnh!",threadID)
		//const ClientID = "c76eb7edd1459f3";
		//const client = new ImgurClient({ clientId: ClientID });
		const attachmentSend = [];
		await getAttachments(list);
		status = false;
		list = [];
		return api.sendMessage(`${msg}`, threadID);
	}
	status = true;
	return api.sendMessage(`📌 Vui lòng reply ảnh video bạn muốn up lên imgur bằng dấu .\n✏️ Chọn xong thì dùng ${global.config.PREFIX}imgur done`,threadID)
}