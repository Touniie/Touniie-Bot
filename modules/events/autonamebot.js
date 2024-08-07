module.exports.config = {
    name: "autonamebot.js",
    eventType: ["log:subscribe"],
    version: "1.0.1",
    credits: "Niio-team (vtuan)",
    description: "Auto đổi tên bot",
    dependencies: {
      "fs-extra": "",
      "path": "",
      "pidusage": ""
    }
};
module.exports.run = async function({ api, event, Users, Threads }) {
    const listID  = [
        "ID1",
        "ID2",
        "ID3",
    ]
    for (let i = 0 ; i < listID.length;i++) {
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == listID[i])) {
        api.changeNickname(`[ ${prefix} ] • ${(!global.config.BOTNAME) ? "BOT" : global.config.BOTNAME}`, event.threadID, listID[i]);
        }
    }
}