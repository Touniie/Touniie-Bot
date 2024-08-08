module.exports.config = {
    "name": "sendnoti",
    "version": "1.1.1",
    "hasPermssion": 2,
    "credits": "Niiozic",
    "description": "Gửi tin nhắn đến tất cả nhóm và reply để phản hồi",
    "commandCategory": "Admin",
    "usages": "[ Nội dung ]",
    "cooldowns": 0
};
request = require("request");
fse = require("fs-extra");
imageDownload = require("image-downloader");
moment = require("moment-timezone");
fullTime = () => moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || DD/MM/YYYY");
module.exports.run = async({ api,
    event, Users }) => {
    const { threadID: tid, messageID: mid, senderID: sid, attachments: atms, messageReply: mR, type, body, args } = event; 
    const allTid = global.data.allThreadID || [];
    const atm = await type == "message_reply" ? mR.attachments : atms.length != 0 ? atms : "nofile";
    const content = !args[1] ? "chỉ có tệp" : body.slice(body.indexOf(args[1]));
    if (!args[1] && atm == "nofile") return api.sendMessage(`⚠️ Vui lòng sử dụng như sau:\n${global.config.PREFIX}sendnoti + ND cần gửi\nVí Dụ: ${global.config.PREFIX}sendnoti Alo`, tid, mid);
    var msg = `[ Thông Báo Admin ]\n\n👤 Từ Admin: ${(await Users.getData(sid)).name}\n🔗 Link: https://www.facebook.com/profile.php?id=${event.senderID}\n🏘️ Nơi gửi: ${event.isGroup == true ? 'Nhóm ' + global.data.threadInfo.get(event.threadID).threadName: 'từ cuộc trò chuyện riêng với bot '}\n⏰ Time: ${fullTime()}\n📝 Nội dung: ${content}\n\n📌 Reply tin nhắn này để phản hồi`
    const uwu = atm == "nofile" ? msg : {
        body: msg,
        attachment: await DownLoad(atm)
    };
var c1 = 0, c2 = 0;
    for (var idT of allTid) {
      var promise = new Promise (async(r1, r2) => {
 await api.sendMessage(uwu, idT, async(e, i) => {
   if (e) r2(++c2); else r1(++c1)
      return global.client.handleReply.push({
            name: this.config.name,
            messageID: i.messageID,
            author: sid,
            type: "userReply"
        })
      });
    })
  }
promise.then(async(r) => api.sendMessage(`✅ Gửi thông báo thành công đến tất cả nhóm`, tid, mid)).catch(async(err) => api.sendMessage(`⚠️ Không thể gửi thông báo đến ${err} nhóm`, tid, mid))
};
module.exports.handleReply = async({ api, event, handleReply: h, Users, Threads }) => {
    const { threadID: tid, messageID: mid, senderID: sid, attachments: atms, body, type } = event;
    const { ADMINBOT } = global.config; 
    switch (h.type) {
        case "userReply": {
            const atm = atms.length != 0 ? atms : "nofile";
            var msg = `📩 Phản hồi từ user: ${(await Users.getData(sid)).name}\n🏘️ Nhóm: ${(await Threads.getData(tid)).threadInfo.threadName}\n⏰ Time: ${fullTime()}\n\n📝 Nội dung: ${atm == "nofile" ? body : "Chỉ có tệp được gửi cho bạn"}\n\n📌 Reply tin nhắn này để phản hồi lại user`
            const uwu = atm == "nofile" ? msg : {
                body: msg,
                attachment: await DownLoad(atm)
            };
          var c1 = 0, c2 = 0;
            for (var idA of ADMINBOT) {
              var promise = new Promise (async(r1, r2) => {
                await api.sendMessage(uwu, idA, async(e, i) => {
     if (e) r2(++c2); else r1(++c1)
                    return global.client.handleReply.push({
                        name: this.config.name,
                        messageID: i.messageID,
                        author: h.author, idThread: tid, idMessage: mid, idUser: sid,
                        type: "adminReply"
                    })
                });
            });
       }; 
          promise.then(async(r1) => api.sendMessage(`✅ Phản hồi thành công đến ${(await Users.getData(h.author)).name} và ${+r1-1} Admin khác`, tid, mid)).catch(async(err) => api.sendMessage(`⚠️ Không thể phản hồi đến ${err} Admin khác`, tid, mid))
            break;
        };
    case "adminReply": {
        const atm = atms.length != 0 ? atms : "nofile";
        var msg = `📩 Phản hồi từ Admin ${(await Users.getData(sid)).name}\n⏰ Time: ${fullTime()}\n\n📝 Nội dung: ${atm == "nofile" ? body : "Chỉ có tệp được gửi cho bạn"}\n\n📌 reply tin nhắn này để phản hồi lại Admin`
        const uwu = atm == "nofile" ? msg : {
            body: msg,
            attachment: await DownLoad(atm)
        };
        await api.sendMessage(uwu, h.idThread, async(e, i) => {
            if (e) return api.sendMessage(`Error`, tid, mid);
            else api.sendMessage(`✅ Phản hồi thành công đến user ${(await Users.getData(h.idUser)).name} tại nhóm ${(await Threads.getData(h.idThread)).threadInfo.threadName}`, tid, mid)
            return global.client.handleReply.push({
                name: this.config.name,
                messageID: i.messageID,
                author: sid,
                type: "userReply"
            })
        }, h.idMessage);
        break;
    };
  }
};

const DownLoad = async(atm) => {
    var arr = [];
    for (var i = 0; i < atm.length; i++) {
        const nameUrl = request.get(atm[i].url).uri.pathname
        const namefile = atm[i].type != "audio" ? nameUrl : nameUrl.replace(/\.mp4/g, ".m4a");
        const path = __dirname + "/cache/" + namefile.slice(namefile.lastIndexOf("/") + 1);
        await imageDownload.image({
            url: atm[i].url,
            dest: path
        });
        arr.push(fse.createReadStream(path));
        fse.unlinkSync(path);
    }
    return arr;
};