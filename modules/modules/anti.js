const fs = require('fs-extra');
const path = require('path');

const AntiPath = "./modules/commands/data";
const crFile = (f, i) => {
    if (!fs.existsSync(f)) {
        const data = i !== undefined ? JSON.stringify(i, null, 2) : JSON.stringify([]);
        fs.writeFileSync(f, data);
    }
};
const antiDir = path.join(AntiPath, "anti");
if (!fs.existsSync(antiDir)) fs.mkdirSync(antiDir, { recursive: true });

const antiFiles = [
    { name: "antiNameBox", path: path.join(antiDir, "antiNameBox.json") },
    { name: "antiIMG", path: path.join(antiDir, "antiIMG.json") },
    { name: "BietDanh", path: path.join(antiDir, "BietDanh.json") },
    { name: "Out", path: path.join(antiDir, "Out.json") },
    { name: "Join", path: path.join(antiDir, "Join.json") },
    { name: "Qtv", path: path.join(antiDir, "Qtv.json") },
    { name: "iCon", path: path.join(antiDir, "iCon.json") },
    { name: "antiSpam", path: path.join(antiDir, "antiSpam.json") }
];

antiFiles.forEach(file => {
    global[file.name] = file.path;
    crFile(file.path);
});

module.exports.config = {
    name: "anti",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "Niio-team (Vtuan)",
    description: "ANTI BOX",
    commandCategory: "Nhóm",
    usages: "No",
    cooldowns: 0
};

module.exports.run = async ({ api, event, args, Threads }) => {
    const { threadID, senderID } = event
    const LC = args[0]
    if (LC === "namebox") {
        let read = await fs.readFile(antiNameBox, 'utf-8');
        let antiData = read ? JSON.parse(read) : [];
        let threadEntry = antiData.find(entry => entry.threadID === threadID);

        if (threadEntry) {
            antiData = antiData.filter(entry => entry.threadID !== threadID);
            await fs.writeFile(antiNameBox, JSON.stringify(antiData, null, 4), 'utf-8'); 
            api.sendMessage("✅ Đã tắt chế độ chống đổi tên nhóm", threadID);
        } else {
            const thread =  (await Threads.getInfo(threadID));
            const nameBox = thread.name; 

            const Data = { 
                threadID: threadID, 
                namebox: nameBox,
                report: {} 
            };
            antiData.push(Data);

        await fs.writeFile(antiNameBox, JSON.stringify(antiData, null, 4), 'utf-8'); 
        api.sendMessage("✅ Đã bật chế độ chống đổi tên nhóm", threadID);

        }
    } 

    else if (LC === "avtbox") {
        let read = await fs.readFile(antiIMG, 'utf-8');
        let antiData = read ? JSON.parse(read) : [];
        let threadEntry = antiData.find(entry => entry.threadID === threadID);

        if (threadEntry) {
            antiData = antiData.filter(entry => entry.threadID !== threadID);
            await fs.writeFile(antiIMG, JSON.stringify(antiData, null, 4), 'utf-8'); 
            api.sendMessage("✅ Đã tắt chế độ chống đổi ảnh nhóm", threadID);
        } else {
            let url;
            let msg = await api.sendMessage("🔄 Tiến hành khởi động chế độ vui lòng chờ", threadID);
            const thread = (await Threads.getInfo(threadID));

            try {
                const response = await require("axios").get(`https://catbox-mnib.onrender.com/upload?url=${encodeURIComponent(thread.imageSrc)}`);
                url = response.data.url;

                const Data = { 
                    threadID: threadID, 
                    url: url,
                    report: {} 
                };
                antiData.push(Data);
                await fs.writeFile(antiIMG, JSON.stringify(antiData, null, 4), 'utf-8'); 
                api.unsendMessage(msg.messageID);
                api.sendMessage("✅ Đã tắt chế độ chống đổi ảnh nhóm", threadID);
            } catch (error) {
                api.sendMessage("⚠️ Đã xảy ra lỗi", threadID);
            }
        }
    } 

    else if(LC === "bietdanh") {
        let read = await fs.readFile(BietDanh, 'utf-8');
        let antiData = read ? JSON.parse(read) : [];
        let threadEntry = antiData.find(entry => entry.threadID === threadID);
        if (threadEntry) {
            antiData.splice(threadEntry, 1);
            api.sendMessage("✅ Tắt thành công chế độ anti đổi biệt danh", threadID);
        } else {
            const nickName = ((await Threads.getInfo(threadID))).nicknames;
            antiData.push({ threadID, data: nickName });
            api.sendMessage("✅ Bật thành công chế độ anti đổi biệt danh", threadID);
        }
        await fs.writeFile(BietDanh, JSON.stringify(antiData, null, 4), 'utf-8');
    } 

    else if (LC === "out"){
        let read = await fs.readFile(Out, 'utf-8');
        let antiData = read ? JSON.parse(read) : [];
        let threadEntry = antiData.find(entry => entry.threadID === threadID);
        if (threadEntry) {
            antiData = antiData.filter(entry => entry.threadID !== threadID);
            await fs.writeFile(Out, JSON.stringify(antiData, null, 4), 'utf-8'); 
            api.sendMessage("✅ Đã tắt chế độ chống người dùng thoát khỏi nhóm", threadID);
        } else {
            antiData.push({ threadID: threadID });
            await fs.writeFile(Out, JSON.stringify(antiData, null, 4), 'utf-8');
            api.sendMessage("✅ Đã bật chế độ chống người dùng thoát khỏi nhóm", threadID);
        }
    } 

    else if (LC === "join"){
        const info = ((await Threads.getInfo(threadID)))
        if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) 
        return api.sendMessage('⚠️ Bot cần quyền quản trị viên nhóm',threadID, event.messageID);
        let read = await fs.readFile(Join, 'utf-8');
        let antiData = read ? JSON.parse(read) : [];
        let threadEntry = antiData.find(entry => entry.threadID === threadID);
        if (threadEntry) {
            antiData = antiData.filter(entry => entry.threadID !== threadID);
            await fs.writeFile(Out, JSON.stringify(antiData, null, 4), 'utf-8'); 
            api.sendMessage("✅ Đã  chế độ chống người dùng tham gia nhóm", threadID);
        } else {
            antiData.push({ threadID: threadID });
            await fs.writeFile(Join, JSON.stringify(antiData, null, 4), 'utf-8');
            api.sendMessage("✅ Đã bật chế độ chống người dùng tham gia nhóm", threadID);
        }
    } 

    else if (LC === "qtv"){
        const info = (await Threads.getInfo(threadID));
        if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) 
        return api.sendMessage('⚠️ Bot cần quyền quản trị viên nhóm', event.threadID, event.messageID);
        let read = await fs.readFile(Qtv, 'utf-8');
        let antiData = read ? JSON.parse(read) : [];
        let threadEntry = antiData.find(entry => entry.threadID === threadID);
        if (threadEntry) {
            antiData = antiData.filter(entry => entry.threadID !== threadID);
            await fs.writeFile(Qtv, JSON.stringify(antiData, null, 4), 'utf-8'); 
            api.sendMessage("✅ Đã tắt chế độ chống cướp qtv", threadID);
        } else {
            antiData.push({ threadID: threadID });
            await fs.writeFile(Qtv, JSON.stringify(antiData, null, 4), 'utf-8');
            api.sendMessage("✅ Đã bật chế độ chống cướp qtv", threadID);
        }
    } 

    else if (LC === "emoji") { 
        let read = await fs.readFile(iCon, 'utf-8');
        let antiData = read ? JSON.parse(read) : [];
        let threadEntry = antiData.find(entry => entry.threadID === threadID);
        if (threadEntry) {
            antiData = antiData.filter(entry => entry.threadID !== threadID);
            await fs.writeFile(iCon, JSON.stringify(antiData, null, 4), 'utf-8'); 
            api.sendMessage("✅ Đã tắt chế độ chống đổi emoji", threadID);
        } else {
            const thread =  (await Threads.getInfo(threadID));
            const emoji = thread.emoji; 

            const Data = { 
                threadID: threadID, 
                emoji: emoji
            };
            antiData.push(Data);

        await fs.writeFile(iCon, JSON.stringify(antiData, null, 4), 'utf-8'); 
        api.sendMessage("✅ Đã bật chế độ chống đổi emoji", threadID);
        }
    } 

    else if (LC === "spam") {
        const info = (await Threads.getInfo(threadID));
        if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) 
        return api.sendMessage('⚠️ Bot cần quyền quản trị viên nhóm', event.threadID, event.messageID);
        let read = await fs.readFile(antiSpam, 'utf-8');
        let antiData = read ? JSON.parse(read) : [];
        let threadEntry = antiData.find(entry => entry.threadID === threadID);
        if (threadEntry) {
            antiData = antiData.filter(entry => entry.threadID !== threadID);
            await fs.writeFile(antiSpam, JSON.stringify(antiData, null, 4), 'utf-8'); 
            api.sendMessage("✅ Đã tắt chế độ chống spam", threadID);
        } else {
            antiData.push({ threadID: threadID });
            await fs.writeFile(antiSpam, JSON.stringify(antiData, null, 4), 'utf-8');
            api.sendMessage("✅ Đã tắt chế độ chống spam", threadID);
        }
    } 

    else if (LC === "check") { 
        let status = "";
        const filesToRead = [antiNameBox, antiIMG, BietDanh, Out, Join, Qtv,iCon,antiSpam];
        const antiModes = ["namebox","avtbox","bietdanh","out","join","qtv","icon","spam"];

        for (let i = 0; i < filesToRead.length; i++) {
            let read = await fs.readFile(filesToRead[i], 'utf-8');
            let antiData = read ? JSON.parse(read) : [];
            let threadEntry = antiData.find(entry => entry.threadID === threadID);
            if (threadEntry) {
                status += `${i+1}. Anti ${antiModes[i]}: bật\n`;
            } else {
                status += `${i+1}. Anti ${antiModes[i]}: tắt\n`;
            }
        }

        api.sendMessage(`[ CONFIG ANTI ]\n\n${status}\nReply tin nhắn này kèm số thứ tự để bật hoặc tắt chế độ`, threadID,(err, info) => {
            if (err) return console.error(err);
            global.client.handleReply.push({
                name: module.exports.config.name,
                author: senderID,
                messageID: info.messageID,
                threadID: event.threadID,
            });
        });
     } 

    else {
        const messageBody = `
1. anti namebox
🔒 Cấm đổi tên nhóm
2. anti avtbox
📸 Cấm đổi ảnh nhóm
3. anti bietdanh
🏷️ Cấm đổi biệt danh
4. anti out
🚫 Cấm out chùa
5. anti join
➕ Cấm người vào box
6. anti qtv
👑 Chống cướp box
7. anti emoji
😀 Cấm đổi emoji
8. anti spam
🛑 Chống spam
9. anti check
✔️ Check anti của box

-> Hoặc reply theo stt để bật tắt        
`;
        api.sendMessage(messageBody, threadID, (err, info) => {
            if (err) return console.error(err);
            global.client.handleReply.push({
                name: module.exports.config.name,
                author: senderID,
                messageID: info.messageID,
                threadID: event.threadID,
            });
        });
    }
}

module.exports.handleReply = async ({ api, event,Threads,handleReply }) => {
    const { threadID, senderID } = event;
    if (!handleReply.author) return;

    const number = event.args.filter(i => !isNaN(i));
    for (const num of number) {
        switch (num) {
            case "1": {
                let read = await fs.readFile(antiNameBox, 'utf-8');
                let antiData = read ? JSON.parse(read) : [];
                let threadEntry = antiData.find(entry => entry.threadID === threadID);

                if (threadEntry) {
                    antiData = antiData.filter(entry => entry.threadID !== threadID);
                    await fs.writeFile(antiNameBox, JSON.stringify(antiData, null, 4), 'utf-8'); 
                    api.sendMessage("✅ Đã tắt chế độ chống đổi tên nhóm", threadID);
                } else {
                    const thread =  (await Threads.getInfo(threadID));
                    const nameBox = thread.name; 

                    const Data = { 
                        threadID: threadID, 
                        namebox: nameBox,
                        report: {} 
                    };
                    antiData.push(Data);

                await fs.writeFile(antiNameBox, JSON.stringify(antiData, null, 4), 'utf-8'); 
                api.sendMessage("✅ Đã bật chế độ chống đổi tên nhóm", threadID);
                }
                break;
            } 
            case "2": {
                let read = await fs.readFile(antiIMG, 'utf-8');
                let antiData = read ? JSON.parse(read) : [];
                let threadEntry = antiData.find(entry => entry.threadID === threadID);

                if (threadEntry) {
                    antiData = antiData.filter(entry => entry.threadID !== threadID);
                    await fs.writeFile(antiIMG, JSON.stringify(antiData, null, 4), 'utf-8'); 
                    api.sendMessage("✅ Đã tắt chế độ chống đổi ảnh nhóm", threadID);
                } else {
                    let url;
                    let msg = await api.sendMessage("🔨 Tiến hành khởi động chế độ vui lòng chờ!!!", threadID);
                    const thread = (await Threads.getInfo(threadID));

                    try {
                        const response = await require("axios").get(`https://catbox-mnib.onrender.com/upload?url=${encodeURIComponent(thread.imageSrc)}`);
                        url = response.data.url;

                        const Data = { 
                            threadID: threadID, 
                            url: url,
                            report: {} 
                        };
                        antiData.push(Data);
                        await fs.writeFile(antiIMG, JSON.stringify(antiData, null, 4), 'utf-8'); 
                        api.unsendMessage(msg.messageID);
                        api.sendMessage("✅ Đã tắt chế độ chống đổi ảnh nhóm", threadID);
                    } catch (error) {
                        api.sendMessage("Đã xảy ra lỗi!!", threadID);
                    }
                }
                break;
            }
            case "3": {
                let read = await fs.readFile(BietDanh, 'utf-8');
                let antiData = read ? JSON.parse(read) : [];
                let threadEntry = antiData.find(entry => entry.threadID === threadID);
                if (threadEntry) {
                    antiData.splice(threadEntry, 1);
                    api.sendMessage("✅ Tắt thành công chế độ anti đổi biệt danh", threadID);
                } else {
                    const nickName = ((await Threads.getInfo(threadID))).nicknames;
                    antiData.push({ threadID, data: nickName });
                    api.sendMessage("✅ Bật thành công chế độ anti đổi biệt danh", threadID);
                }
                await fs.writeFile(BietDanh, JSON.stringify(antiData, null, 4), 'utf-8');
                break;
            } 
            case "4": {   
                let read = await fs.readFile(Out, 'utf-8');
                let antiData = read ? JSON.parse(read) : [];
                let threadEntry = antiData.find(entry => entry.threadID === threadID);
                if (threadEntry) {
                    antiData = antiData.filter(entry => entry.threadID !== threadID);
                    await fs.writeFile(Out, JSON.stringify(antiData, null, 4), 'utf-8'); 
                    api.sendMessage("✅ Đã tắt chế độ chống người dùng thoát khỏi nhóm", threadID);
                } else {
                    antiData.push({ threadID: threadID });
                    await fs.writeFile(Out, JSON.stringify(antiData, null, 4), 'utf-8');
                    api.sendMessage("✅ Đã bật chế độ chống người dùng thoát khỏi nhóm", threadID);
                }             
                break;
            }
            case "5": {
                const info = ((await Threads.getInfo(threadID)))
                if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) 
                return api.sendMessage('⚠️ Bot cần quyền quản trị viên nhóm',threadID, event.messageID);
                let read = await fs.readFile(Join, 'utf-8');
                let antiData = read ? JSON.parse(read) : [];
                let threadEntry = antiData.find(entry => entry.threadID === threadID);
                if (threadEntry) {
                    antiData = antiData.filter(entry => entry.threadID !== threadID);
                    await fs.writeFile(Out, JSON.stringify(antiData, null, 4), 'utf-8'); 
                    api.sendMessage("✅ Đã  chế độ chống người dùng tham gia nhóm", threadID);
                } else {
                    antiData.push({ threadID: threadID });
                    await fs.writeFile(Join, JSON.stringify(antiData, null, 4), 'utf-8');
                    api.sendMessage("✅ Đã bật chế độ chống người dùng tham gia nhóm", threadID);
                }
                break;
            }
            case "6": {
                const info = (await Threads.getInfo(threadID));
                if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) 
                return api.sendMessage('⚠️ Bot cần quyền quản trị viên nhóm', event.threadID, event.messageID);
                let read = await fs.readFile(Qtv, 'utf-8');
                let antiData = read ? JSON.parse(read) : [];
                let threadEntry = antiData.find(entry => entry.threadID === threadID);
                if (threadEntry) {
                    antiData = antiData.filter(entry => entry.threadID !== threadID);
                    await fs.writeFile(Qtv, JSON.stringify(antiData, null, 4), 'utf-8'); 
                    api.sendMessage("✅ Đã tắt chế độ chống cướp qtv", threadID);
                } else {
                    antiData.push({ threadID: threadID });
                    await fs.writeFile(Qtv, JSON.stringify(antiData, null, 4), 'utf-8');
                    api.sendMessage("✅ Đã bật chế độ chống cướp qtv", threadID);
                }
                break;
            }
            case "7": {
                let read = await fs.readFile(iCon, 'utf-8');
                let antiData = read ? JSON.parse(read) : [];
                let threadEntry = antiData.find(entry => entry.threadID === threadID);
                if (threadEntry) {
                    antiData = antiData.filter(entry => entry.threadID !== threadID);
                    await fs.writeFile(iCon, JSON.stringify(antiData, null, 4), 'utf-8'); 
                    api.sendMessage("✅ Đã tắt chế độ chống đổi emoji", threadID);
                } else {
                    const thread =  (await Threads.getInfo(threadID));
                    const emoji = thread.emoji; 

                    const Data = { 
                        threadID: threadID, 
                        emoji: emoji
                    };
                    antiData.push(Data);

                await fs.writeFile(iCon, JSON.stringify(antiData, null, 4), 'utf-8'); 
                api.sendMessage("✅ Đã bật chế độ chống đổi emoji", threadID);
                }
                break;
            }
            case "8":{
                const info = (await Threads.getInfo(threadID));
                if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) 
                return api.sendMessage('⚠️ Bot cần quyền quản trị viên nhóm', event.threadID, event.messageID);
                let read = await fs.readFile(antiSpam, 'utf-8');
                let antiData = read ? JSON.parse(read) : [];
                let threadEntry = antiData.find(entry => entry.threadID === threadID);
                if (threadEntry) {
                    antiData = antiData.filter(entry => entry.threadID !== threadID);
                    await fs.writeFile(antiSpam, JSON.stringify(antiData, null, 4), 'utf-8'); 
                    api.sendMessage("✅ Đã tắt chế độ chống spam", threadID);
                } else {
                    antiData.push({ threadID: threadID });
                    await fs.writeFile(antiSpam, JSON.stringify(antiData, null, 4), 'utf-8');
                    api.sendMessage("✅ Đã tắt chế độ chống spam", threadID);
                }
                break;
            }
            case "9": {
                let status = "";
                const filesToRead = [antiNameBox, antiIMG, BietDanh, Out, Join, Qtv,iCon,antiSpam];
                const antiModes = ["namebox","avtbox","bietdanh","out","join","qtv","icon","spam"];

                for (let i = 0; i < filesToRead.length; i++) {
                    let read = await fs.readFile(filesToRead[i], 'utf-8');
                    let antiData = read ? JSON.parse(read) : [];
                    let threadEntry = antiData.find(entry => entry.threadID === threadID);
                    if (threadEntry) {
                        status += `${i+1}. Anti ${antiModes[i]}: bật\n`;
                    } else {
                        status += `${i+1}. Anti ${antiModes[i]}: tắt\n`;
                    }
                }

                api.sendMessage(`[ CONFIG ANTI ]\n\n${status}\nReply tin nhắn này kèm số thứ tự để bật hoặc tắt chế độ`, threadID,(err, info) => {
                    if (err) return console.error(err);
                    global.client.handleReply.push({
                        name: module.exports.config.name,
                        author: senderID,
                        messageID: info.messageID,
                        threadID: event.threadID,
                    });
                });
                break;
            }

        }
    }
};

module.exports.handleEvent = async function ({ api, event,Threads, Users }) {
    const { threadID, senderID } = event;

    const adminIDs = (await Threads.getInfo(threadID)).adminIDs.map(admin => admin.id);
    const adminBot = global.config.ADMINBOT || [];

    if (adminBot.includes(senderID) || adminIDs.includes(senderID)) return;

    let read = await fs.readFile(antiSpam, 'utf-8');
    let antiData = read ? JSON.parse(read) : [];
    let threadEntry = antiData.find(entry => entry.threadID === threadID);

    let usersSpam = {};
    if (threadEntry) {
        if (!usersSpam[senderID]) {
            usersSpam[senderID] = { count: 0, start: Date.now() };
        }
        usersSpam[senderID].count++;
        const userInfo = await Users.getData(senderID);
        const userName = userInfo.name;

        if (usersSpam[senderID].start > 2500 && (usersSpam[senderID].count > 5)) {
                api.removeUserFromGroup(senderID, threadID);
                api.sendMessage({
                    body: `Đã tự động kick ${userName} do spam`}, threadID);
            usersSpam[senderID].count = 0;
            usersSpam[senderID].start = Date.now();
        }
    }
}