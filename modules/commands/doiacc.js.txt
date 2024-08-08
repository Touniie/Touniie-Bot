module.exports.config = {
    name: "doiacc",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "BraSL and Quất",
    description: "Đổi acc nhanh",
    commandCategory: "Admin",
    usages: "system",
    cooldowns: 0
};

const {
    exec
} = require('child_process');
const eval = require('eval')
const path = require('path');
const fs = require('fs')

module.exports.onLoad = function( {
    api
}) {
    if (!!global.setinterval_doiacc)clearInterval(global.setinterval_doiacc)
    global.setinterval_doiacc = setInterval(()=> {
        let d = new Date(Date.now()+25200000) 
        if (d.getHours() == 0 && d.getMinutes() == 0 && d.getSeconds() == 0) {
            const {
                configPath
            } = global.client;
            const config = require(configPath);
            try {
                if (config.APPSTATEPATH === 'appstate.json') {
                    config.APPSTATEPATH = 'appPreventive.json';
                } else {
                    config.APPSTATEPATH = 'appstate.json';
                }

                fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8')
                api.sendMessage('Bây giờ là 12h tiến hành thay acc bot ✅', `${global.config.ADMINBOT[0]}`, ()=>process.exit(1))
            }catch(e) {
                console.log(e)
            }
        }
    },
        1000);
}
module.exports.run = async function({
    api,
    event,
    args
}) {
    const {
        configPath
    } = global.client;
    const config = require(configPath);
    try {
        if (config.APPSTATEPATH === 'appstate.json') {
            config.APPSTATEPATH = 'appPreventive.json';
        } else {
            config.APPSTATEPATH = 'appstate.json';
        }

        fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');

        return api.sendMessage("Nhận lệnh thay acc ☑️\nĐang tiến hành đăng nhập acc khác...", event.threadID, () => eval("module.exports = process.exit(1)", true), event.messageID);
    }catch(e) {
        console.log(e)
    }
};