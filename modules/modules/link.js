module.exports.config = {
    "name": "link",
    "version": "1.0.0",
    "hasPermssion": 0,
    "credits": "Niiozic",
    "description": "Lấy link fb người dùng.",
    "commandCategory": "Tiện ích",
    "cooldowns": 0
};

module.exports.run = async function({ api, event, args }) {
    const axios = global.nodemodule['axios']; 
    if(event.type == "message_reply") { 
	uid = event.messageReply.senderID
	return api.sendMessage(`https://www.facebook.com/profile.php?id=${uid}`, event.threadID, event.messageID) }
    if (!args[0]) {return api.sendMessage(`https://www.facebook.com/profile.php?id=${event.senderID}`, event.threadID, event.messageID);}
    else {
	if (args[0].indexOf(".com/")!==-1) {
    const res_ID = await api.getUID(args[0]);  
    return api.sendMessage(`https://www.facebook.com/profile.php?id=${res_ID}`, event.threadID, event.messageID) }
	else {
		for (var i = 0; i < Object.keys(event.mentions).length; i++) api.sendMessage(`https://www.facebook.com/profile.php?id=${Object.keys(event.mentions)[i]}`, event.threadID);
		return;
	}
}
}