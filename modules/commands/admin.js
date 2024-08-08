var request = require("request");const { readdirSync, readFileSync, writeFileSync, existsSync, copySync, createWriteStream, createReadStream } = require("fs-extra");
module.exports.config = {
	name: "admin",
	version: "1.0.5",
	hasPermssion: 1,
	credits: "Mirai Team",
	description: "Admin Config",
	commandCategory: "Admin",
	usages: "Config",
    cooldowns: 2,
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.languages = {
    "vi": {
       "listAdmin": `Admin\n\n%1`,
        "listNDH": `Người điều hành\n\n%1`,
        "notHavePermssion": '⚠️ Bạn không đủ quyền hạn để có thể sử dụng chức năng "%1"',
        "addedNewAdmin": '✅ Đã thêm %1 người dùng trở thành admin:\n\n%2',
        "removedAdmin": '✅ Đã gỡ bỏ %1 admin:\n\n%2',
        "adminsupport": '✅ Đã thêm %1 người dùng trở thành người điều hành bot:\n\n%2'

    },
    "en": {
         "listAdmin": '[Admin] Admin list: \n\n%1',
        "notHavePermssion": '[Admin] You have no permission to use "%1"',
        "addedNewAdmin": '[Admin] Added %1 Admin :\n\n%2',
        "removedAdmin": '[Admin] Remove %1 Admin:\n\n%2'
    }
}
module.exports.onLoad = function() {
    const { writeFileSync, existsSync } = require('fs-extra');
    const { resolve } = require("path");
    const path = resolve(__dirname, 'data', 'data.json');
    if (!existsSync(path)) {
        const obj = {
            adminbox: {}
        };
        writeFileSync(path, JSON.stringify(obj, null, 4));
    } else {
        const data = require(path);
        if (!data.hasOwnProperty('adminbox')) data.adminbox = {};
        writeFileSync(path, JSON.stringify(data, null, 4));
    }
}
module.exports.run = async function ({ api, event, args, Users, permssion, getText }) {
    const axios = require('axios')
    const fs = require('fs')
    const content = args.slice(1, args.length);
    if (args.length == 0) return api.sendMessage(`[ ADMIN CONFIG SETTING ]\n\n${global.config.PREFIX}admin add -> Thêm người dùng làm admin\n${global.config.PREFIX}admin remove -> Gỡ vai trò admin\n${global.config.PREFIX}admin sp -> Thêm người dùng làm người điều hành\n${global.config.PREFIX}admin resp -> Gỡ vai trò người điều hành\n${global.config.PREFIX}admin list -> Xem danh sách admin và người điều hành\n${global.config.PREFIX}admin qtvonly -> Bật tắt chế độ quản trị viên\n${global.config.PREFIX}admin pa -> Bật tắt chế độ Người điều hành\n${global.config.PREFIX}admin only -> Bật tắt chế độ chỉ admin sử dụng bot`, event.threadID, event.messageID);
    const { threadID, messageID, mentions } = event;
    const { configPath } = global.client;
    const { ADMINBOT } = global.config;
    const { NDH } = global.config;
    const { userName } = global.data;
    const { writeFileSync } = global.nodemodule["fs-extra"];
    const mention = Object.keys(mentions);

    delete require.cache[require.resolve(configPath)];
    var config = require(configPath);
   try{ switch (args[0]) {
        case "list": {
          listAdmin = ADMINBOT || config.ADMINBOT ||  [];
            var msg = [];
            for (const idAdmin of listAdmin) {
                if (parseInt(idAdmin)) {
                  const name = (await Users.getData(idAdmin)).name
                    msg.push(`👤 Name: ${name}\n🌐 Link:\nhttps://www.facebook.com/profile.php?id=${idAdmin}\n`);
                }
            }
          listNDH = NDH || config.NDH ||  [];
            var msg1 = [];
            for (const idNDH of listNDH) {
            var attachment = [], i = 0;
            for (ID of listAdmin) {
		        var path= __dirname + `/cache/${i++}.jpg`,
			url = (await axios.get(`https://graph.facebook.com/${ID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {responseType: "arraybuffer"})).data
		fs.writeFileSync(path, Buffer.from(url, "utf-8"))
		attachment.push(fs.createReadStream(path))
}
                if (parseInt(idNDH)) {
                  const name1 = (await Users.getData(idNDH)).name
                    msg1.push(`👤 Name: ${name1}\n🌐 Link:\nhttps://www.facebook.com/profile.php?id=${idNDH}\n`);
                }
            }
          return api.sendMessage({body:`[ Danh Sách Admin ]\n\n${msg.join("\n")}\n[ Người điều hành ]\n\n${msg1.join("\n\n")}`,attachment}, event.threadID, event.messageID);
        }
        case "add": {
            const permission = [`${global.config.ADMINBOT[0]}`];
	if (!permission.includes(event.senderID)) return api.sendMessage("⚠️ Bạn không được phép sử dụng lệnh này", event.threadID, event.messageID);
            if(event.type == "message_reply") { content[0] = event.messageReply.senderID }
            if (mention.length != 0 && isNaN(content[0])) {
                var listAdd = [];

                for (const id of mention) {
                    ADMINBOT.push(id);
                    config.ADMINBOT.push(id);
                    listAdd.push(`${id} - ${event.mentions[id]}`);
                };

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("addedNewAdmin", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
            }
            else if (content.length != 0 && !isNaN(content[0])) {
                ADMINBOT.push(content[0]);
                config.ADMINBOT.push(content[0]);
                const name = (await Users.getData(content[0])).name
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("addedNewAdmin", 1, `Admin - ${name}`), threadID, messageID);
            }
            else return global.utils.throwError(this.config.name, threadID, messageID);
        }
case "sp": {
            const permission = [`${global.config.ADMINBOT[0]}`];
	if (!permission.includes(event.senderID)) return api.sendMessage("⚠️ Bạn không được phép sử dụng lệnh này", event.threadID, event.messageID);
            if(event.type == "message_reply") { content[0] = event.messageReply.senderID }
            if (mention.length != 0 && isNaN(content[0])) {
                var listAdd = [];

                for (const id of mention) {
                    NDH.push(id);
                    config.NDH.push(id);
                    listAdd.push(`[ ${id} ] - ${event.mentions[id]}`);
                };

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("adminsupport", 1, `[ Người điều hành ] - ${name}`), threadID, messageID);
            }
            else if (content.length != 0 && !isNaN(content[0])) {
                NDH.push(content[0]);
                config.NDH.push(content[0]);
                const name = (await Users.getData(content[0])).name
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("adminsupport", 1, `[ Người điều hành ] - ${name}`), threadID, messageID);
            }
            else return global.utils.throwError(this.config.name, threadID, messageID);
        }
        case "remove":
        case "rm":
        case "delete": {
            const permission = [`${global.config.ADMINBOT[0]}`];
	if (!permission.includes(event.senderID)) return api.sendMessage("⚠️ Bạn không được phép sử dụng lệnh này", event.threadID, event.messageID);
            if(event.type == "message_reply") { content[0] = event.messageReply.senderID }
            if (mentions.length != 0 && isNaN(content[0])) {
                const mention = Object.keys(mentions);
                var listAdd = [];

                for (const id of mention) {
                    const index = config.ADMINBOT.findIndex(item => item == id);
                    ADMINBOT.splice(index, 1);
                    config.ADMINBOT.splice(index, 1);
                    listAdd.push(`[ ${id} ] - ${event.mentions[id]}`);
                };

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("removedAdmin", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
            }
            else if (content.length != 0 && !isNaN(content[0])) {
                const index = config.ADMINBOT.findIndex(item => item.toString() == content[0]);
                ADMINBOT.splice(index, 1);
                config.ADMINBOT.splice(index, 1);
                const name = (await Users.getData(content[0])).name
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("removedAdmin", 1, `[ ${content[0]} ] - ${name}`), threadID, messageID);
            }
            else global.utils.throwError(this.config.name, threadID, messageID);
        }
        case "resp": {
            const permission = [`${global.config.ADMINBOT[0]}`];
	if (!permission.includes(event.senderID)) return api.sendMessage("⚠️ Bạn không được phép sử dụng lệnh này", event.threadID, event.messageID);
            if(event.type == "message_reply") { content[0] = event.messageReply.senderID }
            if (mentions.length != 0 && isNaN(content[0])) {
                const mention = Object.keys(mentions);
                var listAdd = [];

                for (const id of mention) {
                    const index = config.NDH.findIndex(item => item == id);
                    NDH.splice(index, 1);
                    config.NDH.splice(index, 1);
                    listAdd.push(`[ ${id} ] - ${event.mentions[id]}`);
                };

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("removedAdmin", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
            }
            else if (content.length != 0 && !isNaN(content[0])) {
                const index = config.NDH.findIndex(item => item.toString() == content[0]);
                NDH.splice(index, 1);
                config.NDH.splice(index, 1);
                const name = (await Users.getData(content[0])).name
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("removedAdmin", 1, `[ ${content[0]} ] → ${name}`), threadID, messageID);
            }
            else global.utils.throwError(this.config.name, threadID, messageID);
                              }
        case 'qtvonly': {
       const { resolve } = require("path");
        const pathData = resolve(__dirname, 'data', 'data.json');
        const database = require(pathData);
        const { adminbox } = database;   
          if (permssion < 1) return api.sendMessage("❎ Cần quyền Quản trị viên trở lên để thực hiện", threadID, messageID);
        if (adminbox[threadID] == true) {
            adminbox[threadID] = false;
            api.sendMessage("✅ Tắt thành công chế độ Quản trị viên, tất cả thành viên đều có thể sử dụng Bot", threadID, messageID);
        } else {
            adminbox[threadID] = true;
            api.sendMessage("✅ Kích hoạt thành công chế độ Quản trị viên, chỉ Quản trị viên mới có thể sử dụng Bot", threadID, messageID);
    }
        writeFileSync(pathData, JSON.stringify(database, null, 4));
        break;
    }
    case 'only':
        case '-o': {
      //---> CODE ADMIN ONLY<---//
            const permission = [`${global.config.ADMINBOT[0]}`];
	if (!permission.includes(event.senderID)) return api.sendMessage("⚠️ Bạn không được phép sử dụng lệnh này", event.threadID, event.messageID);
            if (config.adminOnly == false) {
                config.adminOnly = true;
                api.sendMessage(`✅ Bật thành công chế độ chỉ Admin dùng được bot`, threadID, messageID);
            } else {
                config.adminOnly = false;
                api.sendMessage(`✅ Tắt thành công chế độ chỉ Admin dùng được bot`, threadID, messageID);
            }
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                break;
              }
				case 'pa':
        case '-p': {
            const permission = [`${global.config.ADMINBOT[0]}`];
	if (!permission.includes(event.senderID)) return api.sendMessage("⚠️ Bạn không được phép sử dụng lệnh này", event.threadID, event.messageID);
            if (config.adminPaseOnly == false) {
                config.adminPaseOnly = true;
                api.sendMessage(`✅ Bật thành công chỉ Admin or Người điều hành mới nhắn riêng với bot được`, threadID, messageID);
            } else {
                config.adminPaseOnly = false;
                api.sendMessage(`✅ Tắt thành công chỉ Admin or Người điều hành mới nhắn riêng với bot được`, threadID, messageID);
            }
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                break;
							}
        case 'sponly':
        case '-s': {
            const permission = [`${global.config.ADMINBOT[0]}`];
	if (!permission.includes(event.senderID)) return api.sendMessage("⚠️ Bạn không được phép sử dụng lệnh này", event.threadID, event.messageID);
            if (config.ndhOnly == false) {
                config.ndhOnly = true;
                api.sendMessage(`✅ Bật thành công chỉ Admin or Người điều hành mới dùng được bot`, threadID, messageID);
            } else {
                config.ndhOnly = false;
                api.sendMessage(`✅ Tắt thành công chỉ Admin or Người điều hành mới dùng được bot`, threadID, messageID);
            }
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                break;
							}
        default: {
            return global.utils.throwError(this.config.name, threadID, messageID);
        }
    }; } catch (e) {console.log(e)}
}