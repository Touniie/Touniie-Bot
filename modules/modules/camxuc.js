const fs = require('fs');
module.exports.config = {
	name: "camxuc",
	version: "1.0.0",
	hasPermssion: 1,
	credits: "TruongMini fix by Niiozic",
	description: "gỡ tin nhắn bằng cách thả like",
	commandCategory: "Nhóm",
	usages: "camxuc on/off",
	cooldowns: 5,
};

module.exports.run = async({ api, event, args }) => {
    const { threadID, messageID } = event;
    let path = __dirname + "/data/unsendReaction.json";
    if(!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
    let data = JSON.parse(fs.readFileSync(path));
    if(!data[threadID]) data[threadID] = { data: false };
   if (args.join() == "") { 
	  return api.sendMessage(`Vui lòng chọn on/off`, event.threadID, event.messageID)} 
    if(args[0] == "on") { 
        data[threadID].data = true; 
        api.sendMessage("✅ Đã bật chế độ thả cảm xúc vào tin nhắn bot để gỡ", threadID); 
    } else if(args[0] == "off") { 
        data[threadID].data = false; 
        api.sendMessage("✅ Đã tắt chế độ thả cảm xúc vào tin nhắn bot để gỡ", threadID);
    }
    fs.writeFileSync(path, JSON.stringify(data, null, 4));
}