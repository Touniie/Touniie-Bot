module.exports.config = {
    name: "rep",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "",
    description: "",
    commandCategory: "Admin",
    usages: "đồ của tao dùng cc.",
    cooldowns: 0
};

module.exports.run = async function ({ event, api }) {
    await api.sendMessage("Test handleReply.", event.threadID, (error, info) => {
        global.client.handleReply.push({
            type: 'reply',
            name: this.config.name,
            name: "step0",
            data: ["case0"],
            messageID: info.messageID,
            author: event.senderID,
        });
    }, event.messageID);
}
module.exports.handleReply = async function ({ event, api, handleReply }) {
    console.log(event);
    if (handleReply.name == "step0") {
        await api.unsendMessage(handleReply.messageID);
        return api.sendMessage("Next step 1", event.threadID, (error, info) => {
            global.client.handleReply.push({
                type: 'reply',
                name: this.config.name,
                name: "step1",
                data: handleReply.data.push("case1"),
                messageID: info.messageID,
                author: event.senderID,
            });
        }, event.messageID);
    }
    if (handleReply.name == "step1") {
        await api.unsendMessage(handleReply.messageID);
        return api.sendMessage("Next last step", event.threadID, (error, info) => {
            global.client.handleReply.push({
                type: 'reply',
                name: this.config.name,
                name: "last step",
                data: handleReply.data.push("final"),
                messageID: info.messageID,
                author: event.senderID,
            });
        }, event.messageID);
    }
    if (handleReply.name == "last step") return api.sendMessage(handleReply.data.join(","), event.threadID, event.messageID);
}