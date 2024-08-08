module .exports .config = {
	name: "duyettv",
	version: "1.0.0",
	hasPermssion: 1,
	credits: "Thiệu Trung Kiên",
	description: "Duyệt thành viên trong danh sách phê duyệt",
	commandCategory: "Nhóm",
	usages: "",
	cooldowns: 0
};

module.exports .run = async function ({
	args: e,
	event: a,
	api: s,
	Users: n,
	Threads: r
}) {
	var {
		userInfo: t,
		adminIDs: o
	} = await s.getThreadInfo(a.threadID);
	if (o = o.map((e => e.id)).some((e => e == s.getCurrentUserID()))) {
		const e = await s.getThreadInfo(a.threadID);
		let r = e.approvalQueue.length;
		if (r == 0)
			return s.sendMessage("❎ Hiện tại không có thành viên nào trong danh sách phê duyệt!", a.threadID, a.messageID)
		var u = "";
		for (let a = 0; a < r; a++) {
			u += `${a + 1}. ${await n.getNameUser(e.approvalQueue[a].requesterID)}\n📝 UID:${e.approvalQueue[a].requesterID}\n\n`
		}
		u += "📌 Reply (phản hồi) tin nhắn này kèm stt để duyệt", s.sendMessage(`📝 Danh sách chờ phê duyệt:\n\n${u}`, a.threadID, ((e, s) => global.client.handleReply.push({
			name: this.config.name,
			author: a.senderID,
			messageID: s.messageID,
			type: "reply"
		})))
	} else s.sendMessage("⚠️ Cần quyền quản trị viên! Vui lòng thử lại", a.threadID)
};

module.exports.handleReply = async function ({
	api: e,
	args: a,
	Users: s,
	handleReply: n,
	event: r,
	Threads: t
}) {
	const {
		threadID: o,
		messageID: u
	} = r;
	const threadInfo = await e.getThreadInfo(r.threadID);
	if (!threadInfo.adminIDs.some(u => u.id == r.senderID))
		return e.sendMessage("❎ Chỉ quản trị viên mới có thể duyệt thành viên!", o, u);
	if ("reply" === n.type) {
		const numbers = (r.body || "").split(" ").filter(i => !isNaN(i) && i > 0 && i <= threadInfo.approvalQueue.length);
		if (numbers.length == 0)
			return e.sendMessage("❎ Vui lòng chọn một con số có trong danh sách!", o, u);
		e.unsendMessage(n.messageID);
		const success = [];
		const failed = [];

		for (const num of numbers) {
			const a = threadInfo.approvalQueue[parseInt(num) - 1].requesterID;
			const targetName = await s.getNameUser(a);
			try {
				await e.addUserToGroup(a, o);
				success.push(targetName);
			}
			catch (err) {
				if (!failed.some(e => e.type == e.errorDescription))
					failed.push({
						type: err.errorDescription,
						users: [targetName]
					});
				else
					failed.find(e => e.type == err.errorDescription).users.push(targetName);
			}
		}

		let msg = "";
		if (success.length > 0)
			msg += `✅ Đã duyệt thành viên:\n👤${success.join("\n 👤 ")}\n\n`;
		if (failed.length > 0)
			for (const e of failed)
				msg += `⚠️ Không thể duyệt thành viên:\n👤${e.users.join("\n 👤 ")}\nLý do: ${e.type}\n\n`;
		e.sendMessage(msg, o, u);
	}
};