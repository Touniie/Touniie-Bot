'use strict';
module.exports.config = {
	name: "xidach",
	version: "1.2.3-superfix",
	hasPermssion: 0,
	credits: "DungUwU",
	description: "Chơi xì dách",
	commandCategory: "Game",
	usages: "[create/join/leave/start]\n->\ncreate tiền_cược (tối thiểu 50$)\njoin tiền_cược (tối thiểu 50$)\nleave (rời ván xì dách đang tham gia ở nhóm)\nstart (bắt đầu ván xì dách mà bạn tạo ở nhóm)\n->",
	cooldowns: 5,
	dependencies: {
		"fs": "",
		"axios": ""
	},
	envConfig: {
		"maxPlayers": 5, //khuyến nghị: 5, tối thiểu 2, tối đa 10
		"normalWinBonus": 1, //thưởng 100%
		"superWinBonus": 2, //thưởng 200%
		"epicWinBonus": 4,  //thưởng 400%
	}
};

module.exports.languages = {
	"vi": {
        "missingInput": "[ XIDACH ] - Số tiền đặt cược không được để trống hoặc là số âm",
        "moneyBetNotEnough": "[ XIDACH ] - Số tiền bạn đặt lớn hơn hoặc bằng số dư của bạn!",
        "limitBet": "[ XIDACH ] - Số coin đặt không được dưới 50$!",
        "noGame": "[ XIDACH ] - Nhóm của bạn không có ván xì dách nào đang diễn ra cả!",
        "xidachRules": `[ XIDACH ]\nNOTE:\nxì dách là: 1 A + 1 trong J Q K\nxì bàng: 2A\n────────────────\nLuật:\nđiểm từ 16 đến 21:\nngười chơi > nhà cái: win x1 thưởng\nvà ngược lại\n\nxì bàng > xì dách:\nngười chơi có xì bàng hoặc xì dách, nhà cái k có -> x4 thưởng\nngười chơi có xì bàng, nhà cái có xì dách -> x2 thưởng\nngười chơi có xì dách, nhà cái xì bàng -> Lose\n\nNgũ linh: 5 lá bài mà tổng điểm nhỏ hơn 21. Người chơi Win tuyệt đối. Trường hợp cả 2 bên đều ngũ linh, ai ít điểm hơn sẽ Win.\n\nQuá 21 điểm: 2 bên cùng quá thì ai ít điểm hơn sẽ Win. Quá 21 điểm thì Win bài thấp hơn 16 điểm (non).\n\n[ Cách dùng ]\n────────────────\n${global.config.PREFIX}xidach create + tiền cược -> để tạo ván xidach\n${global.config.PREFIX}xidach join + tiền cược -> để tham gia ván xidach\n${global.config.PREFIX}xidach leave -> rời ván xì dách đang tham gia ở nhóm\n${global.config.PREFIX}xidach start -> bắt đầu ván xì dách mà bạn tạo ở nhóm\nNhập (get) để lấy bài hoặc đổi bài\nNhập (ready) để lật bài`,
        "magic_five": "Ngũ Linh",
        "blackJack": "Xì Dách",
        "double_aces": "Xì Bàng (Bàn)",
        "points": " tuổi",
        "final": "[  KẾT QUẢ XÌ DÁCH  ]\n + Bot: %1",
        "get_or_ready": "[ %1 ]\nTổng số bài úp hiện có là: %2\n%3, hãy chọn get hoặc ready.",
        "out_of_time": "%1, đã qua 20s, bỏ qua.",
        "yourCards": "Bài của bạn: %1",
        "cards_limit": "Bạn đã đủ 5 lá, qua người kế.",
        "points_limit": "Bạn đã đủ hoặc hơn 21 tuổi, qua người kế.",
        "getSuccess": "Tổng số bài úp hiện có là: %1\nThành công! Tiếp tục chọn ready hoặc get!",
        "ready": "Bạn đã chọn dằn bài!",
        "alreadyHave": "Đang có 1 ván xì dách diễn ra ở nhóm này!",
        "openSuccess": `Đã mở thành công! (2/%1)\nĐể tham gia, dùng:\n%2 join + tiền cược`,
        "alreadyJoined": "Bạn đã ở trong phòng rồi",
        "out_of_room": "Đã hết chỗ rồi...",
        "alreadyStarted_1": "Ván đấu đã bắt đầu, không thể tham gia!",
        "joinSuccess": "Đã vào thành công! (%1/%2)",
        "author_left_before_start": "Vì chủ phòng đã rời khi chưa bắt đầu bot nên sẽ tự động kết thúc ván đấu!\nNhững người tham gia sẽ được hoàn lại tiền cược!",
        "outSuccess": "Đã out thành công! (%1/%2)",
        "not_yet_started": "Ván chưa bắt đầu nên bạn sẽ được hoàn tiền!",
        "only_bot_left": "Vì ván xì dách chỉ còn mỗi bot nên sẽ tự động hủy bỏ!",
        "not_author": "Bạn không phải chủ phòng",
        "alreadyStarted_2": "Ván đấu đang diễn ra!",
        "testInbox": "Đang kiểm tra tình trạng inbox người chơi..",
        "checkInbox_noti": "Bot sẽ gửi bài đến từng người, vui lòng check inbox/spam/tin nhắn chờ",
        "cannotInbox": "%1, bot không thể inbox bạn, vui lòng inbox bot trước để mở khóa inbox cho bot\nVì vậy bàn sẽ bị hủy",
        "explaining": "Khi tới lượt của mình, hãy nhắn:\nget (lấy thêm bài, tối đa 3 lần, max 21 điểm)\nready (để dằn bài, không rút nữa)",
        "start_after_5s": "Đang chuẩn bị...",
        "started": "BẮT ĐẦU!"
	}
};

module.exports.cards = {
	31: "3_of_spades.png",
	32: "3_of_clubs.png",
	33: "3_of_diamonds.png",
	34: "3_of_hearts.png",
	41: "4_of_spades.png",
	42: "4_of_clubs.png",
	43: "4_of_diamonds.png",
	44: "4_of_hearts.png",
	51: "5_of_spades.png",
	52: "5_of_clubs.png",
	53: "5_of_diamonds.png",
	54: "5_of_hearts.png",
	61: "6_of_spades.png",
	62: "6_of_clubs.png",
	63: "6_of_diamonds.png",
	64: "6_of_hearts.png",
	71: "7_of_spades.png",
	72: "7_of_clubs.png",
	73: "7_of_diamonds.png",
	74: "7_of_hearts.png",
	81: "8_of_spades.png",
	82: "8_of_clubs.png",
	83: "8_of_diamonds.png",
	84: "8_of_hearts.png",
	91: "9_of_spades.png",
	92: "9_of_clubs.png",
	93: "9_of_diamonds.png",
	94: "9_of_hearts.png",
	101: "10_of_spades.png",
	102: "10_of_clubs.png",
	103: "10_of_diamonds.png",
	104: "10_of_hearts.png",
	111: "jack_of_spades2.png",
	112: "jack_of_clubs2.png",
	113: "jack_of_diamonds2.png",
	114: "jack_of_hearts2.png",
	121: "queen_of_spades2.png",
	122: "queen_of_clubs2.png",
	123: "queen_of_diamonds2.png",
	124: "queen_of_hearts2.png",
	131: "king_of_spades2.png",
	132: "king_of_clubs2.png",
	133: "king_of_diamonds2.png",
	134: "king_of_hearts2.png",
	11: "ace_of_spades.png",
	12: "ace_of_clubs.png",
	13: "ace_of_diamonds.png",
	14: "ace_of_hearts.png",
	21: "2_of_spades.png",
	22: "2_of_clubs.png",
	23: "2_of_diamonds.png",
	24: "2_of_hearts.png",
};

module.exports.onLoad = async () => {
	const fs = require("fs");
	await require('axios').get("https://raw.githubusercontent.com/RFS-ADRENO/mirai-modules/main/version.json").then(res => {
		if (res.data["xidach_x034"] != this.config.version) console.log("");
	})
	let path = __dirname + '/xidach/';
	if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
	await require("axios").get("https://raw.githubusercontent.com/RFS-ADRENO/base64_poker/main/data.json").then(async (res) => {
		for (let e in res.data) {
			if (fs.existsSync(path + e)) continue;
			await fs.writeFileSync(path + e, res.data[e], 'base64');
		}
	});
	if (!global.client.xidach_otm) global.client.xidach_otm = {};
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function countC(array) {
	let total = 0;
	array.forEach(e => {
		let num = 0;
		if (e >= 101) num = 10;
		else num = Math.floor((e / 10) % 10);
		total += num;
	});
	return total;
}

const nextUser = async (api, event, getText, Users, Currencies) => {
	var { threadID } = event;
	if (!global.client.xidach_otm[threadID]) return;
	global.client.xidach_otm[threadID].curUser++;
	if (global.client.xidach_otm[threadID].curUser == global.client.xidach_otm[threadID].data.length - 1) return endS(api, event, getText, Users, Currencies, global.client.xidach_otm[threadID]);
	let curU = global.client.xidach_otm[threadID].curUser;
	let curUserD = global.client.xidach_otm[threadID].data[curU];
	let name = await Users.getNameUser(curUserD.id) || "Player";
	let oldL = curUserD.cards.length;
	api.sendMessage({
		body: getText("get_or_ready", new Date().toLocaleString("en-US", {timeZone: 'Asia/Ho_Chi_Minh'}), global.client.xidach_otm[threadID].cards.length, name),
		mentions: [{
			tag: name,
			id: curUserD.id
		}]
	}, threadID, () => setTimeout(async () => {
		if (!global.client.xidach_otm[threadID]) return;
		let newCurUserD = global.client.xidach_otm[threadID].data[curU];
		if (oldL == newCurUserD.cards.length && !newCurUserD.ready) {
			api.sendMessage({
				body: getText("out_of_time", name),
				mentions: [{
					tag: name,
					id: curUserD.id
				}]
			}, threadID);
			await delay(300);
			return nextUser(api, event, getText, Users, Currencies);
		}
	}, 20000));
};

async function endS(api, event, getText, Users, Currencies, object) {
    const { increaseMoney } = Currencies;
	const { threadID } = event;

	var botCards = object.data[object.players - 1].cards;
	var getBotPoint = countC(botCards);
	var botRank = (getBotPoint < 16) ? 0 : (getBotPoint <= 21) ? 2 : 1;
	if (getBotPoint == 2 && Math.floor((botCards[0] / 10) % 10) == 1) botRank = 5;
	if (getBotPoint == 11 && (botCards[0] >= 111 && Math.floor((botCards[1] / 10) % 10) == 1) || (botCards[1] >= 111 && Math.floor((botCards[0] / 10) % 10) == 1)) botRank = 4;
	let getCardIndex = Math.floor(Math.random() * object.cards.length);
	if (botRank == 0) {
		while (botCards.length < 5 && getBotPoint < 21) {
			object.data[object.players - 1].cards.push(object.cards[getCardIndex]);
			object.cards.splice(getCardIndex, 1);
			botCards = object.data[object.players - 1].cards;
			getBotPoint = countC(botCards);
		}
		if (getBotPoint <= 21) botRank = 2;
		else botRank = 1;
	}
	if (botRank == 2) {
		if (botCards.length == 5) botRank = 3;
		while (getBotPoint < 16) {
			object.data[object.players - 1].cards.push(object.cards[getCardIndex]);
			object.cards.splice(getCardIndex, 1);
			botCards = object.data[object.players - 1].cards;
			getBotPoint = countC(botCards);
		}
		if (getBotPoint < 18) {
			let rand = Math.random();
			if (rand <= 0.2) {
				object.data[object.players - 1].cards.push(object.cards[getCardIndex]);
				object.cards.splice(getCardIndex, 1);
				botCards = object.data[object.players - 1].cards;
				getBotPoint = countC(botCards);
			}
		}
		if (getBotPoint > 21) botRank = 1;
	}
	var msg = getText("final", (botRank == 3) ? getText("magic_five") : (botRank == 4) ? getText("blackJack") : (botRank == 5) ? getText("double_aces") : (getBotPoint + getText("points")));
	var rank = 0, playerPoints = 0;
	var result = "";
	for (let i = 0; i < object.players - 1; i++) {
		let playerD = object.data[i];
		playerPoints = countC(playerD.cards);
		rank = (playerPoints < 16) ? 0 : (playerPoints <= 21) ? 2 : 1;
		if (playerPoints == 2 && Math.floor((playerD.cards[0] / 10) % 10) == 1) rank = 5;
		if (playerPoints == 11 && (playerD.cards[0] >= 111 && Math.floor((playerD.cards[1] / 10) % 10) == 1) || (playerD.cards[1] >= 111 && Math.floor((playerD.cards[0] / 10) % 10) == 1)) rank = 4;
		if (rank == 2 && playerD.cards.length == 5) rank = 3;
		let bonus = (rank == 3) ? object.bonus.superWinBonus : (rank >= 4) ? object.bonus.epicWinBonus : 1;
		result = (botRank > rank) ? `Lose (-${playerD.bet}$)` : `Win (+${playerD.bet + "$ x" + bonus})`;
		if (botRank == rank) {
			result = (playerPoints == getBotPoint || rank >= 4) ? "Draw" : (rank == 1) ? (playerPoints < getBotPoint) ? `Win (+${playerD.bet + "$ x" + bonus})` : `Lose (-${playerD.bet}$)` : (rank == 2) ? (playerPoints > getBotPoint) ? `Win (+${playerD.bet + "$ x" + bonus})` : `Lose (-${playerD.bet}$)` : (rank == 3) ? (playerPoints < getBotPoint) ? `Win (+${playerD.bet + " x" + bonus}$)` : `Lose (-${playerD.bet}$)` : '';
		}
		if (result == "Draw") await increaseMoney(playerD.id, playerD.bet);
		else if (result.slice(0,4) != "Lose") await increaseMoney(playerD.id, playerD.bet*(bonus + 1));
		let name = await Users.getNameUser(playerD.id) || "Player";
		msg += `\n + ${name}: ${(rank == 3) ? getText("magic_five") : (rank == 4) ? getText("blackJack") : (rank == 5) ? getText("double_aces") : (playerPoints + getText("points"))} | ` + result;
	}
	api.sendMessage(msg, threadID, () => delete global.client.xidach_otm[threadID]);
}

module.exports.handleEvent = async function({ event, api, getText, Users, Currencies }) {
	if (event.senderID == api.getCurrentUserID()) return;
	await delay(300);
	const fs = require("fs");
	if (!event.body) return;
	var { threadID, messageID, senderID, body } = event;
	body = body.toLowerCase();
	if (!global.client.xidach_otm) global.client.xidach_otm = {};
	if (!global.client.xidach_otm[threadID]) return;
	const sendC = (msg, callback) => api.sendMessage(msg, threadID, callback, messageID);
	const send = (msg) => sendC(msg, () => {});
	if (threadID in global.client.xidach_otm) {
		if (!"curUser" in global.client.xidach_otm[threadID]) return;
		if (global.client.xidach_otm[threadID].curUser < 0) return;
		let curU = global.client.xidach_otm[threadID].curUser;
		if (global.client.xidach_otm[threadID].data[curU] && global.client.xidach_otm[threadID].data[curU].id != senderID) return;
		if (body == "get") {
			global.client.xidach_otm[threadID].data[curU].cards.push(global.client.xidach_otm[threadID].cards.pop());
			let atms = [];
			global.client.xidach_otm[threadID].data[curU].cards.forEach(c => {
				atms.push(fs.createReadStream(__dirname + `/poker/${this.cards[c]}`));
			});
			api.sendMessage({
				body: getText("yourCards", countC(global.client.xidach_otm[threadID].data[curU].cards)),
				attachment: atms
			}, senderID);
			if (global.client.xidach_otm[threadID].data[curU].cards.length == 5) {
				send(getText("cards_limit"));
				await delay(1000);
				return nextUser(api, event, getText, Users, Currencies);
			}
			if (countC(global.client.xidach_otm[threadID].data[curU].cards) >= 21) {
				send(getText("points_limit"));
				await delay(1000);
				return nextUser(api, event, getText, Users, Currencies);
			}
			send(getText("getSuccess", global.client.xidach_otm[threadID].cards.length));
			let oldL = global.client.xidach_otm[threadID].data[curU].cards.length;
			setTimeout(async () => {
				if (!global.client.xidach_otm[threadID]) return;
				let newCurUserD = global.client.xidach_otm[threadID].data[curU];
				if (oldL == newCurUserD.cards.length && !newCurUserD.ready) {
					let curUserD = global.client.xidach_otm[threadID].data[curU];
					let name = await Users.getNameUser(curUserD.id) || "Player";
					api.sendMessage({
						body: getText("out_of_time", name),
						mentions: [{
							tag: name,
							id: curUserD.id
						}]
					}, threadID);
					await delay(300);
					return nextUser(api, event, getText, Users, Currencies);
				}
			}, 20000);
		}
		if (body == "ready") {
			send(getText("ready"));
			await delay(500);
			global.client.xidach_otm[threadID].data[curU].ready = true;
			return nextUser(api, event, getText, Users, Currencies);
		}
	}
};

module.exports.run = async function({ api, event, args, getText, Users, Currencies }) {
	if (!global.client.xidach_otm) global.client.xidach_otm = {};
    const { getData, increaseMoney, decreaseMoney } = Currencies;
	const { threadID, messageID, senderID } = event;
	const sendC = (msg, callback) => api.sendMessage(msg, threadID, callback, messageID);
	const sendTC = (msg, callback) => api.sendMessage(msg, threadID, callback);
	const sendT = (msg) => sendTC(msg, () => {});
	const send = (msg) => sendC(msg, () => {});
    const moneyUser = (await getData(senderID)).money;
	//getPrefix
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
	//checkValid_maxPlayer
	if (global.configModule[this.config.name].maxPlayers < 2 || global.configModule[this.config.name].maxPlayers > 10) global.configModule[this.config.name].maxPlayers = 5;
	//well, happy new year!
	var moneyBet = 0;
	switch (args[0]) {
		case 'create':
			moneyBet = parseInt(args[1]);
		    if (isNaN(moneyBet) || moneyBet <= 0) return send(getText("missingInput"));
			if (moneyBet > moneyUser) return send(getText("moneyBetNotEnough"));
			if (moneyBet < 50) return send(getText("limitBet"));
			if (threadID in global.client.xidach_otm) send(getText("alreadyHave"));
			else sendTC(getText("openSuccess", global.configModule[this.config.name].maxPlayers, prefix+this.config.name), async () => {
				await decreaseMoney(senderID, moneyBet);
				global.client.xidach_otm[threadID] = {
					players: 2,
					status: "pending",
					data: [
						{
							id: senderID,
							bet: moneyBet,
							cards: [],
							type: "author"
						}
					],
					bonus: global.configModule[this.config.name]
				};
			});
			break;
		case "join":
			if (threadID in global.client.xidach_otm) {
				if (global.client.xidach_otm[threadID].data.find(p => p.id == senderID)) return send(getText("alreadyJoined"));
				if (global.client.xidach_otm[threadID].players == global.configModule[this.config.name].maxPlayers) return send(getText("out_of_room"));
				if (global.configModule[this.config.name].status == "started") return send(getText("alreadyStarted_1"));
				moneyBet = parseInt(args[1]);
			    if (isNaN(moneyBet) || moneyBet <= 0) return send(getText("missingInput"));
				if (moneyBet > moneyUser) return send(getText("moneyBetNotEnough"));
				if (moneyBet < 50) return send(getText("limitBet"));
				sendC(getText("joinSuccess", global.client.xidach_otm[threadID].players + 1, global.configModule[this.config.name].maxPlayers), async () => {
					await decreaseMoney(senderID, moneyBet);
					global.client.xidach_otm[threadID].players++;
					global.client.xidach_otm[threadID].data.push({
						id: senderID,
						bet: moneyBet,
						cards: [],
						type: "player"
					});
				});
			} else sendT(getText("noGame"));
			break;
		case "leave":
			if (threadID in global.client.xidach_otm) {
				if (global.client.xidach_otm[threadID].data.find(p => p.id == senderID).type == "author" && global.client.xidach_otm[threadID].status == "pending") {
					return sendTC(getText("author_left_before_start"), () => {
						global.client.xidach_otm[threadID].data.forEach(async (p) => {
							if (p.id != api.getCurrentUserID()) await increaseMoney(p.id, p.bet);
						});
						delete global.client.xidach_otm[threadID];
					});
				}
				sendC(getText("outSuccess", global.client.xidach_otm[threadID].players - 1, global.configModule[this.config.name].maxPlayers), async () => {
					global.client.xidach_otm[threadID].players -= 1;
					if (global.client.xidach_otm[threadID].status == "pending") sendC(getText("not_yet_started"), async() => {
						global.client.xidach_otm[threadID].data.forEach(async (p, i) => {
							if (p.id == senderID) {
								await increaseMoney(senderID, p.bet);
								global.client.xidach_otm[threadID].splice(i, 1);
							}
						});
					});
					global.client.xidach_otm[threadID].data.splice(global.client.xidach_otm[threadID].players, 1);
					if (global.client.xidach_otm[threadID].players == 1) sendC(getText("only_bot_left"), () => {
						delete global.client.xidach_otm[threadID];
					});
				});
			} else sendT(getText("noGame"));
			break;
		case "start":
			const  fs = require("fs");

			var cardKeys = Object.keys(this.cards);
			for (let i = cardKeys.length - 1; i > 0; i--) {
			  const j = Math.floor(Math.random() * (i + 1));
			  [cardKeys[i], cardKeys[j]] = [cardKeys[j], cardKeys[i]];
			}
			if (threadID in global.client.xidach_otm) {
				if (global.client.xidach_otm[threadID].data.find(p => p.id == senderID) && global.client.xidach_otm[threadID].data.find(p => p.id == senderID).type != "author") return send(getText("not_author"));
				if (global.client.xidach_otm[threadID].status == "started") return send(getText("alreadyStarted_2"));
				global.client.xidach_otm[threadID].status = "started";
				global.client.xidach_otm[threadID].data.push({
					id: api.getCurrentUserID(),
					cards: [],
					type: "BOSS"
				});
				sendTC(getText("testInbox"), async () => {
					for (let i = 0; i < global.client.xidach_otm[threadID].data.length; i++) {
						let p = global.client.xidach_otm[threadID].data[i];
						if (p.id == api.getCurrentUserID()) continue;
						api.sendMessage("testing...", p.id, async (err) => {
							if (err) {
								let curName = await Users.getNameUser(p.id);
								api.sendMessage({
									body: getText("cannotInbox", curName),
									mentions: [{
										tag: curName,
										id: p.id
									}]
								}, threadID);
							}
						});
						await delay(2000);
					}
				});
				sendTC(getText("checkInbox_noti"), async () => {
					for (let i = 0; i < global.client.xidach_otm[threadID].data.length; i++) {
						try {
							let p = global.client.xidach_otm[threadID].data[i];
							let one = cardKeys.shift();
							let two = cardKeys.shift();
							global.client.xidach_otm[threadID].data[i].cards.push(one, two);
							var atms = [];
							atms.push(fs.createReadStream(__dirname + `/xidach/${this.cards[one]}`));
							atms.push(fs.createReadStream(__dirname + `/xidach/${this.cards[two]}`));
							if (p.id == api.getCurrentUserID()) continue;
							api.sendMessage({
								body: 'Bài của bạn: ' + countC(global.client.xidach_otm[threadID].data[i].cards),
								attachment: atms
							}, p.id);
							await delay(300);
						} catch(e) {
							console.log(e);
						}
					}
					sendTC(getText("explaining"), async () => {
						await delay(1000);
						let curU = -1;
						sendT(getText("start_after_5s"));
						await delay(5000);
						sendT(getText("started"));
						await delay(300);
						global.client.xidach_otm[threadID].cards = cardKeys;
						global.client.xidach_otm[threadID].curUser = curU;
						return nextUser(api, event, getText, Users, Currencies);
					});
				});
			} else sendT(getText("noGame"));
			break;
		default:
			sendT(getText("xidachRules"));
	}
};