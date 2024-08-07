module.exports.config = {
		name: "kick",
		version: "1.0.0",
		hasPermssion: 1,
		credits: "Mirai",
		description: "Xoá người bạn cần xoá khỏi nhóm bằng cách tag hoặc reply",
		commandCategory: "Nhóm",
		usages: "[tag/reply/all]",
		cooldowns: 0
};

module.exports.run = async function ({
		args,
		api,
		event,
		Threads
}) {
		var {
				participantIDs
		} = (await Threads.getData(event.threadID)).threadInfo;
		const botID = api.getCurrentUserID();
		try {
				if (args.join().indexOf('@') !== -1) {
						var mention = Object.keys(event.mentions);
						for (let o in mention) {
								setTimeout(() => {
										return api.removeUserFromGroup(mention[o], event.threadID, async function(err) {
											if (err) return api.sendMessage("❎ Bot cần quyền quản trị viên để kick", event.threadID, event.messageID);
											return
										})
								}, 1000)
						}
				} else {
				if (event.type == "message_reply") {
								uid = event.messageReply.senderID
								return api.removeUserFromGroup(event.messageReply.senderID, event.threadID, async function(err) {
									if (err) return api.sendMessage("❎ Bot cần quyền quản trị viên để kick", event.threadID, event.messageID);
									return
								})
						} else {
								if (!args[0]) return api.sendMessage(`❎ Vui lòng tag hoặc reply người cần kick`, event.threadID, event.messageID)
								else {
										if (args[0] == "all") {
												const listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
												//let adminBot = global.config.ADMINBOT;
											 //let idAD = '100006622276498';
												//for (var id of mention) {
												//if (id == api.getCurrentUserID()) return api.sendMessage("Mày muốn sao? :/", threadID, messageID);
												//if (id == idAD) return api.sendMessage(``, threadID, messageID);
												//if (threadInfo.adminIDs.some(item => item.id == id)) return api.sendMessage("Không thể xóa Quản Trị Viên khỏi nhóm.", threadID, messageID);
												//if (adminBot.includes(id)) return api.sendMessage("Không thể xóa người quản lí Bot khỏi nhóm", threadID, messageID);
												for (let idUser in listUserID) {
														setTimeout(() => {
																return api.removeUserFromGroup(idUser, event.threadID)
														}, 1000)
												}
										}
								}
						}
				}
} catch {
				return api.sendMessage('ccc', event.threadID, event.messageID);
		}
}