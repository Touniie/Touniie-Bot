const fs = require('fs');
const request = require('request');

module.exports.config = {
    name: "send",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "TruongMini",
    description: "",
    commandCategory: "Admin",
    usages: "[msg]",
    cooldowns: 5,
}

let atmDir = [];

const getAtm = (atm, body) => new Promise(async (resolve) => {
    let msg = {}, attachment = [];
    msg.body = body;
    for(let eachAtm of atm) {
        await new Promise(async (resolve) => {
            try {
                let response =  await request.get(eachAtm.url),
                    pathName = response.uri.pathname,
                    ext = pathName.substring(pathName.lastIndexOf(".") + 1),
                    path = __dirname + `/cache/${eachAtm.filename}.${ext}`
                response
                    .pipe(fs.createWriteStream(path))
                    .on("close", () => {
                        attachment.push(fs.createReadStream(path));
                        atmDir.push(path);
                        resolve();
                    })
            } catch(e) { console.log(e); }
        })
    }
    msg.attachment = attachment;
    resolve(msg);
})

module.exports.handleReply = async function ({ api, event, handleReply, Users, Threads }) {
    const { threadID, messageID, senderID, body } = event;
    let name = await Users.getNameUser(senderID);
    switch (handleReply.type) {
        case "sendnoti": {
//phản hồi từ người dùng chỉ có tin nhắn văn bản
            let text = `📝 Nội dung phản hồi:\n\n${body}\n\nTừ: ${name}\nNhóm: ${(await Threads.getInfo(threadID)).threadName || "Unknow"}`;
//phản hồi từ người dùng chỉ kèm tệp
if(event.attachments.length > 0) text = await getAtm(event.attachments, `📝 Nội dung phản hồi:\n\n${body}\n\nTừ: ${name}\nNhóm ${(await Threads.getInfo(threadID)).threadName || "Unknow"}`);
            api.sendMessage(text, handleReply.threadID, (err, info) => {
                atmDir.forEach(each => fs.unlinkSync(each))
                atmDir = [];

global.client.handleReply.push({
                    name: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    messID: messageID,
                    threadID
                })
            });
            break;
        }//phản hồi user = văn bản
        case "reply": {
            let text = `📝 Nội dung:\n\n${body}\n\nTừ: ${await Users.getNameUser(senderID)}\nReply (phản hồi) để trả lời`;
            //phản hồi user = tệp
            if(event.attachments.length > 0) text = await getAtm(event.attachments, `📝 Nội dung:\n\n${body}\n\nTừ: ${await Users.getNameUser(senderID)}\nReply (phản hồi) để trả lời`);
            api.sendMessage(text, handleReply.threadID, (err, info) => {
                atmDir.forEach(each => fs.unlinkSync(each))
                atmDir = [];
                global.client.handleReply.push({
                    name: this.config.name,
                    type: "sendnoti",
                    messageID: info.messageID,
                    threadID
                })
            }, handleReply.messID);
            break;
        }
    }
}
//gửi tin nhắn
module.exports.run = async function ({ api, event, args, Users, permssion }) {
    if(permssion < 2) return
    const { threadID, messageID, senderID, messageReply } = event;
    if (!args[0]) return api.sendMessage("Please input message", threadID);
    let allThread = global.data.allThreadID || [];
    let can = 0, canNot = 0;
    let text = `📝 Nội dung:\n\n${args.join(" ")}\n\nTừ: ${await Users.getNameUser(senderID)}\nReply (phản hồi) để trả lời`;
    if(event.type == "message_reply") text = await getAtm(messageReply.attachments, `📝 Nội dung:\n\n${args.join(" ")}\n\nTừ: ${await Users.getNameUser(senderID)}\nReply (phản hồi) để trả lời`);
    await new Promise(resolve => {
        allThread.forEach((each) => {
            try {
                api.sendMessage(text, each, (err, info) => {
                    if(err) { canNot++; }
                    else {
                        can++;
                        atmDir.forEach(each => fs.unlinkSync(each))
                        atmDir = [];
                        global.client.handleReply.push({
                            name: this.config.name,
                            type: "sendnoti",
                            messageID: info.messageID,
                            messID: messageID,
                            threadID
                        })
                        resolve();
                    }
                })
            } catch(e) { console.log(e) }
        })
    })
    api.sendMessage(`✅ Send to ${can} thread, not send to ${canNot} thread`, threadID);
                      }