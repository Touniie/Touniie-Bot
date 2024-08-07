module.exports.config = {
  name: "listban",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "ManhG",
  description: "Xem danh sách ban của nhóm hoặc của người dùng",
  commandCategory: "Admin",
  usages: "[thread/user]",
  cooldowns: 5
};
module.exports.handleReply = async function ({ api, args, Users, handleReply, event, Threads }) {
  const { threadID, messageID } = event;
  let name = await Users.getNameUser(event.senderID);
  if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;

  switch (handleReply.type) {
    case "unbanthread":
      {
        var arrnum = event.body.split(" ");
        var msg = "";
        var uidS = "";
        var strS = "";
        var modules = "------ UNBAN ------\n"
        var nums = arrnum.map(n => parseInt(n));
        for (let num of nums) {
          var myString = handleReply.listBanned[num - 1];
          var str = myString.slice(3);
          let uidK = myString.split(":");
          const uid = (uidK[uidK.length - 1]).trim();

          const data = (await Threads.getData(uid)).data || {};
          data.banned = 0;
          data.reason = null;
          data.dateAdded = null;
          await Threads.setData(uid, { data });
          var typef = global.data.threadBanned.delete(uid, 1);
          msg += typef + ' ' + myString + "\n\n";
          uidS += ' ' + uid + "\n";
          strS += ' ' + str + "\n";
        }
        //console.log(modules, msg);
        api.sendMessage(`✅ Nhóm của bạn đã được admin gỡ ban`, uidS, () =>
          api.sendMessage(`${global.data.botID}`, () =>
            api.sendMessage(`✅ Thực thi Unban(true/false)\n\n${msg}`, event.threadID, () =>
              api.unsendMessage(handleReply.messageID))));
      }
      break;

    case 'unbanuser':
      {
        var arrnum = event.body.split(" ");
        var msg = "";
        var uidS = "";
        var strS = "";
        var modules = "------ UNBAN ------\n"
        var nums = arrnum.map(n => parseInt(n));

        for (let num of nums) {
          var myString = handleReply.listBanned[num - 1];
          var str = myString.slice(3);
          let uidK = myString.split(":");
          const uid = (uidK[uidK.length - 1]).trim();

          const data = (await Users.getData(uid)).data || {};
          data.banned = 0;
          data.reason = null;
          data.dateAdded = null;
          await Users.setData(uid, { data });
          var typef = global.data.userBanned.delete(uid, 1);
          msg += typef + ' ' + myString + "\n";
          uidS += ' ' + uid + "\n";
          strS += ' ' + str + "\n";

        }
        //console.log(modules, msg);
        //api.sendMessage(`»Thông báo từ Admin ${name}«\n\n ${strS} \n\nBạn Đã Được Gỡ Ban để có thể tiếp tục sử dụng bot`, uidS, () =>
        // api.sendMessage(`${global.data.botID}`, () =>
        api.sendMessage(`Thực thi Unban (true/false)\n\n${msg}`, event.threadID, () =>
          api.unsendMessage(handleReply.messageID));
      }
      break;
  }
};

module.exports.run = async function ({ event, api, Users, args, Threads }) {
  const { threadID, messageID } = event;
  var listBanned = [], listbanViews = [];
  i = 1, j = 1;
  var dataThread = [];
  //var nameThread = [];
  switch (args[0]) {
    case "thread":
    case "t":
    case "-t":
      {
        const threadBanned = global.data.threadBanned.keys();
        //console.log(threadBanned)
        for (const singleThread of threadBanned) {
          const nameT = await global.data.threadInfo.get(singleThread).threadName || "Tên không tồn tại";
          const reason = await global.data.threadBanned.get(singleThread).reason;
          const date = await global.data.threadBanned.get(singleThread).dateAdded;
          //const data = (await api.getThreadInfo(singleThread));
          //const nameT = data.name;
          var modules = "ThreadBan: "
          //console.log(modules, nameT)
          listBanned.push(`${i++}. ${nameT}\n🔰TID: ${singleThread}`);
          
          listbanViews.push(`${j++}. ${nameT}\n🔰TID: ${singleThread}\n📋Lý do: ${reason}\n⏱Time: ${date}`);
          
        };

        return api.sendMessage(listbanViews.length != 0 ? api.sendMessage(`Hiện gồm có ${listbanViews.length} nhóm bị ban\n\n${listbanViews.join("\n\n")}` +
          "\n\nReply tin nhắn này + stt có thể rep nhiều số, cách nhau bằng dấu cách nếu muốn unban thread tương ứng.",
          threadID, (error, info) => {
            client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: 'unbanthread',
              listBanned
            });
          },
          messageID
        ) : "❎ Hiện tại không có nhóm nào bị ban.", threadID, messageID);
      }
    case "user":
    case "u":
    case "-u":
      {
        const userBanned = global.data.userBanned.keys();
        //console.log(userBanned)
        var modules = "UserBan: "
        for (const singleUser of userBanned) {
          const name = global.data.userName.get(singleUser) || await Users.getNameUser(singleUser);

          const reason = await global.data.userBanned.get(singleUser).reason;
          const date = await global.data.userBanned.get(singleUser).dateAdded;

          listbanViews.push(`${i++}. ${name} \n🔰UID: ${singleUser}\n📋Lý do: ${reason}\n⏱Time: ${date}`);

          listBanned.push(`${j++}. ${name} \n🔰UID: ${singleUser}`);
          
          //console.log(modules, name)
        }
        return api.sendMessage(listbanViews.length != 0 ? api.sendMessage(`Hiện tai gồm có ${listbanViews.length} 𝗻gười dùng bị ban\n\n${listbanViews.join("\n\n")}` +
          "\n\nReply tin nhắn này + stt có thể rep nhiều số, cách nhau bằng dấu cách nếu muốn unban thread tương ứng.",
          threadID, (error, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: 'unbanuser',
              listBanned
            });
          },
          messageID
        ) : "❎ Hiện tại không có người dùng nào bị ban.", threadID, messageID);
      }

    default:
      {
        return global.utils.throwError(this.config.name, threadID, messageID);
      }
  }
}
