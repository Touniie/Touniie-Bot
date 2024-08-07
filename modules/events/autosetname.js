module.exports.config = {
	name: "autosetname",
	eventType: ["log:subscribe"],
	version: "1.0.3",
	credits: "D-Jukie",
	description: "Tự động set biệt danh thành viên mới"
};

module.exports.run = async function({ api, event, Users }) {
const { threadID } = event;
var memJoin = event.logMessageData.addedParticipants//.map(info => info.userFbId)
	for (let {userFbId:idUser, fullName}of memJoin) {
		const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
		const { join } = global.nodemodule["path"]
	 const pathData = join("./modules/commands","data", "autosetname.json");
		var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
		var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, nameUser: [] };
		if (thisThread.nameUser.length == 0) return 
		if (thisThread.nameUser.length != 0) {  
		var setName = thisThread.nameUser[0] 
		await new Promise(resolve => setTimeout(resolve, 1000));
		//var namee1 = await api.getUserInfo(idUser)
        //var namee = namee1[idUser].name
		api.changeNickname(`${setName
                        .replace(/{name}/g, fullName)
                        .replace(/{time}/g, require('moment-timezone')().tz('Asia/Ho_Chi_Minh').format('HH:MM:ss | DD/MM/YYYY'))}`, threadID, idUser);
		} 
	}	
	return api.sendMessage(`✅ Thực thi auto setname cho thành viên mới`, threadID, event.messageID)
}