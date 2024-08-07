module.exports.config = {
	name: "echo",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "",
	description: "Trả lời tin nhắn theo yc",
	commandCategory: "Admin",
	usages: "",
	cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
		return api.sendMessage(args.join(" "), event.threadID);
}