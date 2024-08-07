module.exports.config = {
    "name": "uid",
    "version": "1.0.0",
    "hasPermssion": 0,
    "credits": "Niiozic",
    "description": "Lấy ID người dùng.",
    "commandCategory": "Tiện ích",
    "cooldowns": 0
};

module.exports.run = async function({ api, event, args }) {
    const axios = global.nodemodule['axios']; 
    if(event.type == "message_reply") { 
	uid = event.messageReply.senderID
	return api.sendMessage(`${uid}`, event.threadID, event.messageID) }
    if (!args[0]) {return api.sendMessage(`${event.senderID}`, event.threadID, event.messageID);}
    else {
	if (args[0].indexOf(".com/")!==-1) {
    const res_ID = await global.utils.getUID(args[0]);  
    return api.sendMessage(`${res_ID}`, event.threadID, event.messageID) }
	else {
		for (var i = 0; i < Object.keys(event.mentions).length; i++) api.sendMessage(`${Object.keys(event.mentions)[i]}`, event.threadID);
		return;
	}
}
}