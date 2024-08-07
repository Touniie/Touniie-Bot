module.exports.config = {
    name: "jball",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Niio-team (Vtuan)",
    description: "thêm người nào đó vào tất cả box",
    commandCategory: "Admin",
    usages: "[]",
    cooldowns: 1,
};

module.exports.run = async function ({ api, event,args }) {
    const { threadID, messageID, mentions, type, messageReply } = event;
    let uid;
    if (type === "message_reply" && messageReply) {
        uid = messageReply.senderID;
    } else if (mentions && Object.keys(mentions).length > 0) {
        uid = Object.keys(mentions)[0];
    } else if (args.length > 0) {
        uid = args[0];
    } else {
        api.sendMessage("❎Bạn cần tag, reply hoặc nhập ID người dùng.", threadID, messageID);
        return;
    }
    try {
        const inbox = await api.getThreadList(100, null, ['INBOX']);
        const checkgr = inbox
            .filter(group => group.isSubscribed && group.isGroup)
            .map(group => ({ id: group.threadID, name: group.name || 'Không tên' }));
        let msg = '';
        let count = 0;
        let skip = false;

        for (const groupID of checkgr) {
            if (skip) continue;

            await new Promise(resolve => {
                api.addUserToGroup(uid, groupID.id, (err) => {
                    if (err) {
                        msg += `Don't join: ${groupID.name}\n`;
                        skip = true;
                    } else {
                        count++;
                    }
                    setTimeout(resolve, 2000);
                });
            });
        }

        api.sendMessage(`✅Đã thêm vào ${count} nhóm`, threadID);
        if (msg) api.sendMessage(msg, threadID);
    } catch (error) {
        console.error(error);
    }
}
