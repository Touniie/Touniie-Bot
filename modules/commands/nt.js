this.config = {
		name: 'nt',
		version: '1.0.0',
		hasPermssion: 1,
		credits: 'Quất',
		description: 'gửi tin nhắn',
		commandCategory: 'Admin',
		cooldowns: 0
}

this.run = async _ => {
		let { type, messageReply, mentions, senderID, threadID: tid, messageID: mid, participantIDs: pi } = _.event, { args: a } = _, { sendMessage: msg, getThreadInfo: gti } = _.api, { getNameUser: gn } = _.Users, { increaseMoney: ic, getData: gtd } = _.Currencies, mn = (await gtd(senderID)).money, __ = 1000000,
				tg = type == 'message_reply' ? messageReply.senderID : Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : senderID, $ = a[a.length - 1], $$ = a[a.length - 2], a0 = a[0], tif = await gti(tid).participantIDs;
		tn = o => gti(tid).threadName, nm = o => gn(o), all = `✅ Đã gửi tin nhắn đến `, { log: l } = console
		send = o => msg(o, tg), SEND = o => msg(o, $), s = o => msg(o, tid, mid), io = a.slice(1).join(' '), io2 = io.replace($, ''), ndfb = 'Người dùng facebook', $_ = 'Bạn không đủ 100000$ để send tin nhắn', ok = '\nĐã trừ 1000000$ của bản thân',
				i = u => require('axios').get(u, { responseType: 'stream' }).then(r => r.data)
		try {
				if (a.join(' ') == 'help') { return s({ attachment: await i('https://i.imgur.com/WtDqYrB.jpeg') }) }
				if (a0 != 'id' && a0 != 'imgid' && a0 != 'img' && a0 != 'user' && a0 != 'box' && a0 != 'userimg' && a0 != 'boximg' && a0 != 'help') { s(all + await nm(tg)); send(a.join(' ')) }
				switch (a0) {
						case 'id': { s(all + (await nm($) == ndfb ? await tn($) : await nm($))); SEND(io2); break }
						case 'imgid': { s(all + (await nm($) == ndfb ? await tn($) : await nm($))); SEND({ body: io2.replace($$, ''), attachment: await i($$) }); break }
						case 'img': { s(all + await nm(tg)); send({ body: io2, attachment: await i($) }); break }
						case 'user': { if (mn < __) { return s($_) }; await ic(senderID, -__); let u = [], ul = tif.length; for (let i = 0; i < ul; i++) { let ud = tif[i]; try { await msg(io, ud); u.push(ud) } catch (e) { l('') } }; s('✅ Số người gửi thành công: ' + u.length + `\n❎ Số người gửi thất bại: ${ul - u.length}` + ok); break }
						case 'box': { if (mn < __) { return s($_) }; await ic(senderID, -__); let b = [], allt = global.data.allThreadID, al = allt.length; for (let i = 0; i < al; i++) { let ud = allt[i]; try { await msg(io, ud); b.push(ud) } catch (e) { l('') } }; s('✅ Số nhóm gửi thành công: ' + b.length + `\n❎ Số nhóm gửi thất bại: ${al - b.length}` + ok); break }
						case 'userimg': { if (mn < __) { return s($_) }; await ic(senderID, -__); let u = [], ul = tif.length; for (let z = 0; z < ul; z++) { let ud = tif[z]; try { await msg({ body: io2, attachment: await i($) }, ud); u.push(ud) } catch (e) { l('') } }; s('✅ Số người gửi thành công: ' + u.length + `\n❎ Số người gửi thất bại: ${ul - u.length}` + ok); break }
						case 'boximg': { if (mn < __) { return s($_) }; await ic(senderID, -__); let b = [], allt = global.data.allThreadID, al = allt.length; for (let d = 0; d < al; d++) { let ud = allt[d]; try { await msg({ body: io2, attachment: await i($) }, ud); b.push(ud) } catch (e) { l('') } }; s('✅ Số nhóm gửi thành công: ' + b.length + `\n❎ Số nhóm gửi thất bại: ${al - b.length}` + ok); break }
				}
		} catch (e) { return s(`⚠️ Vui lòng dùng ${global.config.PREFIX}send help để biết cách dùng`) }
}