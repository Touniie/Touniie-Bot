const axios = require('axios');
const fs = require('fs');
const { join } = require("path");
const { PasteClient } = require('pastebin-api');

module.exports.config = {
    name: "adc",
    version: "1.0.0",
    hasPermssion: 3,
    credits: "Thjhn",
    description: "adc mọi loại raw",
    commandCategory: "Admin",
    usages: "[reply or text]",
    cooldowns: 0,
    dependencies: {
        "pastebin-api": "",
        "cheerio": "",
        "request": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { senderID, threadID, messageID, messageReply, type } = event;
    var name = args[0];
    if (type == "message_reply") {
        var text = messageReply.body;
    }

    if (!text && !name) return api.sendMessage('❎ Vui lòng reply link muốn áp dụng code hoặc ghi tên file để up code lên pastebin!', threadID, messageID);

    if (!text && name) {
        var data = fs.readFile(
            `${__dirname}/${args[0]}.js`,
            "utf-8",
            async (err, data) => {
                if (err) return api.sendMessage(`❎ Lệnh ${args[0]} không tồn tại`, threadID, messageID);

                // Tạo client Pastebin
                const client = new PasteClient("P5FuV7J-UfXWFmF4lUTkJbGnbLBbLZJo");

                // Hàm để tạo paste trên Pastebin
                async function pastepin(name) {
                    try {
                        const url = await client.createPaste({
                            code: data,
                            expireDate: 'N',
                            format: "javascript",
                            name: name,
                            publicity: 1
                        });
                        var id = url.split('/')[3];
                        return 'https://pastebin.com/raw/' + id;
                    } catch (error) {
                        throw new Error(`⚠️ Lỗi khi tạo paste trên Pastebin: ${error.message}`);
                    }
                }

                // Lấy liên kết raw từ Pastebin
                try {
                    var link = await pastepin(args[1] || 'noname');
                    return api.sendMessage(link, threadID, messageID);
                } catch (error) {
                    return api.sendMessage(error.message, threadID, messageID);
                }
            }
        );
        return;
    }

    const urlR = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
    const url = text.match(urlR);

    if (url) {
        axios.get(url[0]).then(i => {
            var data = i.data
            fs.writeFile(
                `${__dirname}/${args[0]}.js`,
                data,
                "utf-8",
                function (err) {
                    if (err) return api.sendMessage(`⚠️ Đã xảy ra lỗi khi áp dụng code vào ${args[0]}.js`, threadID, messageID);
                    api.sendMessage(`✅ Đã áp dụng code vào ${args[0]}.js`, threadID, messageID);
                }
            );
        })
    }
};
