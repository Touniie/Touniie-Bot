module.exports.config = {
    name: "chongcuopbox",
    eventType: ["log:thread-admins"],
    version: "1.0.0",
    credits: "D-Jukie rmk Niio-team (Vtuan)",
    description: "Ngăn chặn việc thay đổi admin",
};
const fs = require('fs-extra');

module.exports.run = async function ({ event, api, Threads, Users }) {
        let read = await fs.readFile(Qtv, 'utf-8');
        let antiData = read ? JSON.parse(read) : [];
        let threadEntry = antiData.find(entry => entry.threadID === threadID);

        if (threadEntry){
        switch (logMessageType) {
          case "log:thread-admins": {
            const { ADMINBOT } = global.config;
            if (logMessageData.ADMIN_EVENT == "add_admin") {
              if(event.author == api.getCurrentUserID()) return
              if(logMessageData.TARGET_ID == api.getCurrentUserID()) return
              if (ADMINBOT.includes(event.author) || ADMINBOT.includes(logMessageData.TARGET_ID)) return;
              else {
                api.changeAdminStatus(event.threadID, event.author, false, editAdminsCallback)
                api.changeAdminStatus(event.threadID, logMessageData.TARGET_ID, false)
                function editAdminsCallback(err) {
                  if (err) return api.sendMessage("»", event.threadID, event.messageID);
                    return api.sendMessage(`⚠️ Thực thi chống cuớp box`, event.threadID, event.messageID);
                }
              }
            }
            else if (logMessageData.ADMIN_EVENT == "remove_admin") {
              if(event.author == api.getCurrentUserID()) return
              if(logMessageData.TARGET_ID == api.getCurrentUserID()) return
              if (ADMINBOT.includes(event.author) || ADMINBOT.includes(logMessageData.TARGET_ID)) return;
              else {
                api.changeAdminStatus(event.threadID, event.author, false, editAdminsCallback)
                api.changeAdminStatus(event.threadID, logMessageData.TARGET_ID, true)
                function editAdminsCallback(err) {
                if (err) return api.sendMessage("»", event.threadID, event.messageID);
                return api.sendMessage(`⚠️ Thực thi chống cuớp box`, event.threadID, event.messageID);
              }
            }
          }
        }
      }
    }
}