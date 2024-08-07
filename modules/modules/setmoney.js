module.exports.config = {
  name: "setmoney",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "CatalizCS",
  description: "Điều chỉnh thông tin của người dùng",
  commandCategory: "Admin",
  usages: "[add/set/clean/reset] [Số tiền] [Tag người dùng]",
  cooldowns: 5
};

module.exports.run = async function({ event, api, Currencies, args }) {
  const { threadID, messageID, senderID } = event;
  const { throwError } = global.utils;
  const mentionID = Object.keys(event.mentions);
  const money = String(args[1])

  var message = [];
  var error = [];
  try {
    switch (args[0]) {
      case "add": {
        if (mentionID.length != 0) {
          for (singleID of mentionID) {
            if (!money || isNaN(money)) return api.sendMessage('❎ Money phải là một số', threadID, messageID);
            try {
              await Currencies.increaseMoney(singleID, money);
              message.push(singleID);
            } catch (e) { error.push(e);
              console.log(e) };
          }
          return api.sendMessage(`✅ Đã cộng thêm ${formatNumber(money)}$ cho ${message.length} người`, threadID, function() { if (error.length != 0) return api.sendMessage(`❎ Không thể thể cộng thêm tiền cho ${error.length} người`, threadID) }, messageID);
        } else {
          if (!money || isNaN(money)) return api.sendMessage('Money phải là một số', threadID, messageID);
          try {
            var uid = event.senderID;
            if (event.type == "message_reply") {
              uid = event.messageReply.senderID
            } else if (args.length === 3) {
              uid = args[2]
            }
            console.log(args)
            await Currencies.increaseMoney(uid, String(money));
            message.push(uid);
          } catch (e) { error.push(e) };
          return api.sendMessage(`✅ Đã cộng thêm ${formatNumber(money)}$ cho ${uid !== senderID ? '1 người' : 'bản thân'}`, threadID, function() { if (error.length != 0) return api.sendMessage(`❎ Không thể thể cộng thêm tiền cho ${uid !== senderID ? '1 người' : 'bản thân'}`, threadID) }, messageID);
        }
      }
      case 'all':
      {
        const allUserID = event.participantIDs;
        const mon = money
        console.log(allUserID)
        for (const singleUser of allUserID) {
          await Currencies.increaseMoney(singleUser, String(mon));
        }
        api.sendMessage(`✅ Đã set thành công ${args[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} cho toàn bộ thành viên`, event.threadID)
      }
      break;
      case "set": {
        if (mentionID.length != 0) {
          for (singleID of mentionID) {
            if (!money || isNaN(money)) return throwError(this.config.name, threadID, messageID);
            try {
              await Currencies.setData(singleID, { money });
              message.push(singleID);
            } catch (e) { error.push(e) };
          }
          return api.sendMessage(`✅ Đã set thành công ${formatNumber(money)}$ cho ${message.length} người`, threadID, function() { if (error.length != 0) return api.sendMessage(`❎ Không thể set tiền cho ${error.length} người`, threadID) }, messageID);
        } else {
          if (!money || isNaN(money)) return throwError(this.config.name, threadID, messageID);
          try {
            var uid = event.senderID;
            if (event.type == "message_reply") {
              uid = event.messageReply.senderID
            }
            await Currencies.setData(uid, { money });
            message.push(uid);
          } catch (e) { error.push(e) };
          return api.sendMessage(`✅ Đã set thành công ${formatNumber(money)}$ cho ${uid !== senderID ? '1 người' : 'bản thân'}`, threadID, function() { if (error.length != 0) return api.sendMessage(`❎ Không thể set tiền cho ${uid !== senderID ? '1 người' : 'bản thân'}`, threadID) }, messageID);
        }
      }

      case "clean": {
        if (args[1] === 'all') {
          const data = event.participantIDs;
          for (const userID of data) {
            const datas = (await Currencies.getData(userID)).data
            if (datas !== undefined) {
              datas.money = '0'
              await Currencies.setData(userID, datas);
            }
          }
          return api.sendMessage("✅ Đã xóa thành công toàn bộ tiền của nhóm", event.threadID);
        }
        if (mentionID.length != 0) {
          for (singleID of mentionID) {
            try {
              await Currencies.setData(singleID, { money: 0 });
              message.push(singleID);
            } catch (e) { error.push(e) };
          }
          return api.sendMessage(`✅ Đã xóa thành công toàn bộ tiền của ${message.length} người`, threadID, function() { if (error.length != 0) return api.sendMessage(`❎ Không thể xóa toàn bộ tiền của ${error.length} người`, threadID) }, messageID);
        } else {
          try {
            var uid = event.senderID;
            if (event.type == "message_reply") {
              uid = event.messageReply.senderID
            }
            await Currencies.setData(uid, { money: 0 });
            message.push(uid);
          } catch (e) { error.push(e) };
          return api.sendMessage(`✅ Đã xóa thành công tiền của ${uid !== senderID ? '1 người' : 'bản thân'}`, threadID, function() { if (error.length != 0) return api.sendMessage(`❎ Không thể xóa toàn bộ tiền của ${uid !== senderID ? '1 người' : 'bản thân'}`, threadID) }, messageID);
        }
      }

      case "reset": {
        const allUserData = await Currencies.getAll(['userID']);
        for (const userData of allUserData) {
            const userID = userData.userID;
            try {
                await Currencies.setData(userID, { money: 0 });
                message.push(userID);
            } catch (e) { error.push(e) };
        }
        return api.sendMessage(`✅ Đã xóa toàn bộ dữ liệu tiền của ${message.length} người`, threadID, function () { if (error.length != 0) return api.sendMessage(`❎ Không thể xóa dữ liệu tiền của ${error.length} người`, threadID) }, messageID);
        for (singleID of mentionID) {
            try {
                await Currencies.setData(singleID, { money: 0 });
                message.push(singleID);
            } catch (e) { error.push(e) };
        }
        return api.sendMessage(`✅ Đã xóa dữ liệu tiền của ${message.length} người`, threadID, function () { if (error.length != 0) return api.sendMessage(`❎ Không thể xóa dữ liệu tiền của ${error.length} người`, threadID) }, messageID);
}

      default: {
        return global.utils.throwError(this.config.name, threadID, messageID);
      }
    }
  } catch (e) {
    console.log(e)
  }
}
function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}