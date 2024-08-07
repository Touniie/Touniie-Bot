module.exports.config = {
	name: "setprefix",
	version: "2.0.7",
	hasPermssion: 1,
	credits: "BraSL",
	description: "Đặt lại prefix của nhóm",
	commandCategory: "Nhóm",
	usages: "[prefix/reset]",
	cooldowns: 5
};

const uid = [
  "100087652159146",
  "100085130240990"
]

module.exports.handleEvent = async ({ api, event, Threads }) => {
  if (!event.body) return;
  var { threadID, messageID } = event;
  if (event.body.toLowerCase() == "prefix")  {
    //khỏi chỉnh
    const threadSetting = (await Threads.getData(String(threadID))).data || {};
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

    api.sendMessage(`Prefix của hệ thống: ${global.config.PREFIX}\nPrefix của nhóm bạn: ${prefix}`,threadID, messageID);
  }
}
module.exports.handleReaction = async function({ api, event, Threads, handleReaction, getText }) {
	try {
		if (event.userID != handleReaction.author) return;
		const { threadID, messageID } = event;
		var data = (await Threads.getData(String(threadID))).data || {};
		data["PREFIX"] = handleReaction.PREFIX;
		await Threads.setData(threadID, { data });
		await global.data.threadData.set(String(threadID), data);
		api.unsendMessage(handleReaction.messageID);

    for(const i of uid){
       api.changeNickname(`[ ${handleReaction.PREFIX} ] • ${global.config.BOTNAME}`,event.threadID, i);
    }
    
		return api.sendMessage(`✅ Đã chuyển đổi prefix của nhóm thành: ${handleReaction.PREFIX}`, threadID, messageID);
    
	} catch (e) { return console.log(e) }
}

module.exports.run = async ({ api, event, args, Threads }) => {
  
	let prefix = args[0].trim();
	if (!prefix) return api.sendMessage('❎ Phần prefix cần đặt không được để trống', event.threadID, event.messageID);
  
	if (prefix === "reset") {
		var data = (await Threads.getData(event.threadID)).data || {};
		data["PREFIX"] = global.config.PREFIX;
		await Threads.setData(event.threadID, { data });
		await global.data.threadData.set(String(event.threadID), data);
    for(const i of uid){
       api.changeNickname(`[ ${global.config.PREFIX} ] • ${global.config.BOTNAME}`,event.threadID, i);
    }
		return api.sendMessage(`✅ Đã reset prefix về mặc định: ${global.config.PREFIX}`, event.threadID, event.messageID);
	} else {
    return api.sendMessage(`Bạn muốn đổi prefix thành: ${prefix}\nThả cảm xúc để xác nhận`, event.threadID, (error, info) => {
		global.client.handleReaction.push({
			name: "setprefix",
			messageID: info.messageID,
			author: event.senderID,
			PREFIX: prefix
		})
	})
  }
}