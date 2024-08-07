function FF(t1, t2) {
    for (var i in newArr) {
      msg += `${i < 4 ? ICON(i) : parseInt(i) + "."} ${newArr[i].n}\n » ${t1}: ${t2 == "m" ? CC(newArr[i][t2]) : LV(newArr[i][t2])}\n`
      if ((i == parseInt(g[1]) - 1 && i < newArr.length) || i == 9) break
    }
  }
  async function FOD(k, m) {
    for (const id of pI) {
      let mU = (await C.getData(id))[k] || 0
      let nU = (await U.getData(id)).name || ""
      array.push({
        i: id,
        n: nU,
        [m]: mU
      })
    }
  }
  function FO(k) {
    for (var i in array) {
      newArr.push({
        i: parseInt(i) + 1,
        id: array[i].i,
        n: array[i].n,
        [k]: array[i][k]
      })
    }
  }
  function FI(k, i, x) {
    let find = newArr.find(i => i.id == s)
    msg += TX(find[i], k, find[x])
  }
function CC(n) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 2
  })
}
function VC(k) {
  return function(a, b) {
    let i = 0;
    if (a[k] > b[k]) {
      i = 1
    } else if (a[k] < b[k]) {
      i = -1
    }
    return i * -1
  }
}
function LV(x) {
  return Math.floor((Math.sqrt(1 + (4 * x) / 3) + 1) / 2)
}
module.exports.config = {
	name: "top",
	version: "1.0.5",
	hasPermssion: 0,
	credits: "JRT mod by Niiozic",
	description: "Xem các cấp độ của người dùng",
	commandCategory: "Thống kê",
	usages: "[thread/user/money/level]",
	cooldowns: 5
};
exports.handleReply = async o=>{
    let {
        args,
    threadID: t,
    messageID: m,
    senderID: s,
    participantIDs: p
    } = o.event;
    let send = (msg, cb)=>o.api.sendMessage(msg, t, cb, m);
    let currencies = await o.Currencies.getAll();
    
    switch (args[0]) {
         case '1': send(`NHỮNG NGƯỜI GIÀU NHẤT BOX\n\n${currencies.filter($=>p.includes($.userID+'')).sort((a,b)=>BigInt(a.money)<BigInt(b.money)?0:-1).slice(0,15).map(($,i)=>`${i+1}. ${global.data.userName.get($.userID+'')}\n🎫 ${$.money.toLocaleString()}$`).join('\n')}\n\n⚠️ Nghiêm cấm buôn bán coin phát hiện ban vĩnh viễn, phát hiện báo admin sẽ được thưởng`);
         break;
         case '2': send((`NHỮNG NGƯỜI GIÀU NHẤT SEVER\n\n${currencies.sort((a,b)=>BigInt(a.money)<BigInt(b.money)?0:-1).slice(0,15).map(($,i)=>`${i+1}. ${global.data.userName.get($.userID+'')}\n🎫 ${$.money.toLocaleString()}$`).join('\n')}\n\n⚠️ Nghiêm cấm buôn bán coin phát hiện ban vĩnh viễn, phát hiện báo admin sẽ được thưởng`));
         break;
         default:
         break;
    };
};
module.exports.run = async ({ event, api, args, Currencies, Users}) => {
   var {
    threadID: t,
    messageID: m,
    senderID: s,
    participantIDs: pI
  } = event, array = [], newArr = [], msg = ""
  const allType = ["money", "level"]
  const moment = require("moment-timezone");
    var timeNow = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss")
   if (args.length == 0) return api.sendMessage(`[ Bạn có thể dùng ]\n\n${global.config.PREFIX}top money -> xem 15 người giàu nhất\n${global.config.PREFIX}top thread -> 15 nhóm lắm mồm nhất\n${global.config.PREFIX}top user -> những người nói nhiều nhất\n${global.config.PREFIX}top level -> Top 15 người dùng có level cao nhất sever\n=====「${timeNow}」=====`, event.threadID, event.messageID);
var arr = [];
    var mention = Object.keys(event.mentions);
	//if (args[1] && isNaN(args[1]) || parseInt(args[1]) <= 0) return api.sendMessage("Thông tin độ dài list phải là một con số và không dưới 0", event.threadID, event.messageID);
	var option = parseInt(args[1] || 10);
	var data, msg = "";
	var fs = require("fs-extra");
	var request = require("request");  // Covernt exp to level
    function expToLevel(point) {
	if (point < 0) return 0;
	return Math.floor((Math.sqrt(1 + (4 * point) / 3) + 1) / 2);
    }
    //level	
		if (args[0] == "level") { 
    let all = await Currencies.getAll(['userID', 'exp']);
				all.sort((a, b) => b.exp - a.exp);
				let num = 0;
	             let msg = {
					body: 'Top 15 người dùng có level cao nhất sever',					
				}
				for (var i = 0; i < 15; i++) {		       	//thay vào số line cần check		 
					let level = expToLevel(all[i].exp);
					var _0xce87=["\x6E\x61\x6D\x65","\x75\x73\x65\x72\x49\x44","\x67\x65\x74\x44\x61\x74\x61"];var name=( await Users[_0xce87[2]](all[i][_0xce87[1]]))[_0xce87[0]]    
  
					num += 1;
					msg.body += '\n' + num + '. ' + name + ' - cấp ' + level;}
					 console.log(msg.body)
                    api.sendMessage(msg, event.threadID, event.messageID)
		}
	if (args[0] == "thread") {
		var threadList = [];	
		try {
        	data = await api.getThreadList(option + 10, null, ["INBOX"]);
		}
		catch (e) {
			console.log(e);
		}
		for (const thread of data) {
			if (thread.isGroup == true) threadList.push({ threadName: thread.name, threadID: thread.threadID, messageCount: thread.messageCount });
		}		
		threadList.sort((a, b) => {
			if (a.messageCount > b.messageCount) return -1;
            if (a.messageCount < b.messageCount) return 1;
		})
		var i = 0;
		for(const dataThread of threadList) {
			if (i == option) break;
			msg += `${i+1}. ${(dataThread.threadName)||"Không tên"}\nTID: [${dataThread.threadID}]\nSố tin nhắn: ${dataThread.messageCount} tin nhắn\n\n`;
			i+=1;
		}
		return api.sendMessage(`Dưới đây là top ${threadList.length} các nhóm lắm mồm nhất quả đất\n${msg}`, threadID, messageID);
	}
	
if (args[0] == "money") {
  let send = (msg, cb)=>api.sendMessage(msg, t, cb, m);

return send(`[ Check Top Money Bot ]\n\n1. Top money trong box\n2. Top money toàn sever\n\nReply (phản hồi) theo stt để xem top money`,
(err, res)=>(res.name = exports.config.name, global.client.handleReply.push(res)));

};
	   if (args[0] == "user") {
		var data, msg = "", i = 0; là 
		try {
			data = await Currencies.getAll(["userID","exp"]);
		}
		catch (e) {
			console.log(e);
		}
		data.sort((a, b) => {
			if (a.exp > b.exp) return -1;
            if (a.exp < b.exp) return 1;
		})
		if (data.length < option) option = data.length;
		const idBot = api.getCurrentUserID();
		data = data.filter(item => item.userID != idBot);
		for(const dataUser of data) {
			if (i == option) break;
			var name=( await Users['getData'](all[i]['userID']))['name']
			msg += `${i + 1}. ${nameUser} với ${dataUser.exp} tin nhắn\n`;
			i+=1;
		}
		return api.sendMessage(`Dưới đây là top ${option} các người dùng lắm mồm nhất quả đất\n\n${msg}`, threadID, messageID);
	}

}