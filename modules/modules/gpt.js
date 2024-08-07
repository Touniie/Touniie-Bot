const axios = require("axios");

module.exports.config = {
    name: "gpt",
    version: "1.0.0",
    hasPermission: 0,
    credits: "quất",
    description: "Kết hợp các lệnh trí tuệ nhân tạo",
    commandCategory: "Tìm kiếm",
    usages: "[hỏi]",
    cooldowns: 2,
};

module.exports.run = async function ({ api, event, args }) {
    const apiKey = 'sk-proj-zu06VtV0uXQL2cNko81sT3BlbkFJ8vr0lcRiLxShV0xdyKOi';
    var query = (event.type === 'message_reply' ? args.join(' ') + ' "' + event.messageReply.body + '"' : args.join(' '));
    const input = encodeURIComponent(query);
    const i = (url) => axios.get(url, { responseType: "stream", }).then((r) => (r.data.path = 'tmp.jpg', r.data))
    axios({
        method: 'post',
        url: 'https://api.openai.com/v1/images/generations',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        data: {
            prompt: input,
            n: 1,
            size: '256x256',
            model: 'image-alpha-001'
        }
    })
        .then(async response => {
            const imageUrl = response.data.data[0].url;
            api.sendMessage({ body: '', attachment: await i(imageUrl) }, event.threadID);
        })
        .catch(error => {
            console.error('Lỗi:', error.message);
        });
}