const fs = require("fs-extra");
module.exports.config = {
    name: "canhbao",
    version: "1.0.0",
    hasPermssion: 1, 
    credits: "Niio-team (CThinh)",
    description: "Cảnh báo và kick người dùng ra khỏi nhóm",
    commandCategory: "Nhóm",
    usages: "[cách dùng]",
    cooldowns: 0
};

module.exports.run = async function({ api, event, args, Users, permssion }) {
    let path = __dirname + "/data/canhbao.json";
    if (!fs.existsSync(__dirname + "/data")) fs.mkdirSync(__dirname + "/data");
    var data = {};
    try {
        data = JSON.parse(fs.readFileSync(path));
    } catch (err) {
        fs.writeFileSync(path, JSON.stringify(data));
    }
    if (args[0] == "list") {
        let threadID = event.threadID;
        let list = [];
        for (let id in data) {
            if (data[id].threadID == threadID) {
                let name = (await Users.getData(id)).name;
                let warns = data[id].warns;
                let reason = data[id].reason.join(", "); 
                let time = data[id].time;
                let info = `👤 ${name} vi phạm ${warns} lần\n📝 Nội dung: ${reason}\n⏰ Thời gian: ${time}`;
                list.push(info);
            }
        }
        if (list.length == 0) return api.sendMessage("❎ Không có ai bị cảnh báo trong nhóm này!", event.threadID, event.messageID);
        else {
            let msg = "Danh sách cảnh báo trong nhóm:\n\n";
            for (let i = 0; i < list.length; i++) {
                msg += `${i + 1}. ${list[i]}\n\n`;
            }
            return api.sendMessage(msg, event.threadID, event.messageID);
        }
    }
    else if (args[0] == "reset") {
        if (permssion !== 2 && !global.config.ADMINBOT.includes(event.senderID)) return api.sendMessage("⚠️ Bạn không có quyền sử dụng lệnh này", event.threadID, event.messageID);
        let threadID = event.threadID;
        if (args[1] == "all") {
            for (let id in data) {
                if (data[id].threadID == threadID) {
                    data[id].warns = 0;
                    delete data[id];
                }
            }
            fs.writeFileSync(path, JSON.stringify(data));
            return api.sendMessage("✅ Đã đặt lại số lần cảnh báo của tất cả thành viên trong nhóm!", event.threadID, event.messageID);
        }
        else {
            let mention = Object.keys(event.mentions)[0];
            if (!mention) {
                if (event.type != "message_reply") return api.sendMessage("❎ Vui lòng tag hoặc trả lời tin nhắn của người dùng cần đặt lại số lần cảnh báo", event.threadID, event.messageID);
                else {
                    mention = event.messageReply.senderID;
                }
            }
            let name = (await Users.getData(mention)).name;
            if (data[mention]) {
                data[mention].warns = 0;
                delete data[mention];
                fs.writeFileSync(path, JSON.stringify(data));
                return api.sendMessage(`✅ Đã đặt lại số lần cảnh báo của ${name}`, event.threadID, event.messageID);
            }
            else {
                return api.sendMessage(`❎ ${name} chưa bị cảnh báo lần nào!`, event.threadID, event.messageID);
            }
        }
    }
    else {
        let mention = Object.keys(event.mentions)[0];
        let reason = args.slice(1).join(" ");
        if (!mention) {
            if (event.type != "message_reply") return api.sendMessage("❎ Vui lòng tag hoặc trả lời tin nhắn của người dùng cần cảnh báo", event.threadID, event.messageID);
            else {
                mention = event.messageReply.senderID;
                reason = args.join(" ");
            }
        }
        let name = (await Users.getData(mention)).name;
        if (!data[mention]) data[mention] = { "warns": 0, "reason": [] };
        data[mention].warns++;
        data[mention].threadID = event.threadID;
        data[mention].reason.push(reason || "Không có");
        data[mention].time = `${new Date().toLocaleTimeString()} - ${new Date().toLocaleDateString()}`;
        fs.writeFileSync(path, JSON.stringify(data));
        let maxWarn = 3;
        if (data[mention].warns >= maxWarn) {
            api.removeUserFromGroup(mention, event.threadID);
            api.sendMessage(`✅ Đã kick ${name} ra khỏi nhóm vì đã bị cảnh báo ${maxWarn} lần`, event.threadID, event.messageID);
            delete data[mention];
            fs.writeFileSync(path, JSON.stringify(data));
        }
        else {
            api.sendMessage(`⛔ ${name} đã bị cảnh báo ${data[mention].warns} lần, còn ${maxWarn - data[mention].warns} lần nữa sẽ bị kick khỏi nhóm!${reason ? `\n📝 Lí do: ${reason}` : ""}`, event.threadID, event.messageID);
        }
    }
};