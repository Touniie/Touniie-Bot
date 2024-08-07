
module.exports = function ({ api, models, Users, Threads, Currencies }) {
  const stringSimilarity = require('string-similarity'),
    escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    logger = require("../../utils/log.js");
  const axios = require('axios')

  const request = require('request');
  const fs = require('fs')
  const path = require('path')
  const moment = require("moment-timezone");
  return async function ({ event }) {
    const dateNow = Date.now()
    const time = moment.tz("Asia/Ho_Chi_minh").format("HH:MM:ss | DD/MM/YYYY");
    const { allowInbox, PREFIX, ADMINBOT, NDH, DeveloperMode, adminOnly, keyAdminOnly, ndhOnly, adminPaseOnly } = global.config;
    const { userBanned, threadBanned, threadInfo, threadData, commandBanned } = global.data;
    const { commands, cooldowns } = global.client;
    var { body, senderID, threadID, messageID } = event;
    function byte2mb(bytes) {
      const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      let l = 0, n = parseInt(bytes, 10) || 0;
      while (n >= 1024 && ++l) n = n / 1024;
      return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
    }
    const tm = process.uptime(), Tm = (require('moment-timezone')).tz('Asia/Ho_Chi_Minh').format('HH:mm:ss | DD/MM/YYYY')
    h = Math.floor(tm / (60 * 60)), H = h < 10 ? '0' + h : h,
      m = Math.floor((tm % (60 * 60)) / 60), M = m < 10 ? '0' + m : m,
      s = Math.floor(tm % 60), S = s < 10 ? '0' + s : s, $ = ':'
    var senderID = String(senderID),
      threadID = String(threadID);
    const threadSetting = threadData.get(threadID) || {}
    const prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex((threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : PREFIX)})\\s*`);

    if (senderID === api.getCurrentUserID()) return

    const adminbot = require('./../../config.json');
    if (typeof body === 'string' && body.startsWith(PREFIX) && !ADMINBOT.includes(senderID) && adminbot.adminOnly == true) {
      return api.sendMessage('⚠️ Bot đang được bảo trì, vui lòng sử dụng sau', threadID, messageID)
    }
    const dataAdbox = require('./../../modules/commands/data/data.json');
    var threadInf = (threadInfo.get(threadID) || await Threads.getInfo(threadID));
    const findd = threadInf.adminIDs.find(el => el.id == senderID);
    if (typeof body === 'string' && body.startsWith(PREFIX) && dataAdbox.adminbox.hasOwnProperty(threadID) && dataAdbox.adminbox[threadID] == true && !ADMINBOT.includes(senderID) && !findd && event.isGroup == true) return api.sendMessage('Chỉ quản trị viên nhóm mới có thể sử dụng bot ⚠️', event.threadID, event.messageID)

    if (userBanned.has(senderID) || threadBanned.has(threadID) || allowInbox == ![] && senderID == threadID && body.startsWith(PREFIX)) {
      if ((body || '').startsWith(PREFIX)) {
        if (!ADMINBOT.includes(senderID.toString())) {
          if (userBanned.has(senderID)) {
            const { reason, dateAdded } = userBanned.get(senderID) || {};
            return api.sendMessage(global.getText("handleCommand", "userBanned", reason, dateAdded), threadID, async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 5 * 1000));
              return api.unsendMessage(info.messageID);
            }, messageID);
          } else {
            if (threadBanned.has(threadID)) {
              const { reason, dateAdded } = threadBanned.get(threadID) || {};
              return api.sendMessage(global.getText("handleCommand", "threadBanned", reason, dateAdded), threadID, async (err, info) => {
                await new Promise(resolve => setTimeout(resolve, 5 * 1000));
                return api.unsendMessage(info.messageID);
              }, messageID);
            }
          }
        }
      }
    }
    body = body !== undefined ? body : 'x'
    const [matchedPrefix] = body.match(prefixRegex) || ['']
    var args = body.slice(matchedPrefix.length).trim().split(/ +/);
    var commandName = args.shift().toLowerCase();
    var command = commands.get(commandName);
    //usePrefix -------->
    //console.log(body,args)
    if (!prefixRegex.test(body)) {
      args = (body || '').trim().split(/ +/);
      commandName = args.shift()?.toLowerCase();
      command = commands.get(commandName);
      if (command && command.config) {
        if (command.config.usePrefix === false && commandName.toLowerCase() !== command.config.name.toLowerCase()) {
          api.sendMessage(global.getText("handleCommand", "notMatched", command.config.name), event.threadID, event.messageID);
          return;
        }
        if (command.config.usePrefix === true && !body.startsWith(PREFIX)) {
          return;
        }
      }
      if (command && command.config) {
        if (typeof command.config.usePrefix === 'undefined') {
          return;
        }
      }
    }
    //END --------------<
    if (!command) {
      if (!body.startsWith((threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : PREFIX)) return
      var allCommandName = [];
      const commandValues = commands['keys']();

      for (const cmd of commandValues) allCommandName.push(cmd)
      const checker = stringSimilarity.findBestMatch(commandName, allCommandName);
      if (checker.bestMatch.rating >= 0.5) command = client.commands.get(checker.bestMatch.target);
      else return api.sendMessage(`❎ Lệnh bạn sử dụng không tồn tại gõ ${threadSetting.PREFIX || PREFIX}menu để xem các lệnh hiện có\n✏️ Lệnh gần giống là: ${checker.bestMatch.target}`, threadID, messageID)
    }//\n────────────────\n⏱️ Upt ${H+$+M+$+S}\n⏰ Time: ${Tm}
    if (command) {
      //if(command.config.usePrefix === false) return
      if (true) {
        let fs = require('fs');

        let path = __dirname + '/../../modules/commands/data/commands-banned.json';
        let data = {};
        let send = msg => api.sendMessage(msg, threadID, messageID);
        let is_qtv_box = id => threadInfo.get(threadID).adminIDs.some($ => $.id == id);
        let name = id => global.data.userName.get(id);
        let cmd = command.config.name;

        if (fs.existsSync(path)) data = JSON.parse(fs.readFileSync(path));
        if (data[threadID]) {
          if (ban = data[threadID].cmds.find($ => $.cmd == cmd)) {
            if (ADMINBOT.includes(ban.author) && /*!ADMINBOT.includes(senderID)*/ban.author != senderID) return send(`❎ ${ban.time} admin bot: ${name(ban.author)}\nĐã cấm nhóm sử dụng lệnh ${cmd}`);
            if (is_qtv_box(ban.author) && /*!is_qtv_box(senderID) && !ADMINBOT.includes(senderID)*/ban.author != senderID) return send(`❎ ${ban.time} qtv nhóm: ${name(ban.author)}\nĐã cấm thành viên sử dụng lệnh ${cmd}`);
          };
          if (all = (data[threadID].users[senderID] || {}).all) {
            if (all.status == true && ADMINBOT.includes(all.author) && !ADMINBOT.includes(senderID)) return send(`❎ ${all.time} bạn đã bị admin bot: ${name(all.author)} cấm`);
            if (all.status == true && is_qtv_box(all.author) && !ADMINBOT.includes(senderID) && !is_qtv_box(senderID)) return send(`❎ ${all.time} bạn đã bị qtv box: ${name(all.author)} cấm`);
          };
          if (user_ban = (data[threadID].users[senderID] || {
            cmds: []
          }).cmds.find($ => $.cmd == cmd)) {
            if (ADMINBOT.includes(user_ban.author) && !ADMINBOT.includes(senderID)) return send(`❎ ${user_ban.time} admin bot: ${name(user_ban.author)}\nĐã cấm bạn sử dụng lệnh ${cmd}`);
            if (is_qtv_box(user_ban.author) && !is_qtv_box(senderID) && !ADMINBOT.includes(senderID)) return send(`❎ ${user_ban.time} qtv nhóm: ${name(user_ban.author)}\nĐã cấm bạn sử dụng lệnh ${cmd}`);
          }
        }
      };
    }
    if ((_kJe82Q = process.cwd() + '/modules/commands/data/disable-command.json', fs.existsSync(_kJe82Q))) if (!ADMINBOT.includes(senderID) && JSON.parse(fs.readFileSync(_kJe82Q))[threadID]?.[command.config.commandCategory] == true) return api.sendMessage(`❎ Box không được phép sử dụng các lệnh thuộc nhóm '${command.config.commandCategory}'`, threadID);
    if (commandBanned.get(threadID) || commandBanned.get(senderID)) {
      if (!ADMINBOT.includes(senderID)) {
        const banThreads = commandBanned.get(threadID) || [],
          banUsers = commandBanned.get(senderID) || [];
        if (banThreads.includes(command.config.name))
          return api.sendMessage(global.getText("handleCommand", "commandThreadBanned", command.config.name), threadID, async (err, info) => {
            await new Promise(resolve => setTimeout(resolve, 5 * 1000))
            return api.unsendMessage(info.messageID);
          }, messageID);
        if (banUsers.includes(command.config.name))
          return api.sendMessage(global.getText("handleCommand", "commandUserBanned", command.config.name), threadID, async (err, info) => {
            await new Promise(resolve => setTimeout(resolve, 5 * 1000));
            return api.unsendMessage(info.messageID);
          }, messageID);
      }
    }
    var threadInfo2;
    if (event.isGroup == !![])
      try {
        threadInfo2 = (threadInfo.get(threadID) || await Threads.getInfo(threadID))
        if (Object.keys(threadInfo2).length == 0) throw new Error();
      } catch (err) {
        logger(global.getText("handleCommand", "cantGetInfoThread", "error"));
      }
      var permssion = 0;
      var threadInfoo = threadInfo.get(threadID) || await Threads.getInfo(threadID);
      const find = threadInfoo.adminIDs.find(el => el.id == senderID);
      if (NDH.includes(senderID.toString())) permssion = 2;
      if (ADMINBOT.includes(senderID.toString())) permssion = 3;
      else if (!ADMINBOT.includes(senderID.toString()) && !NDH.includes(senderID) && find) permssion = 1;
      
      var z = "";
      if (command.config.hasPermssion == 1) {
        z = "quản trị viên";
      } else if (command.config.hasPermssion == 2) {
        z = "người điều hành or Admin bot";
      } else if (command.config.hasPermssion == 3) {
        z = "Admin bot";
      }
      
      if (command.config.hasPermssion > permssion) {
        return api.sendMessage(global.getText("handleCommand", "permssionNotEnough", command.config.name, z), event.threadID, event.messageID);
      }
      
      if (!client.cooldowns.has(command.config.name)) client.cooldowns.set(command.config.name, new Map());
      const timestamps = client.cooldowns.get(command.config.name);
      const expirationTime = (command.config.cooldowns || 1) * 1000;
      
      if (timestamps.has(senderID) && dateNow < timestamps.get(senderID) + expirationTime) {
        return api.sendMessage(`🔄 Vui lòng quay lại sau ${((timestamps.get(senderID) + expirationTime - dateNow) / 1000).toString().slice(0, 5)}s`, threadID, messageID);
      }
      
      var getText2;
      if (command.languages && typeof command.languages == 'object' && command.languages.hasOwnProperty(global.config.language)) {
        getText2 = (...values) => {
          var lang = command.languages[global.config.language][values[0]] || '';
          for (var i = 1; i < values.length; i++) {
            const expReg = RegExp('%' + i, 'g');
            lang = lang.replace(expReg, values[i]);
          }
          return lang;
        };
      } else {
        getText2 = () => {};
      }
      
      try {
        const Obj = {};
        Obj.api = api;
        Obj.event = event;
        Obj.args = args;
        Obj.models = models;
        Obj.Users = Users;
        Obj.Threads = Threads;
        Obj.Currencies = Currencies;
        Obj.permssion = permssion;
        Obj.getText = getText2;
        command.run(Obj);
        timestamps.set(senderID, dateNow);
        if (DeveloperMode == !![]) {
          logger(global.getText("handleCommand", "executeCommand", time, commandName, senderID, threadID, args.join(" "), (Date.now()) - dateNow), "[ DEV MODE ]");
        }
        return;
      } catch (e) {
        return api.sendMessage(global.getText("handleCommand", "commandError", commandName, e), threadID);
      }
     }
  }