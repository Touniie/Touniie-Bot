const axios = require('axios');

module.exports.config = {
  name: "ngl",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Kim Joseph DG Bien",
  description: "Send a message using user",
  usePrefix: true,
  commandCategory: "Spam",
  usages: "user_name | nội dung | số lần", // Thay đổi hướng dẫn sử dụng
};

module.exports.run = async ({ api, event, args }) => {
  const input = args.join(' ');
  const inputParts = input.split('|').map(part => part.trim());

  if (inputParts.length !== 3) {
    return api.sendMessage("user_name | nội dung | số lần", event.threadID);
  }

  const nglusername = inputParts[0];
  const message = inputParts[1];
  const amount = parseInt(inputParts[2]);

  if (!nglusername || !message || isNaN(amount)) {
    return api.sendMessage("user_name | nội dung | số lần", event.threadID);
  }

  try {
    const headers = {
      'referer': `https://ngl.link/${nglusername}`,
      'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
    };

    const data = {
      'username': nglusername,
      'question': message,
      'deviceId': 'ea356443-ab18-4a49-b590-bd8f96b994ee',
      'gameSlug': '',
      'referrer': '',
    };

    let successCount = 0;
    for (let i = 0; i < amount; i++) {
      const response = await axios.post('https://ngl.link/api/submit', data, {
        headers,
      });

      if (response.status === 200) {
        successCount += 1;
      }
    }

    const formattedMessage = `✅ Đã Gửi ${amount} Lần Đến ${nglusername}\nNội Dung: ${message}`;
    api.sendMessage(formattedMessage, event.threadID);
  } catch (error) {
    console.error(error);
    api.sendMessage(`An error occurred while sending the message through ngl.link: ${error.message}`, event.threadID);
  }
};