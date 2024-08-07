const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

class Catbox {
    constructor(hash) {
        this.hash = hash;
    }
    async upload(stream) {
        let formdata = new FormData;

        formdata.append('reqtype', 'fileupload');
        formdata.append('fileToUpload', stream);
        if (this.hash)formdata.append('userhash', this.hash);

        let link = (await axios({
            method: 'POST',
            url: 'https://catbox.moe/user/api.php',
            headers: formdata.getHeaders(),
            data: formdata,
            responseType: 'text',
        })).data;

        return link;
    }
};

const catbox = new Catbox();

module.exports = {
	config: {
		name: "catbox",
		version: "1.0.0",
		hasPermssion: 0,
		credits: "Niio-team (GinzaTech)",
		description: "",
		commandCategory: "Admin",
		usages: "api + link + extension",
		cooldowns: 0
	},

	run: async ({ api, event, args }) => {
    try {
		const { threadID, messageID, messageReply } = event;
		const send = msg => api.sendMessage(msg, threadID, messageID);

		const imageUrl = messageReply?.attachments?.[0]?.url// || args[0];
		const fileExtension = args[0] || 'jpg';

		if (!imageUrl) {
			return send('❎ Bạn cần cung cấp một đường link ảnh.');
		}
  const stream = (await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'stream',
  })).data;
      stream.path = 'tmp.'+fileExtension;
      const link = await catbox.upload(stream);
send(link)
      
		} catch (error) {
			console.error(error);
			send('⚠️ Có lỗi xảy ra khi tải lên ảnh');
		}
	}
};
