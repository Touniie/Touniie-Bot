class Neww {
    constructor(a) {
        this.config = a;
    }

    run({ api: { getCurrentUserID: idbot, sendMessage, createNewGroup, money: { parse, ify }, removeUserFromGroup }, args, event: { mentions, messageID, threadID, messageReply: reply } }) {
        let id, intervalID;
        try {
            let input = args.join(' ').split(' | ');
            let send = (a, b) => sendMessage(a, threadID, b, messageID);
            let dir = `${__dirname}/data/regbox.json`, data = parse(dir)
            if (input.length !== 3 && args[0] !== 'stop') return send('Vui lòng điền: tag hoặc uid hoặc reply ai đó | tên nhóm | nội dung');
            if (args[0] == 'stop') {
                data[0] = false;
                ify(dir, data)
                send('Dừng thành công');
                if (intervalID) clearInterval(intervalID);
            } else {
                data[0] = true;
                ify(dir, data)
                id = Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : reply ? reply.senderID : args[0];
                intervalID = setInterval(() => {
                    if (data[0]) {
                        createNewGroup([idbot(), id], input[1], (a, b) => {
                            sendMessage(input[2], b)
                            removeUserFromGroup(idbot(), b)
                        })
                    }
                }, 2000);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new Neww({
    name: "rb",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "BerVer",
    description: "Spam reg box",
    commandCategory: "Spam",
    usages: "",
    cooldowns: 0
});
