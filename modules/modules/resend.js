const fs = require('fs-extra');
const path = __dirname + '/data/resend.json';
module.exports ={
	config: {
		name: 'resend',
		commandCategory: 'Nhóm',
		hasPermssion: 1,
		credits: 'Lê Minh Tiến',
		usages: 'resend',
		description: 'Bật tắt resend',
		cooldowns: 5
	}, onLoad() {
	if (!fs.existsSync(path)) fs.writeFileSync(path, '{}');
  },run: async function({ api, event }) {
const { threadID, messageID } = event;
const out = (a, b, c, d) => api.sendMessage(a, b ? b : threadID, c ? c : null, d ? d : messageID);
const abcxyz = JSON.parse(fs.readFileSync(path));
	const s = abcxyz[threadID] = !abcxyz[threadID] ? true : false;
	fs.writeFileSync(path, JSON.stringify(abcxyz, 0, 4));
  out((s ? '✅ Bật' : '✅ Tắt') + ' ' + 'chế độ gửi lại tin nhắn bị gỡ') 
  }, handleEvent: async function({
	event: e,
	api: a,
	client: t,
	Users: s
}) {
const ab = JSON.parse(fs.readFileSync(path));
	if (e.senderID == (global.botID || a.getCurrentUserID())) return;
	if ((!ab[e.threadID])) return;
	const n = global.nodemodule.request,
		o = global.nodemodule.axios,
		{
			writeFileSync: d,
			createReadStream: r
		} = global.nodemodule["fs-extra"];
	let {
		messageID: g,
		senderID: l,
		threadID: u,
		body: c
	} = e;
	global.logMessage || (global.logMessage = new Map), global.data.botID || (global.data.botID = a.getCurrentUserID());
	const i = global.data.threadData.get(u) || {};
	if ((void 0 === i.resend || 0 != i.resend) && l != global.data.botID && ("message_unsend" != e.type && global.logMessage.set(g, {
			msgBody: c,
			attachment: e.attachments
		}), "message_unsend" == e.type)) {
		var m = global.logMessage.get(g);
		if (!m) return;
		let e = await s.getNameUser(l);
		if (null == m.attachment[0]) return a.sendMessage(`${e} vừa gỡ 1 nội dung: ${m.msgBody}`, u); {
			let t = 0,
				s = {
					body: `${e} vừa gỡ ${m.attachment.length} tệp đính kèm.${""!=m.msgBody?`\n\nNội dung: ${m.msgBody}`:""}`,
					attachment: [],
					mentions: {
						tag: e,
						id: l
					}
				};
			for (var f of m.attachment) {
				t += 1;
				var h = (await n.get(f.url)).uri.pathname,
					b = h.substring(h.lastIndexOf(".") + 1),
					p = __dirname + `/cache/${t}.${b}`,
					y = (await o.get(f.url, {
						responseType: "arraybuffer"
					})).data;
				d(p, Buffer.from(y, "utf-8")), s.attachment.push(r(p))
			}
			a.sendMessage(s, u)
    }
		}
	}
}