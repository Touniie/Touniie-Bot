const path = require("path");
const fs = require("fs");
const e = "👍";
const dataFilePath = path.join(__dirname, "data", "autokick.json");
if (!fs.existsSync(dataFilePath)) {
  fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
  fs.writeFileSync(dataFilePath, '{}');
}
function writeDataToFile(jsonData) {
  fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, "\t"), (err) => {
    if (err) console.error(err);
  });
}
let usersSpam = {};
module.exports = {
  config: {
    name: "autokick",
    version: "1.0.0",
    credits: "NTKhang || Niio-team (Vtuan)",
    hasPermssion: 1,
    description: "Cảnh báo thành viên vi phạm từ ngữ",
    usage: "autokick on/off add/del list auto on/off",
    commandCategory: "Nhóm",
    cooldowns: 0
  },

  run: async ({ api, event, args }) => {
    const threadID = event.threadID;
    const jsonData = require("./data/autokick.json");
    if (!jsonData.hasOwnProperty(event.threadID)) {
      jsonData[event.threadID] = {};
      fs.writeFileSync(dataFilePath, JSON.stringify(jsonData, null, "\t"));
    }
    const threadData = jsonData[threadID] || {};

    if (!threadData.autoKick) {
      threadData.autoKick = {
        words: [],
        reactions: [],
        enables: true,
        autoMode: false,
        autoOFF: false,
        autokickSpam: false
      };

      await new Promise((resolve, reject) => {
        fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, "\t"), (err) => {
          if (err) reject(err);
          else {
            console.log("Dữ liệu đã được ghi vào tệp JSON thành công!");
            resolve();
          }
        });
      });
    }

    switch (args[0]) {
      case "on":
        threadData.autoKick.enables = true;
        threadData.autoKick.autoOFF = false;
        threadData.autoKick.autoMode = false;
        writeDataToFile(jsonData);
        return api.sendMessage("✅ Auto kick đã được bật", event.threadID, event.messageID);
      case "off":
        threadData.autoKick.autoMode = false;
        threadData.autoKick.enables = false;
        threadData.autoKick.autoOFF = false;
        writeDataToFile(jsonData);
        return api.sendMessage("✅ Auto kick đã được tắt", event.threadID, event.messageID);
      case "auto":
        if (!args[1]) {
          return api.sendMessage("⚠️ Vui lòng nhập 'on' để bật hoặc 'off' để tắt chế độ auto", event.threadID, event.messageID);
        }
        const lowerMode = args[1].toLowerCase();
        if (lowerMode === "on") {
          threadData.autoKick.autoOFF = false;
          threadData.autoKick.autoMode = true;
          threadData.autoKick.enables = false;
          writeDataToFile(jsonData);
          return api.sendMessage("✅ Chế độ auto đã được bật", event.threadID, event.messageID);
        } else if (lowerMode === "off") {
          threadData.autoKick.autoOFF = true;
          threadData.autoKick.autoMode = false;
          threadData.autoKick.enables = false;
          writeDataToFile(jsonData);
          return api.sendMessage("✅ Chế độ auto đã được tắt", event.threadID, event.messageID);
        } else {
          return api.sendMessage("⚠️ Vui lòng nhập 'on' để bật hoặc 'off' để tắt chế độ auto", event.threadID, event.messageID);
        }
      case "add":
        if (!args[1]) {
          return api.sendMessage("⚠️ Vui lòng nhập từ cần cấm sau lệnh 'add'", event.threadID, event.messageID);
        }
        const wordsToAdd = args.slice(1).join(" ").split(",").map(word => word.trim());
        threadData.autoKick.words.push(...wordsToAdd);
        writeDataToFile(jsonData);
        const addedWords = wordsToAdd.join(', ');
        return api.sendMessage(`✅ Các từ '${addedWords}' đã được thêm vào danh sách từ cấm`, event.threadID, event.messageID);
      case "del":
        if (!args[1]) {
          return api.sendMessage("⚠️ Vui lòng nhập từ cần xoá sau lệnh 'del'", event.threadID, event.messageID);
        }
        const wordToDelete = args.slice(1).join(" ");
        const index = threadData.autoKick.words.indexOf(wordToDelete);
        if (index !== -1) {
          threadData.autoKick.words.splice(index, 1);
          writeDataToFile(jsonData);
          return api.sendMessage(`✅ Từ '${wordToDelete}' đã được xoá khỏi danh sách từ cấm`, event.threadID, event.messageID);
        } else {
          return api.sendMessage(`⚠️ Từ '${wordToDelete}' không tồn tại trong danh sách từ cấm`, event.threadID, event.messageID);
        }
      case "list":
        let cc = [];
        let dd = [];
        threadData.autoKick.words.forEach((word, index) => {
          const b = `${word}`;
          const w = `${index + 1}. ${b}`;
          dd.push(b);
          cc.push(w);
        });
        const messageContent = `📝 Danh sách từ cấm\n${cc.join("\n")}\n\n📌 Reply tin nhắn này kèm del + số thứ tự để xóa từ cấm`;
        return api.sendMessage(messageContent, event.threadID, async (error, info) => {
          if (error) {
            console.error(error);
          } else {
            global.client.handleReply.push({
              name: module.exports.config.name,
              messageID: info.messageID,
              author: event.senderID,
              dd
            });
          }
        });
      case "spam":
      if (!args[1] || (args[1] !== "on" && args[1] !== "off")) {
        return api.sendMessage("⚠️ Vui lòng nhập 'on' để bật hoặc 'off' để tắt chức năng spam", event.threadID, event.messageID);
      }
      const spamMode = args[1].toLowerCase();
      threadData.autoKick.autokickSpam = spamMode === "on" ? true : false;
      writeDataToFile(jsonData);
      const statusMessage = spamMode === "on" ? "bật" : "tắt";
      return api.sendMessage(`✅ Chức năng chống spam đã được ${statusMessage}`, event.threadID, event.messageID);
        default:
          return api.sendMessage(`
[ AUTO KICK THÀNH VIÊN ]

${global.config.PREFIX}autokick add + từ cần cấm
${global.config.PREFIX}autokick del + từ đã cấm (xoá) có thể thêm nhiều hoặc xoá nhiều cùng lúc bằng cách thêm ',' sau mỗi từ
${global.config.PREFIX}autokick list: xem danh sách từ đã cấm
${global.config.PREFIX}autokick on/off: bật/tắt auto kick
${global.config.PREFIX}autokick auto on/off: bật/tắt tự động kick
${global.config.PREFIX}autokick spam on/off: bật/tắt tự động kick người dùng khi spam`, event.threadID, event.messageID);
    }
  },
  handleReply: async ({ api, handleReply, event }) => {
    const { threadID, senderID, body, messageID } = event;
    const { author, dd } = handleReply;
    if (senderID != author) return api.sendMessage(`Cút`, threadID);
    const args = body.split(' ');

    if (args[0].toLowerCase() === 'del') {
      const fileIndices = args.slice(1).flatMap(index => {
        if (/^\d+$/.test(index)) {
          return parseInt(index);
        } else {
          return null;
        }
      }).filter(index => index !== null);

      let deletedWords = [];

      for (const index of fileIndices) {
        if (!isNaN(index) && index > 0 && index <= dd.length) {
          const wordToDelete = dd[index - 1];
          deletedWords.push(wordToDelete);

          const jsonData = require("./data/autokick.json");
          const autoKickData = jsonData[threadID] || { autoKick: { words: [] } };
          const wordIndex = autoKickData.autoKick.words.indexOf(wordToDelete);

          if (wordIndex !== -1) {
            autoKickData.autoKick.words.splice(wordIndex, 1);
          }
          await writeDataToFile(jsonData);
        }
      }

      if (deletedWords.length > 0) {
        await api.sendMessage(`✅ ${deletedWords.length} từ đã được xoá khỏi danh sách từ cấm:\n${deletedWords.join('\n')}`, threadID, messageID);
      } else {
        await api.sendMessage(`⚠️ Không có từ nào được xoá`, threadID, messageID);
      }
    }
  },  
  handleEvent : async ({ api, event, Threads, Users }) => {
    const { senderID, threadID } = event;
    const gI = await api.getThreadInfo(threadID);
    const aI = (gI.adminIDs || []).find(a => a.id === senderID);
    const auth = [api.getCurrentUserID(), ...global.config.ADMINBOT, ...global.config.NDH];
    const isAuth = aI || auth.includes(senderID);

    if (!fs.existsSync(dataFilePath)) {
        try {
            writeFileSync(dataFilePath, JSON.stringify({}, null, "\t"));
        } catch (e) { 
            console.log(e); 
        }
    }

    const jD = require("./data/autokick.json");
    if (!jD.hasOwnProperty(threadID)) {
        jD[threadID] = {};
        fs.writeFileSync(dataFilePath, JSON.stringify(jD, null, "\t"));
    }

    if (event.body && !isAuth) {
        try {
            const threadData = jD[threadID] || {};
            if (!threadData.autoKick) return;
            let qtvIDs = [];

            if (gI && gI.adminIDs) {
                qtvIDs = gI.adminIDs.map(admin => admin.id);
            }
            const adminNames = await Promise.all(qtvIDs.map(async id => await Users.getNameUser(id)));

            // Tự động kiểm tra và kick người dùng khi spam
          if (threadData.autoKick.autokickSpam === true) {
              const threadInfo =  global.data.threadInfo.get(threadID) || await Threads.getInfo(threadID);
              const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
              const adminBot = global.config.ADMINBOT || [];
              if (adminBot.includes(senderID) || adminIDs.includes(senderID)) return;
              const time = 5000;
              const message = 5;
              let name;
              let errorCount = 0;
              try {
                  if (!usersSpam[senderID]) {
                      usersSpam[senderID] = { count: 0, start: Date.now() };
                  }

                  usersSpam[senderID].count++;
                  name = await Users.getNameUser(senderID);
                  if (usersSpam[senderID].count >= message && (Date.now() - usersSpam[senderID].start < time)) {
                      await api.removeUserFromGroup(senderID, threadID);
                      await api.sendMessage({
                          body: `⛔ Thực thi kick ${name} do spam`
                      }, threadID);
                      usersSpam[senderID].count = 0;
                      usersSpam[senderID].start = Date.now();
                  }
                  return;
              } catch (error) {
                  errorCount++;
                  if (errorCount <= 3) {
                      const mentions = adminNames.map((name, index) => ({ tag: name, id: qtvIDs[index] }));
                      await api.sendMessage({
                          body: `⛔ Phát hiện thành viên ${name} đang spam\n⚠️ Nhưng bot không có quyền qtv để kick\nQuản trị viên \n@${adminNames.join('\n@')}\nCác qtv hãy thêm quyền qtv cho bot để thực thi lệnh`,
                          mentions: mentions
                      }, threadID);
                  }
              }
          }

            // Tự động kiểm tra từ vi phạm
            const matches = event.body.toLowerCase().match(new RegExp(`(\\s|^)(${threadData.autoKick.words.map(word => word += "+").join("|")})(\\s|$)`, "gi"));
            if (matches) {
              ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                if (threadData.autoKick.enables === true && threadData.autoKick.autoOFF === false) {  
                  /// autokick on
                    const mentions = adminNames.map((name, index) => ({ tag: name, id: qtvIDs[index] }));
                    return api.sendMessage({
                        body: `⚠️ Từ cấm '${matches[0]}' đã được phát hiện, Quản trị viên\n@${adminNames.join('\n@')}\nhãy thả cảm xúc vào tin nhắn này để xác nhận lần vi phạm hoặc thả cảm xúc '${e}' để hủy bỏ`,
                        mentions: mentions
                    }, threadID, async (error, message) => {
                        global.client.handleReaction.push({
                            name: module.exports.config.name,
                            messageID: message.messageID,
                            targetID: senderID,
                            type: 'autoON'
                        });
                    }, event.messageID);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  //// autokic auto on
                  } else if (threadData.autoKick.autoMode === true && threadData.autoKick.autoOFF === false) {
                      try {
                          let idx;
                          let reaction;
                          if (jD.hasOwnProperty(threadID)) {
                              idx = jD[threadID].autoKick.reactions.findIndex(reaction => reaction.userID === senderID);
                              if (idx !== -1) {
                                  reaction = jD[threadID].autoKick.reactions[idx];
                                  reaction.count++;
                                  if (reaction.count >= 3) {
                                      await api.removeUserFromGroup(senderID, threadID);
                                      await api.sendMessage(`⛔ Người dùng ${await Users.getNameUser(senderID)} đã vi phạm quá nhiều lần, thực thi kick khỏi nhóm`, threadID);
                                      jD[threadID].autoKick.reactions.splice(idx, 1);
                                      fs.writeFileSync(dataFilePath, JSON.stringify(jD, null, "\t"));
                                      return;
                                  }
                              } else {
                                  jD[threadID].autoKick.reactions.push({ userID: senderID, count: 1 });
                              }
                          } else {
                              jD[threadID] = {
                                  autoKick: {
                                      words: threadData.autoKick.words,
                                      enables: threadData.autoKick.enables,
                                      reactions: [{ userID: senderID, count: 1 }],
                                      autoMode: threadData.autoKick.autoMode
                                  }
                              };
                          }

                          idx = jD[threadID].autoKick.reactions.findIndex(reaction => reaction.userID === senderID);
                          reaction = jD[threadID].autoKick.reactions[idx];
                          fs.writeFileSync(dataFilePath, JSON.stringify(jD, null, "\t"));
                          const userName = await Users.getNameUser(senderID);
                          if (reaction.count >= 3) {
                              return api.sendMessage(`⛔ ${userName} đã vượt quá số lần vi phạm cho phép`, threadID);
                          } else {
                              await api.sendMessage(`⛔ ${userName} đã vi phạm quy định lần ${reaction.count} còn ${3 - reaction.count} lần nữa sẽ bị kick`, threadID);
                          }
                      } catch (error) {
                          const userName = await Users.getNameUser(senderID);
                          const mentions = adminNames.map((name, index) => ({ tag: name, id: qtvIDs[index] }));
                          await api.sendMessage({
                              body: `⛔ Phát hiện thành viên ${userName} đã vi phạm quá số lần!!\n⚠️ Nhưng bot không có quyền qtv để kick\nQuản trị viên \n@${adminNames.join('\n@')}\nCác qtv hãy thêm quyền qtv cho bot để thực thi lệnh`,
                              mentions: mentions
                          }, threadID);
                      }
                  }
                  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

              else if (threadData.autoKick.autoOFF === true) {
                /////// autokick auto off
                  const mentions = adminNames.map((name, index) => ({ tag: name, id: qtvIDs[index] }));
                  return api.sendMessage({
                    body: `⚠️ Từ cấm '${matches[0]}' đã được phát hiện, Quản trị viên \n@${adminNames.join('\n@')}\n📌 Hãy thả cảm xúc vào tin nhắn này để xóa thành viên hoặc '${e}' để hủy bỏ`,
                    mentions: mentions
                  }, threadID, async (error, message) => {
                    global.client.handleReaction.push({
                      name: module.exports.config.name,
                      messageID: message.messageID,
                      targetID: senderID,
                      type: 'autoOFF'
                    });
                  }, event.messageID);
              }
            }
        } catch (error) {
            console.log(error);
        }
    }
  },
  handleReaction : async ({ api, event, Threads, handleReaction, Users }) => {
    const { userID, threadID } = event;
    const { targetID: t, messageID: m, type } = handleReaction;
    const threadInfo = global.data.threadInfo.get(threadID) || await Threads.getInfo(threadID);
    const isAdmin = (threadInfo.adminIDs || []).some(admin => admin.id === userID);
    const authUsers = [api.getCurrentUserID(), ...global.config.ADMINBOT, ...global.config.NDH];
    const auth = isAdmin || authUsers.includes(userID);
    if (!auth) return;
    try {
        if (event.reaction === e) {
            await api.unsendMessage(m); 
        } else {
            await api.removeUserFromGroup(t, threadID);
            api.sendMessage("⛔ Thành viên đã bị xóa khỏi nhóm vì vi phạm quy tắc", threadID);
            api.unsendMessage(m);
            const [adminName, userName] = await Promise.all([Users.getNameUser(userID), Users.getNameUser(t)]);
            api.sendMessage(`📌 ${adminName} đã xác nhận xóa thành viên ${userName}`, threadID);
        }
    } catch (error) {
        api.sendMessage("⚠️ Không thể xóa thành viên này, thử thêm quyền QTV cho Bot và thả cảm xúc lại tin nhắn trên", threadID, messageID);
    }
  }
}