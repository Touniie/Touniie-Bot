module.exports.config = {
    name: "zwar",
    version: "1.0.4",
    credits: "GinzaTech & Michael",
    description: "Chiến đấu với zombie",
    usages: "[register/shop/prison/help]",
    commandCategory: "Game",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.onLoad = async () => {
    const fs = require("fs-extra");
    const axios = require("axios");

    const dirMaterial = __dirname + `/zwar/`;

    if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(dirMaterial + "data.json")) (await axios({
        url: "https://raw.githubusercontent.com/J-JRT/zwar/mainV2/data.json",
        method: 'GET',
        responseType: 'stream'
    })).data.pipe(fs.createWriteStream(dirMaterial + "data.json"));

    if (!fs.existsSync(dirMaterial + "gun.json")) (await axios({
        url: "https://raw.githubusercontent.com/J-JRT/zwar/mainV2/gun.json",
        method: 'GET',
        responseType: 'stream'
    })).data.pipe(fs.createWriteStream(dirMaterial + "gun.json"));

    return;
}

module.exports.handleReaction = async ({ api, event, handleReaction, Currencies }) => {
    if (handleReaction.author != event.userID) return;
    try {
        switch (handleReaction.type) {
            case "upgradeSlotConfirm": {
                var userData = await Currencies.getData(event.userID),
                    money = userData.money,
                    zwar = userData.data.zwar;
                money = money - (handleReaction.choose * 2000);

                zwar.size = handleReaction.choose;
                await Currencies.setData(event.userID, { money, data: userData.data });
                return api.sendMessage(`[ SHOP ] - Bạn đã mua thành công ${handleReaction.choose} vị trí!`, event.threadID, event.messageID);
            }
            default:
                break;
        }
    }
    catch (e) {
        console.log(e);
        return api.sendMessage("[ ZWAR ] - zombie đã tiêu diệt hết người chơi", event.threadID, event.messageID);
    }
}

module.exports.handleReply = async function ({ api, event, client, handleReply, Currencies }) {
    if (handleReply.author != event.senderID) return;
    const { readFileSync } = require("fs-extra");
    const emptygun = {
        name: "Empty",
        size: 0.0,
        price: 0,
    };

    var datagun = require('./zwar/gun.json');

    switch (handleReply.type) {
        case "shop": {
            switch (event.body) {
                case "1": {
                    var entryList = [],
                        i = 1;
                    for (const gun of datagun.gun) {
                        entryList.push(`${i}. ${gun.name}: ${gun.price}$\nĐộ bền: ${gun.duribility}\nThời Gian Chờ : ${gun.time} giây\n`);
                        i++;
                    }
                    return api.sendMessage(
                        "[ SHOP WEAPON ]\n\n" +
                        entryList.join("\n") +
                        "\n\nReply tin nhắn này với vũ khí bạn muốn mua"
                        , event.threadID, (error, info) => {
                            global.client.handleReply.push({
                                name: this.config.name,
                                messageID: info.messageID,
                                author: event.senderID,
                                type: "buyShop"
                            });
                        }, event.messageID);
                }
                case "2": {
                    var userData = (await Currencies.getData(event.senderID)),
                        zmoney = 0,
                        data = userData.data;
                    data.zwar.critters.forEach(e => zmoney += parseInt(e.price));
                    data.zwar.critters = [];
                    await Currencies.setData(event.senderID, { money: parseInt(userData.money + zmoney), data: data });
                    return api.sendMessage(`[ ZWAR ] - Tổng số tiền bạn bán được là: ${zmoney}$`, event.threadID, event.messageID);
                }
                case "3": {
                    const userData = (await Currencies.getData(event.senderID)).data.zwar;
                    return api.sendMessage(`[ UPGRADE BALO ]\nHiện tại bạn đang có ${userData.critters.length += 1} vị trí có thể chứa đồ trong kho đồ của bạn\n\nReply tin nhắn này cùng số slot bạn muốn nâng cấp`, event.threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "upgradeSlot"
                        })
                    })
                }
                default:
                    break;
            }
            return;
        }
        case "buyShop": {
            try {
                const choose = parseInt(event.body);
                var userData = (await Currencies.getData(event.senderID));
                if (isNaN(event.body)) return api.sendMessage("[ ERROR ] - Lựa chọn của bạn không phải là một con số!", event.threadID, event.messageID);
                if (choose > datagun.length || choose < datagun.length) return api.sendMessage("[ ERROR ] » Lựa chọn của bạn vượt quá danh sách", event.threadID, event.messageID);
                const gunUserChoose = datagun.gun[choose - 1];
                if (userData.money < gunUserChoose.price) return api.sendMessage("[ ERROR ] - Bạn không đủ tiền để có thể súng mới", event.threadID, event.messageID);
                userData.data.zwar.weapon.name = gunUserChoose.name;
                userData.data.zwar.weapon.price = gunUserChoose.price;
                userData.data.zwar.weapon.time = gunUserChoose.time;
                userData.data.zwar.weapon.duribility = gunUserChoose.duribility;
                userData.money = userData.money - gunUserChoose.price;
                await Currencies.setData(event.senderID, { money: userData.money, data: userData.data });
                return api.sendMessage(`[ SHOP ] - Bạn đã mua thành công ${gunUserChoose.name} với giá ${gunUserChoose.price}$`, event.threadID, event.messageID);
            }
            catch (e) {
                console.log(e);
                return api.sendMessage("Đã xảy ra lỗi!", event.threadID, event.messageID);
            }
        }
        case "upgradeSlot": {
            try {
                const choose = parseInt(event.body);
                var userData = (await Currencies.getData(event.senderID));
                if (isNaN(event.body)) return api.sendMessage("[ ERROR ] - Lựa chọn của bạn không phải là một con số!", event.threadID, event.messageID);
                const moneyOfUpgrade = choose * 2000;
                if (userData.money < moneyOfUpgrade) return api.sendMessage(`[ SHOP ] - Bạn không đủ tiền để có thể mua thêm chỗ cho túi đồ, bạn còn thiếu ${moneyOfUpgrade - userData.money}$`, event.threadID, event.messageID);
                return api.sendMessage(`[ SHOP ] - Bạn muốn mua ${choose} với giá ${moneyOfUpgrade} không? \n\nReaction tin nhắn này để đồng ý!`, event.threadID, (error, info) => {
                    global.client.handleReaction.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        choose,
                        type: "upgradeSlotConfirm"
                    })
                })
            }
            catch (e) {
                console.log(e);
                return api.sendMessage("Đã xảy ra lỗi!", event.threadID, event.messageID);
            }
        }
        default: {
            break;
        }
    }
}

module.exports.getRarity = () => {
    return this.getRarityRecursion(Math.floor(Math.random() * Math.floor(100)), -1, 0);
}

module.exports.getRarityRecursion = (chance, index, number) => {
    const catchChance = {
        'Siêu Bình Thường': 50,
        'Bình Thường': 50,
        'Trung Bình': 45,
        'Hiếm': 50,
        'Siêu Hiếm': 50,
        'Cực Hiếm': 50,
        'Cực Phẩm': 50
    }
    const rarityList = [
        'Siêu Bình Thường',
        'Bình Thường',
        'Trung Bình',
        'Hiếm',
        'Siêu Hiếm',
        'Cực Hiếm',
        'Cực Phẩm'
    ]

    if (index === 0 && chance <= catchChance[rarityList[0]]) return rarityList[0]
    else if (index >= rarityList.length - 1 && chance >= catchChance[rarityList[rarityList.length - 1]]) return rarityList[rarityList.length - 1]
    else if (chance > number && chance <= (number + catchChance[rarityList[index + 1]])) return rarityList[index + 1];
    else return this.getRarityRecursion(chance, index + 1, (number + catchChance[rarityList[index + 1]]));
}

module.exports.getZombie = (zombieRarity, currentHour, currentMonth) => {
    const { readFileSync } = require("fs-extra");
    var { Zombie } = require('./zwar/data.json');
    var newZombieData = Zombie.filter(z => (z.time.indexOf(parseInt(currentHour)) !== -1) && (z.months.indexOf(parseInt(currentMonth)) !== -1) && z.rarity == zombieRarity);
    return newZombieData;
}

module.exports.run = async function ({ api, event, args, client, Currencies, Users }) {
    const { configPath } = global.client;
    var config = require(configPath);
    const a = config.PREFIX;
    const emptygun = {
        name: "None",
        price: 0,
        time: 120
    };
    var userData = await Currencies.getData(event.senderID)
    var dataUser = userData.data.zwar || {};
    switch (args[0]) {
        case "register":
        case "-r": {
            try {
                if (Object.entries(dataUser).length != 0 && dataUser['new']) return api.sendMessage("[ ZWAR ] - Bạn đã có mặt trên chiến trường!", event.threadID, event.messageID);
                userData.data.zwar = {};
                var s = userData.data.zwar;
                s.weapon = emptygun;
                s.critters = [];
                s.size = 10;
                s.new = true;
                await Currencies.setData(event.senderID, { data: userData.data });
                return api.sendMessage("[ ZWAR ] - Bạn đã đăng ký vào chiến trường thành công!", event.threadID, event.messageID);
            }
            catch (e) {
                console.log(e);
                return api.sendMessage("Đã xảy ra lỗi!", event.threadID, event.messageID);
            }
        }
        case "shop":
        case '-s': {
            if (Object.entries(dataUser).length == 0 && !dataUser['new']) return api.sendMessage("[ ZWAR ] - Bạn chưa có mặt trên chiến trường", event.threadID, event.messageID);
            return api.sendMessage(
                "[ Shop Weapon ]" +
                "\n1. Mua Súng" +
                "\n2. Bán Zombie" +
                "\n3. Nâng Cấp Kho" +
                "\n\nReply tin nhắn này và đưa ra lựa chọn của bạn"
                , event.threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "shop"
                    });
                }, event.messageID);
        }
        case "prison":
        case '-p': {
            if (Object.entries(dataUser).length == 0 && !dataUser['new']) return api.sendMessage("[ ZWAR ] - Bạn chưa có mặt trên chiến trường", event.threadID, event.messageID);
            var listCritters = [],
                msg = "",
                index = 1;
            for (const gun of dataUser.critters) {
                listCritters.push({
                    name: gun.name,
                    rarity: gun.rarity,
                    price: gun.price,
                    size: gun.size
                })
            }

            listCritters.sort((a, b) => {
                if (a.size > b.size) return -1;
                if (a.size < b.size) return 1;

                if (a.price > b.price) return -1;
                if (a.price < b.price) return 1;
            })

            for (const sorted of listCritters) {
                if (index == 11 || sorted.name == "Empty") ""
                else {
                    msg += `\n${index}/ ${sorted.name} : ${sorted.size}cm - ${sorted.price} coins`;
                    index += 1;
                }
            }
            if (msg.length == 0) msg = "[ ERROR ] - Hiện tại prison của bạn chưa có gì";

            return api.sendMessage(`[ Kho Đồ ]\n${msg}\n\n[ Thông Tin Súng ]\n\n[ Tên Súng ] : ${dataUser.weapon.name || 'Chưa có'}\n[ Số đạn Còn Lại ] : ${dataUser.weapon.duribility} lần bắn\n[ Tình trạng ] : ${(dataUser.weapon.duribility == 0) ? "Đã hết đạn" : "Hoạt động tốt!"}\n\n[ prison Info ]\n\nSlots: ${dataUser.critters.length} / ${dataUser.size}\nTình trạng: ${(dataUser.critters.length == dataUser.size) ? "Túi đã đầy" : "Túi vẫn còn chỗ trống"}`, event.threadID, event.messageID);
        }
      case 'help': {
        return api.sendMessage(`[ Zombie War ]\nMột trò chơi giải trí về zombie, cầm súng lên và vào chiến trường chiến đấu với zombie nào.\n\nHướng dẫn chơi Zombie War:\n${global.config.PREFIX}${this.config.name} register -> Để đăng kí vào chiến trường\n${global.config.PREFIX}${this.config.name} shop -> Để mua trang bị\n${global.config.PREFIX}${this.config.name} prison -> Xem những zombie bạn đã bắt được\n\nĐể chiến đầu với zombie hãy sử dụng ${a}${this.config.name}`, event.threadID, event.messageID)
      }
        default: {
            try {
                const format = new Intl.NumberFormat();
                if (Object.entries(dataUser).length == 0 && !dataUser['new']) return api.sendMessage(`[ ZWAR ] - Bạn chưa có mặt trên chiến trường\nDùng ${global.config.PREFIX}${this.config.name} register để đăng ký`, event.threadID, event.messageID);
                var dates = Math.floor((Math.abs(dataUser.time - new Date()) / 1000) / 60);
                if (dataUser.weapon.price === 0) return api.sendMessage(`[ ZWAR ] - Bạn chưa có súng\nDùng ${global.config.PREFIX}${this.config.name} shop để mua súng`, event.threadID, event.messageID);
                else if (dates < dataUser.weapon.time) return api.sendMessage("[ ZWAR ] - Bạn đang trong thời gian chờ, hãy thử lại sau!", event.threadID, event.messageID);
                else if (dataUser.weapon.duribility < 1) {
                    dataUser.weapon = emptygun;
                    return api.sendMessage("[ ZWAR ] - Súng của bạn đã hỏng, hãy mua súng mới", event.threadID, event.messageID);
                }

                var zombieRarity = this.getRarity();
                var currentHour = new Date().getHours();
                var currentMonth = new Date().getMonth();
                const zombieData = await this.getZombie(zombieRarity, currentHour, currentMonth);
                if (!zombieData || zombieData.length == 0) return api.sendMessage("[ ZWAR ] - Hiện tại không có zombie để bắn", event.threadID, event.messageID);
                var caught = zombieData[Math.floor(Math.random() * ((zombieData.length - 1) - 0 + 1)) + 0];
                caught.size = Math.abs(parseFloat(Math.random() * (caught.size[0] - caught.size[1]) + caught.size[1]).toFixed(1));
                if (dataUser.size > dataUser.critters.length) {
                    dataUser.critters.push(caught);
                } else return api.sendMessage("[ ZWAR ] - Túi của bạn không còn đủ không gian lưu trữ!", event.threadID, event.messageID);
                dataUser.weapon.duribility--;
                await Currencies.setData(event.senderID, { data: userData.data });
                const nameUser = (await Users.getData(event.senderID)).name || (await Users.getInfo(event.senderID)).name;

                return api.sendMessage(
                    "[ ZWAR ] - Bạn đã bắt được " + caught.name +
                    "\n\n[ Thông Tin Chung ]" +
                    `\nNgười bắt: ${nameUser}`
                    .replace(/\{name}/g, nameUser) + 
                    "\nKích cỡ: " + caught.size + "m" +
                    "\nĐộ Hiếm Zombie: " + caught.rarity +
                    "\nMô Tả: " + caught.catch +
                    "\nGiá trị: " + format.format(caught.price) + "$", event.threadID, event.messageID);
            }
            catch (e) {
                console.log(e);
                return api.sendMessage("Đã xảy ra lỗi!", event.threadID, event.messageID);
            }
        }
    }
}