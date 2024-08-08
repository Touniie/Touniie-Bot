exports.config = {
	name: 'rent',
	version: '2.0.0',
	hasPermssion: 2,
	credits: 'DC-Nam mod by Niiozic',
	description: 'Thuê bot.', 
	commandCategory: 'Admin',
	usages: '[]',
	cooldowns: 3
};

let fs = require('fs');
if (!fs.existsSync(__dirname+'/data'))fs.mkdirSync(__dirname+'/data');
let path = __dirname+'/data/thuebot.json';
let data = [];
let save = ()=>fs.writeFileSync(path, JSON.stringify(data));
if (!fs.existsSync(path))save(); else data = require(path);
let form_mm_dd_yyyy = (input = '', split = input.split('/'))=>`${split[1]}/${split[0]}/${split[2]}`;
let invalid_date = date=>/^Invalid Date$/.test(new Date(date));
exports.run = async function(o) {
	let send = (msg, callback)=>{
		console.log(msg)
		o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
	}
	let prefix = (global.data.threadData.get(o.event.threadID) || {}).PREFIX||global.config.PREFIX;
	let info = data.find($=>$.t_id==o.event.threadID);
	try{
	switch (o.args[0]) {
		case 'add': {
			if (!o.args[1])return send(`❎ Dùng ${prefix}${this.config.name} add + reply tin nhắn người cần thuê`);
			var uid = o.event.senderID;
			 if(o.event.type == "message_reply") {
			uid = o.event.messageReply.senderID 
		}  else if (Object.keys(o.event.mentions).length > 0) {
				uid = Object.keys(o.event.mentions)[0];
		}
			let t_id = o.event.threadID;
			let id = uid;
			let time_start = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
			let time_end = o.args[1];
			if (isNaN(id) || isNaN(t_id))return send(`❎ ID Không Hợp Lệ!`);
			if (invalid_date(form_mm_dd_yyyy(time_end)))return send(`❎ Thời Gian Không Hợp Lệ!`);
			data.push({
				t_id, id, time_start, time_end,
			});
			send(`✅ Set data box vào cơ sở dữ liệu thành công`);
		};
			break;
		case 'info': {
			let threadInfo = await o.api.getThreadInfo(info.t_id);
			 send(`[ Thông Tin Thuê Bot ]\n\n👤 Tên người thuê: ${global.data.userName.get(info.id)}\n🌐 link Facebook: https://www.facebook.com/profile.php?id=${info.id}\n🏘️ Nhóm: ${(global.data.threadInfo.get(info.t_id) || {}).threadName}\n⚡ ID Nhóm: ${info.t_id}\n📆 Ngày Thuê: ${info.time_start}\n⏳ Hết Hạn: ${info.time_end}\n📌 Còn ${(()=> {
			let time_diff = new Date(form_mm_dd_yyyy(info.time_end)).getTime()-(Date.now()+25200000);
			let days = (time_diff/(1000*60*60*24))<<0;
			let hour = (time_diff/(1000*60*60)%24)<<0;
			return `${days} ngày ${hour} giờ là hết hạn.`;
		})()}`, /*attachment: [await streamURL(`
https://graph.facebook.com/${info.id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`), await streamURL(threadInfo.imageSrc)]
	}*/);};
			break;
		case 'del': {
			let t_id = o.event.threadID
			let id = o.event.senderID
			var findData = data.find(item=>item.t_id==t_id)
			if(!findData) return o.api.sendMessage("Box này hiện chưa thuê bot",t_id)
			data = data.filter(item=>item.t_id!==t_id)
			send(`✅ Đã xóa data box thành công`)
			await save()
			};
			break;
		case 'list': {
			try{
				const itemsPerPage = 10;

				const totalPages = Math.ceil(data.length / itemsPerPage);

					const startIndex = (1 - 1) * itemsPerPage;
					const endIndex = startIndex + itemsPerPage;
					const pageData = data.slice(startIndex, endIndex);

					o.api.sendMessage(`[ Danh Sách Thuê Bot ${1}/${totalPages}]\n\n${pageData.map(($, i)=>`${i+1}. ${global.data.userName.get($.id)}\n📝 Tình trạng: ${new Date(form_mm_dd_yyyy($.time_end)).getTime() >= Date.now()+25200000?'Chưa Hết Hạn ✅': 'Đã Hết Hạn ❎'}\n🌾 Nhóm: ${(global.data.threadInfo.get($.t_id) || {}).threadName}\nTừ: ${$.time_start}\nĐến: ${$.time_end}`).join('\n\n')}\n\n→ Reply (phản hồi) theo stt để xem chi tiết\n→ Reply del + stt để xóa khỏi danh sách\n→ Reply out + stt để thoát nhóm (cách nhau để chọn nhiều số)\n→ Reply giahan + stt để gia hạn\nVí dụ: 12/12/2023 => 1/1/2024\n→ Reply page + stt để xem các nhóm khác\nVí dụ: page 2`,o.event.threadID, (err, info)=>{
						global.client.handleReply.push({
							name: this.config.name,
							event: o.event,
							data,
							num: endIndex,
							messageID: info.messageID,
							author: o.event.senderID
						})
					});

			}catch(e){
				console.log(e)
			}
		};
			break;
		default: send(`Dùng: ${prefix}${this.config.name} list -> Để xem danh sách thuê bot\nDùng: ${prefix}${this.config.name} add + reply tin nhắn người cần thuê -> Để thêm nhóm vào danh sách thuê bot\nVí dụ: ${prefix}${this.config.name} add 12/12/2023`)
			break;
	}
}catch(e){
	console.log(e)
}
	save();
};
exports.handleReply = async function(o) {
	try{
	let _ = o.handleReply;
	let send = (msg, callback)=>o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
	if (o.event.senderID != _.event.senderID)return;
	if (isFinite(o.event.args[0])) {
		let info = data[o.event.args[0]-1];
let threadInfo = await o.api.getThreadInfo(info.t_id);
		if (!info)return send(`STT không tồn tại!`);
		return send({body:`[ Thông Tin Thuê Bot ]\n\n👤 Tên người thuê: ${global.data.userName.get(info.id)}\n🌐 link Facebook: https://www.facebook.com/profile.php?id=${info.id}\n🏘️ Nhóm: ${(global.data.threadInfo.get(info.t_id) || {}).threadName}\n⚡ ID Nhóm: ${info.t_id}\n📆 Ngày Thuê: ${info.time_start}\n⏳ Hết Hạn: ${info.time_end}\n📌 Còn ${(()=> {
			let time_diff = new Date(form_mm_dd_yyyy(info.time_end)).getTime()-(Date.now()+25200000);
			let days = (time_diff/(1000*60*60*24))<<0;
			let hour = (time_diff/(1000*60*60)%24)<<0;
			return `${days} ngày ${hour} giờ là hết hạn.`;
		})()}`,attachment: [await streamURL(`
https://graph.facebook.com/${info.id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`), await streamURL(threadInfo.imageSrc)]
	});
	} else if (o.event.args[0].toLowerCase() == 'del') {
		o.event.args.shift();
		for (const i of o.event.args) {
			if (isNaN(i)) return send(`STT ${i} không hợp lệ!`);
			if (i > data.length) return send(`STT ${i} không tồn tại!`);
			//console.log(datadata)
			data.splice(i - 1, 1);
			console.log(data)
		}
		send(`✅ Đã xóa thành công!`);
	} else if (o.event.args[0].toLowerCase() == 'giahan') {
		let STT = o.event.args[1];
		let time_start = o.event.args[2];
		let time_end = o.event.args[4];  
		if (invalid_date(form_mm_dd_yyyy(time_start)) || invalid_date(form_mm_dd_yyyy(time_end)))return send(`❎ Thời Gian Không Hợp Lệ!`);    
		if (!data[STT-1])return send(`STT không tồn tại`);   
		let $ = data[STT-1];   
		$.time_start = time_start;
		$.time_end = time_end;
		send(`✅ Đã gia hạn nhóm thành công!`);
	} else if (o.event.args[0].toLowerCase() == 'out') {
		for (let i of o.event.args.slice(1)) await o.api.removeUserFromGroup(o.api.getCurrentUserID(), data[i-1].t_id);   
		send(`Đã out nhóm theo yêu cầu`);
	} else if(o.event.args[0].toLowerCase() == 'page') {
		try{
			console.log(o.event.args[1])
		const itemsPerPage = _.num;
		const totalPages = Math.ceil(data.length / itemsPerPage);
		const pageNumber = o.event.args[1];

		const startIndex = (pageNumber - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		const pageData = data.slice(startIndex, endIndex);
			o.api.sendMessage(`[ Danh Sách Thuê Bot ${pageNumber}/${totalPages}]\n\n${pageData.map(($, i)=>{
				const listItemNumber = startIndex + i + 1;
				return `${listItemNumber}. ${global.data.userName.get($.id) || ""}\n📝 Tình trạng: ${new Date(form_mm_dd_yyyy($.time_end)).getTime() >= Date.now()+25200000?'Chưa Hết Hạn ✅': 'Đã Hết Hạn ❎'}\n🌾 Nhóm: ${(global.data.threadInfo.get($.t_id) || {}).threadName || ""}\nTừ: ${$.time_start}\nĐến: ${$.time_end}`
			}).join('\n\n')}\n\n→ Reply (phản hồi) theo stt để xem chi tiết\n→ Reply del + stt để xóa khỏi danh sách\n→ Reply out + stt để thoát nhóm (cách nhau để chọn nhiều số)\n→ Reply giahan + stt để gia hạn\nVí dụ: 12/12/2023 => 1/1/2024\n→ Reply page + stt để xem các nhóm khác\nVí dụ: page 2`,o.event.threadID, (err, info)=>{
				if(err) return console.log(err)
				global.client.handleReply.push({
					name: this.config.name,
					event: o.event,
					data,
					num: endIndex,
					messageID: info.messageID,
					author: o.event.senderID
				})
			});
	}catch(e){
		console.log(e)
	}
	}
	save();
}catch(e) {
	console.log(e)
}
};
async function streamURL(url, mime = 'jpg') {
				const dest = `${__dirname}/data/${Date.now()}.${mime}`,
						downloader = require('image-downloader'),
						fse = require('fs-extra');
				await downloader.image({
						url, dest
				});
				setTimeout(j => fse.unlinkSync(j), 60 * 1000, dest);
				return fse.createReadStream(dest);
		};