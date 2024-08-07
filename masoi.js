module.exports.config = {
    name: "masoi",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "D-Jukie convert Kb2aBot",
    description: "Một chiếc ma sói trên mirai",
    commandCategory: "Game",
    usages: "masoi + số làng",
    cooldowns: 0
};
 
module.exports.onLoad = async () => {
    try {
        const GameManager = require('./masoi/GameManager')
        const loader = () => {
            var exportData = {};
            exportData['masoi'] = require('./masoi/index');
            return exportData;
        };
        var gameManager = new GameManager(loader());
        global.gameManager = gameManager
    }
    catch(e) {
        console.log(e)
    }
}

module.exports.handleEvent = async function({ api, event }) {
    const reply = function(message) {
        return api.sendMessage(message, event.threadID, event.messageID);
    }
    if(!global.gameManager || !global.gameManager.items.some(i => i.name == "Ma Sói")) return
        for (const game of global.gameManager.items) {
            if(!game.participants) continue
            if ((game.participants.includes(event.senderID) && !event.isGroup) || game.threadID == event.threadID) {
                game.onMessage(event, reply);
            }
        }
}
module.exports.run = async ({ event, args, Users }) => {
    global.Users = Users
    global.gameManager.run(this.config.name, {
        masterID: event.senderID,
        threadID: event.threadID,
        param: args,
        isGroup: event.isGroup
    })
}
