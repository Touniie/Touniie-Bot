module.exports.config = {
    name: "antijoin",
    eventType: ["log:subscribe"],
    version: "1.0.0",
    credits: "D-Jukie rmk Niio-team (Vtuan)",
    description: "Cấm thành viên mới vào nhóm"
   };

   const fs = require('fs-extra');
   
module.exports.run = async function ({ event, api, Threads, Users }) {
    let read = await fs.readFile(Join, 'utf-8');
    let antiData = read ? JSON.parse(read) : [];
    let threadEntry = antiData.find(entry => entry.threadID === event.threadID);

    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) return;
    if (threadEntry) {
        var memJoin = event.logMessageData.addedParticipants.map(info => info.userFbId);
        for (let idUser of memJoin) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            api.removeUserFromGroup(idUser, event.threadID, async function (err) {
                (error, info) => {
                    if (error) {
                        api.sendMessage(
                            `❎ Không thể xóa thành viên khỏi nhóm: ${error}`,
                            event.threadID
                        );
                    } else {
                        api.sendMessage(
                            `✅ Thành công xóa thành viên khỏi nhóm.`,
                            event.threadID
                        );
                    }
                },
                await Threads.setData(event.threadID, { data });
                global.data.threadData.set(event.threadID, data);
            })
        }
        return api.sendMessage(`⚠️ Thực thi anti người dùng vào nhóm`, event.threadID);
    }
}