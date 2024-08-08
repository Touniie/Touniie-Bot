module.exports.config = {
	name: "money",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "Mirai Team",//mod by Tien
	description: "Kiểm tra số tiền của bản thân hoặc người được tag",
	commandCategory: "Coin",
	usages: "[Tag]",
	cooldowns: 0
};

module.exports.languages = {
	"vi": {
		"sotienbanthan": "💵 Số tiền trong ví: %1$",
		"sotiennguoikhac": "💵 Số tiền trong ví %1: %2$"
	},
	"en": {
		"sotienbanthan": "Your current balance: %1$",
		"sotiennguoikhac": "%1's current balance: %2$"
	}
}

module.exports.run = async function({ api, event, args, Currencies, getText }) {
  try{
	const { threadID, messageID, senderID, mentions } = event;

	if (!args[0]) {
		const money = (await Currencies.getData(senderID)).money;
    const b = money.toLocaleString();
		return api.sendMessage(getText("sotienbanthan", b), threadID, messageID);
	}

	else if (Object.keys(event.mentions).length == 1) {
		var mention = Object.keys(mentions)[0];
		var money = (await Currencies.getData(mention)).money;
		 const b = money.toLocaleString();
		if (!b) money = 0;
		return api.sendMessage({
			body: getText("sotiennguoikhac", mentions[mention].replace(/\@/g, ""), b),
			mentions: [{
				tag: mentions[mention].replace(/\@/g, ""),
				id: mention
			}]
		}, threadID, messageID);
  
	}

	else return global.utils.throwError(this.config.name, threadID, messageID);
    }catch(e){
    console.log(e)
  }
}
