const fs = require('fs');
const moment = require('moment-timezone');

const path = __dirname + '/data/daily/';
const cooldownTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

exports.config = {
    name: 'work',
    version: '1.0.0',
    hasPermssion: 0,
    credits: 'Cthinh',
    description: 'Nhận tiền mỗi ngày',
    commandCategory: 'Coin',
    cooldowns: 0,
};

exports.run = async ({ api, event, Currencies }) => {
    const senderID = event.senderID;
    const userDataPath = path + senderID + '.json';
    const senderInfo = await api.getUserInfo(senderID);
    const senderName = senderInfo[senderID].name;
    const currentTime = moment.tz('Asia/Ho_Chi_Minh');
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
    if (!fs.existsSync(userDataPath)) {
        const randomMoney = Math.floor(Math.random() * 10000);
        await Currencies.increaseMoney(senderID, randomMoney);
        const userData = {
            lastDailyTime: currentTime.valueOf(),
        };
        fs.writeFileSync(userDataPath, JSON.stringify(userData));
        return api.sendMessage(`${senderName} làm việc và nhận được ${randomMoney}$`, event.threadID);
    } else {
        const userData = JSON.parse(fs.readFileSync(userDataPath));
        const lastDailyTime = userData.lastDailyTime;
        const timeSinceLastDaily = currentTime.valueOf() - lastDailyTime;
        const remainingTime = cooldownTime - timeSinceLastDaily;
        if (timeSinceLastDaily < cooldownTime) {
            const remainingTimeString = formatTime(remainingTime);
            return api.sendMessage(`${senderName} bạn đã làm việc rồi, quay lại sau ${remainingTimeString}`, event.threadID);
        } else {
            const randomMoney = Math.floor(Math.random() * 10000);
            await Currencies.increaseMoney(senderID, randomMoney);
            fs.unlinkSync(userDataPath);
            const newUserData = {
                lastDailyTime: currentTime.valueOf(),
            };
            fs.writeFileSync(userDataPath, JSON.stringify(newUserData));
            return api.sendMessage(`${senderName} làm việc và nhận được ${randomMoney}$`, event.threadID);
        }
    }
};

const formatTime = (time) => {
    const pad = (num) => {
      return num < 10 ? "0" + num : num;
    };
    const hours = pad(Math.floor(time / (60 * 60 * 1000)));
    const minutes = pad(Math.floor((time % (60 * 60 * 1000)) / (60 * 1000)));
    const seconds = pad(Math.floor((time % (60 * 1000)) / 1000));
    return `${hours}:${minutes}:${seconds}`;
  };