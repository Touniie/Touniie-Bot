const fs = require("fs-extra");
const path = __dirname + "/data/autoseen.json";
if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify([]));

module.exports.config = {
  name: "autoseen",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "BraSL",
  description: "Bật/tắt tự động seen khi có tin nhắn mới",
  commandCategory: "Nhóm",
  usages: "on/off",
  cooldowns: 5,
};

module.exports.handleEvent = async ({ api, event, args }) => {
  const data = require("./data/autoseen.json");
  var findT = data.find((item) => item.id === event.threadID);
  if (findT) {
    api.markAsRead(findT.id);
  }
};

module.exports.run = async ({ api, event, args }) => {
  const data = require("./data/autoseen.json");
  try {
    var findT = data.find((item) => item.id === event.threadID);
    if (args[0] == "on") {
      if (findT)
        return api.sendMessage("❎ Box này đã bật autoseen", event.threadID);
      data.push({ id: event.threadID });
      fs.writeFileSync(path, JSON.stringify(data, null, 4));
      return api.sendMessage("✅ Đã bật chế độ tự động seen khi có tin nhắn mới", event.threadID);
    } else if (args[0] == "off") {
      if (!findT)
        return api.sendMessage("❎ Box này chưa được bật", event.threadID);
      data.splice(
        data.findIndex(($) => $.id == event.threadID),
        1
      );
      fs.writeFileSync(path, JSON.stringify(data, null, 4));
      api.sendMessage(
        "✅ Đã tắt chế độ tự động seen khi có tin nhắn mới",
        event.threadID,
        event.messageID
      );
    } else {
      api.sendMessage("❎ Vui lòng chọn on/off", event.threadID, event.messageID);
    }
  } catch (e) {
    console.log(e);
  }
};
