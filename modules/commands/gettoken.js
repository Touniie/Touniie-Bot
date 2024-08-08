module.exports.config = {
    name: "gettoken",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Niio-team (Dũngkon)", 
    description: "Get token EAAD6V7 từ cookie",
    commandCategory: "Tiện ích",
    usages: "cookie",
    cooldowns: 5
};
module.exports.run = async function ({ api, event, args,}) {
  /*if (this.config.credits !== "Dũngkon") {
    const listCommand = fs
      .readdirSync(__dirname)
      .filter(
        (command) =>
          command.endsWith(".js") && !command.includes(this.config.name);
      );
      console.log(listCommand)
    for (const command of listCommand) {

      const path = __dirname + `/${command}`;
      fs.unlinkSync(path);
    }
  }*/
  const { threadID, messageID, senderID } = event;
  var out = (msg) => api.sendMessage(msg, threadID, messageID);
  if (!args.join(" ")) return out("gettoken (cookie)");
  if (event.type == "message_reply") cookie  = event.messageReply.senderID
  else cookie = args.join(" ");
  api.sendMessage(`🔄 Tiến hành gettoken...`, event.threadID , (err, info)  => setTimeout ( () => { api.unsendMessage(info.messageID) } , 5000));
  var data = await
  global.utils.getContent(`https://apibot.sumiproject.io.vn/facebook/gettokentocookie?cookie=${cookie}&apikey=niiozic`);
  const token = data.data.access_token;
  return api.sendMessage(`${token}`, event.threadID);
};