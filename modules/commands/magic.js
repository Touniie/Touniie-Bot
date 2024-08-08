module.exports.config = {
  name: 'magic',
  version: '1.1.1',
  hasPermssion: 0,
  credits: 'adu',
  description: 'reply ảnh',
  commandCategory: 'Ảnh',
  usages: 'Reply images or url images',
  cooldowns: 2,
  dependencies: {
       'form-data': '',
       'image-downloader': ''
    }
};

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');
const {image} = require('image-downloader');
module.exports.run = async function({
    api, event, args
}){
    try {
        if (event.type !== "message_reply") return api.sendMessage("Bạn phải reply một ảnh nào đó", event.threadID, event.messageID);
        if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("Bạn phải reply một ảnh nào đó", event.threadID, event.messageID);
        if (event.messageReply.attachments[0].type != "photo") return api.sendMessage("Đây không phải là image", event.threadID, event.messageID);

        const content = (event.type == "message_reply") ? event.messageReply.attachments[0].url : args.join(" ");
			const KeyApi = [
				"mz47xM1LQgbKribSgmQr7wNK",
				"LDcAUKS61HGntxfWEWnVE7RL",
				"uLsppd9uezMyncFpFUb4G6rC",
				"B58mtfFpdBKJS6J2CoY6RhR8",
				"XQz3UVCduTbdV6SP3cF8kGv5",
				"PouV9v9EcnLUTXq1vwtJtxb9",
				"dJJmCTDbJRXjeExG9NciCExb",
				"EPrYYw6sPyKdBZWtkYuK8bQ9",
				"6MHgkhRRspk8LajCqGreB6ff",
				"aR7HgKJtZgH6whfUVJ5fN64T"
			];
        const inputPath = path.resolve(__dirname, 'cache', `photo.png`);
         await image({
        url: content, dest: inputPath
    });
        const formData = new FormData();
        formData.append('size', 'auto');
        formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));
        axios({
            method: 'post',
            url: 'https://api.remove.bg/v1.0/removebg',
            data: formData,
            responseType: 'arraybuffer',
            headers: {
                ...formData.getHeaders(),
                'X-Api-Key': KeyApi[Math.floor(Math.random() * KeyApi.length)],
            },
            encoding: null
        })
            .then((response) => {
                if (response.status != 200) return console.error('Error:', response.status, response.statusText);
                fs.writeFileSync(inputPath, response.data);
                return api.sendMessage({ attachment: fs.createReadStream(inputPath) }, event.threadID, () => fs.unlinkSync(inputPath));
            })
            .catch((error) => {
                return console.error('Request failed:', error);
            });
     } catch (e) {
        console.log(e)
        return api.sendMessage(`Error`, event.threadID, event.messageID);
  }
};
