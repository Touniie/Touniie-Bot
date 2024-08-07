this.config = {
    name: "help",
    version: "1.1.1",
    hasPermssion: 0,
    credits: "DC-Nam mod by Niio-team",
    description: "Xem danh sách lệnh và info",
    commandCategory: "Nhóm",
    usages: "[tên lệnh/all]",
    cooldowns: 0
};
this.languages = {
    "vi": {},
    "en": {}
}
this.run = async function({
    api,
    event,
    args
}) {
    const {
        threadID: tid,
        messageID: mid,
        senderID: sid
    } = event;
    const axios = global.nodemodule['axios'];
    var type = !args[0] ? "" : args[0].toLowerCase();
    var msg = "";
    const cmds = global.client.commands;
    const TIDdata = global.data.threadData.get(tid) || {};
    const moment = require("moment-timezone");
    var thu = moment.tz('Asia/Ho_Chi_Minh').format('dddd');
    if (thu == 'Sunday') thu = 'Chủ Nhật';
    if (thu == 'Monday') thu = 'Thứ Hai';
    if (thu == 'Tuesday') thu = 'Thứ Ba';
    if (thu == 'Wednesday') thu = 'Thứ Tư';
    if (thu == "Thursday") thu = 'Thứ Năm';
    if (thu == 'Friday') thu = 'Thứ Sáu';
    if (thu == 'Saturday') thu = 'Thứ Bảy';
    const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:s | DD/MM/YYYY");
    const hours = moment.tz("Asia/Ho_Chi_Minh").format("HH");
    const admin = config.ADMINBOT;
    const NameBot = config.BOTNAME;
    const version = config.version;
    var prefix = TIDdata.PREFIX || global.config.PREFIX;
    if (type == "all") {
        const commandsList = Array.from(cmds.values()).map((cmd, index) => {
            return `${index + 1}. ${cmd.config.name}\n📝 Mô tả: ${cmd.config.description}\n\n`;
        }).join('');
        return api.sendMessage(commandsList, tid, mid);
    }

    if (type) {
        const command = Array.from(cmds.values()).find(cmd => cmd.config.name.toLowerCase() === type);
        if (!command) {
            const stringSimilarity = require('string-similarity');
            const commandName = args.shift().toLowerCase() || "";
            const commandValues = cmds['keys']();
            const checker = stringSimilarity.findBestMatch(commandName, commandValues);
            if (checker.bestMatch.rating >= 0.5) command = client.commands.get(checker.bestMatch.target);
            msg = `⚠️ Không tìm thấy lệnh '${type}' trong hệ thống.\n📌 Lệnh gần giống được tìm thấy '${checker.bestMatch.target}'`;
            return api.sendMessage(msg, tid, mid);
        }
        const cmd = command.config;
        msg = `[ HƯỚNG DẪN SỬ DỤNG ]\n\n📜 Tên lệnh: ${cmd.name}\n🕹️ Phiên bản: ${cmd.version}\n🔑 Quyền Hạn: ${TextPr(cmd.hasPermssion)}\n📝 Mô Tả: ${cmd.description}\n🏘️ Nhóm: ${cmd.commandCategory}\n📌 Cách Dùng: ${cmd.usages}\n⏳ Cooldowns: ${cmd.cooldowns}s`;
        return api.sendMessage(msg, tid, mid);
    } else {
        const commandsArray = Array.from(cmds.values()).map(cmd => cmd.config);
        const array = [];
        commandsArray.forEach(cmd => {
            const { commandCategory, name: nameModule } = cmd;
            const find = array.find(i => i.cmdCategory == commandCategory);
            if (!find) {
                array.push({
                    cmdCategory: commandCategory,
                    nameModule: [nameModule]
                });
            } else {
                find.nameModule.push(nameModule);
            }
        });
        array.sort(S("nameModule"));
        array.forEach(cmd => {
 if (cmd.cmdCategory.toUpperCase() === 'ADMIN' && !global.config.ADMINBOT.includes(sid)) return
            msg += `[ ${cmd.cmdCategory.toUpperCase()} ]\n📝 Tổng lệnh: ${cmd.nameModule.length} lệnh\n${cmd.nameModule.join(", ")}\n\n`;
        });
        msg += `📝 Tổng số lệnh: ${cmds.size} lệnh\n👤 Tổng số admin bot: ${admin.length}\n👾 Tên Bot: ${NameBot}\n🕹️ Phiên bản: ${version}\n⏰ Hôm nay là: ${thu}\n⏱️ Thời gian: ${time}\n${prefix}help + tên lệnh để xem chi tiết\n${prefix}help + all để xem tất cả lệnh`;
        return api.sendMessage(msg, tid, mid);
    }
}
function S(k) {
    return function(a, b) {
        let i = 0;
        if (a[k].length > b[k].length) {
            i = 1;
        } else if (a[k].length < b[k].length) {
            i = -1;
        }
        return i * -1;
    }
}
function TextPr(permission) {
    p = permission;
    return p == 0 ? "Thành Viên" : p == 1 ? "Quản Trị Viên" : p = 2 ? "Admin Bot" : "Toàn Quyền";
}