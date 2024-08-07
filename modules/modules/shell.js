module.exports.config = {
	name: "shell",
	version: "7.3.1",
	hasPermssion: 2,
	credits: "Nguyen",
	description: "running shell",
	commandCategory: "Admin",
	usages: "[shell]",
	cooldowns: 0,
	dependencies: {
		"child_process": ""
	}
};
module.exports.run = async function({ api, event, args, Threads, Users, Currencies, models }) {    
const { exec } = require("child_process");
/*const permission = [`${global.config.ADMINBOT[0]}`];
	if (!permission.includes(event.senderID))  api.sendMessage("⚠️ Bạn không được phép sử dụng lệnh này", event.threadID, event.messageID);*/
let text = args.join(" ")
exec(`${text}`, (error, stdout, stderr) => {
    if (error) {
        api.sendMessage(`Lỗi: \n${error.message}`, event.threadID, event.messageID);
        return;
    }
    if (stderr) {
        api.sendMessage(`stderr:\n ${stderr}`, event.threadID, event.messageID);
        return;
    }
    api.sendMessage(`stdout:\n ${stdout}`, event.threadID, event.messageID);
});
}