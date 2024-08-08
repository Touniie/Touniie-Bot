exports.config = {
    name: 'taixiu',
    version: '2.0.0',
    hasPermssion: 0,
    credits: 'DC-Nam',
    description: 'tài xỉu',
    commandCategory: 'Game',
    usages: '\nDùng -taixiu create để tạo bàn\n> Để tham gia cược hãy chat: tài/xỉu + [số_tiền/allin/%/k/m/b/kb/mb/gb/g]\n> Xem thông tin bàn chat: info\n> Để rời bàn hãy chat: rời\n> bắt đầu xổ chat: xổ\nCông thức:\nĐơn vị sau là số 0\nk 12\nm 15\nb 18\nkb 21\nmb 24\ngb 27\ng 36',
    cooldowns: 3,
};
let path = __dirname + '/data/status-hack.json';
let data = {};
let save = d => require('fs').writeFileSync(path, JSON.stringify(data));

if (require('fs').existsSync(path)) data = JSON.parse(require('fs').readFileSync(path)); else save();

let d = global.data_command_ban_tai_xiu;

if (!d) d = global.data_command_ban_tai_xiu = {};
if (!d.s) d.s = {};
if (!d.t) d.t = setInterval(() => Object.entries(d.s).map($ => $[1] <= Date.now() ? delete d.s[$[0]] : ''), 1000);

let rate = 1;
let bet_money_min = 50;
let diing_s = 10;
let select_values = {
    't': 'tài',
    'x': 'xỉu',
};
let units = {
    'b': 18,
    'kb': 21,
    'mb': 24,
    'gb': 27,
    'k': 12,
    'm': 15,
    'g': 36,
};
let dice_photos = [
    /*"https://i.imgur.com/xtdfYkP.jpg",
    "https://i.imgur.com/UwcX6bB.jpg",
    "https://i.imgur.com/WdHxoVb.jpg",
    "https://i.imgur.com/aOQJ4uT.jpg",
    "https://i.imgur.com/iAARfLh.jpg",
    "https://i.imgur.com/vCncmlu.jpg"*/
    "https://i.imgur.com/Q3QfE4t.jpeg",
    "https://i.imgur.com/M3juJEW.jpeg",
    "https://i.imgur.com/Tn6tZeG.jpeg",
    "https://i.imgur.com/ZhOA9Ie.jpeg",
    "https://i.imgur.com/eQMdRmd.jpeg",
    "https://i.imgur.com/2GHAR0f.jpeg"
];
let dice_stream_photo = {};
let stream_url = url => require('axios').get(url, {
    responseType: 'stream',
}).then(res => res.data).catch(e => null);
let dices_sum_min_max = (sMin, sMax) => {
    while (true) {
        let i = [0,
            0,
            0].map($ => Math.random() * 6 + 1 << 0);
        let s = i[0] + i[1] + i[2];

        if (s >= sMin && s <= sMax) return i;
    };
};
let admin_tx = [`${global.config.ADMINBOT[0]}`];
let id_box = global.config.BOXNOTI

exports.run = o => {
    let {
        args,
        senderID: sid,
        threadID: tid,
        messageID: mid,
    } = o.event;
    let send = (msg, mid) => o.api.sendMessage(msg, tid, mid, typeof mid == 'function' ? mid : undefined, mid == null ? undefined : messageID);
    let p = (d[tid] || {}).players;

    if (/^hack$/.test(o.args[0]) && admin_tx.includes(sid)) return o.api.getThreadList(100, null, ['INBOX'], (err, res) => (thread_list = res.filter($ => $.isSubscribed && $.isGroup), send(`${thread_list.map(($, i) => `${i + 1}. ${data[$.threadID] == true ? 'on' : 'off'} - ${$.name}`).join('\n')}\n\n-> Reply (phản hồi) theo stt để on/off`, (err, res) => (res.name = exports.config.name, res.type = 'status.hack', res.o = o, res.thread_list = thread_list, global.client.handleReply.push(res)))));
    if (/^(create|c|-c)$/.test(o.args[0])) {
        if (tid in d) return send('❎ Nhóm đã tạo bàn tài xỉu rồi!');
        if (sid in d.s) return (x => send(`❎ Vui lòng quay lại sau ${x / 1000 / 60 << 0}p${x / 1000 % 60 << 0}s mỗi người chỉ được tạo 5p một lần`))(d.s[sid] - Date.now());

        d.s[sid] = Date.now() + (1000 * 60 * 5);
        d[tid] = {
            author: sid,
            players: [],
            set_timeout: setTimeout(() => (delete d[tid], send('⛔ Đã trôi qua 5p không có ai xổ, tiến hành hủy bàn', null)), 1000 * 60 * 5),
        };
        send('✅ Tạo bàn tài xỉu thành công\n📌 Ghi tài/xỉu + số tiền để cược');
    } else if (/^end$/.test(o.args[0])) {
        if (!p) return send(`❎ Nhóm chưa tạo bàn tài xỉu để tạo hãy dùng lệnh: ${args[0]} create`);
        if (global.data.threadInfo.get(tid).adminIDs.some($ => $.id == sid)) return send(`📌 QTV đã yêu cầu kết thúc bàn tài xỉu những người đặt cược sau đây thả cảm xúc để xác nhận.\n\n${p.map(($, i) => `${i + 1}. ${global.data.userName.get($.id)}`).join('\n')}\n\nTổng cảm xúc đạt ${Math.ceil(p.length * 50 / 100)}/${p.length} người bàn tài xỉu sẽ kết thúc.`, (err, res) => (res.name = exports.config.name, res.p = p, res.r = 0, global.client.handleReaction.push(res)));

    } else send(exports.config.usages.replace(/{cmd}/g, args[0]));
};
exports.handleEvent = async o => {
    let {
        args = [],
        senderID: sid,
        threadID: tid,
        messageID: mid,
    } = o.event;
    let send = (msg, mid, t) => new Promise(r => o.api.sendMessage(msg, t || tid, (...params) => r(params), mid == null ? undefined : typeof mid == 'string' ? mid : messageID));
    let select = (t => /^(tài|tai|t)$/.test(t) ? 't' : /^(xỉu|xiu|x)$/.test(t) ? 'x' : /^(rời|leave)$/.test(t) ? 'l' : /^info$/.test(t) ? 'i' : /^xổ$/.test(t) ? 'o' : /^(end|remove|xóa)$/.test(t) ? 'r' : null)((args[0] || '').toLowerCase());
    let money = async id => (await o.Currencies.getData(id))?.money;
    let bet_money = args[1];
    let p;

    if (tid in d == false || args.length == 0 || select == null) return; else p = d[tid].players;
    if (d[tid]?.playing == true) return send('❎ Bàn đang xổ không thể thực hiện hành động');
    if (['t', 'x'].includes(select)) {
        if (/^(allin|all)$/.test(bet_money)) bet_money = BigInt(await money(sid)); else if (/^[0-9]+%$/.test(bet_money)) bet_money = BigInt((await money(sid)) + '') * BigInt(bet_money.match(/^[0-9]+/)[0] + '') / BigInt('100'); else if (unit = Object.entries(units).find($ => RegExp(`^[0-9]+${$[0]}$`).test(bet_money))) bet_money = BigInt(bet_money.replace(unit[0], '0'.repeat(unit[1]))); else bet_money = !isNaN(bet_money) ? BigInt(bet_money) : false;
        if(!bet_money) return send("❎ Số tiền phải là 1 số or allin/all")
        if (isNaN(bet_money.toString())) return send('❎ Tiền cược không hợp lệ');
        if (bet_money < BigInt(bet_money_min)) return send(`❎ Vui lòng đặt ít nhất ${BigInt(bet_money_min).toLocaleString()}$`);
        if (bet_money > BigInt(await money(sid))) return send('❎ Bạn không đủ tiền');
        if (player = p.find($ => $.id == sid)) return (send(`✅ Đã thay đổi cược từ ${select_values[player.select]} ${player.bet_money.toLocaleString()}$ sang ${select_values[select]} ${bet_money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}$`), player.select = select, player.bet_money = bet_money); else return (p.push({
            id: sid,
            select,
            bet_money,
        }), send(`✅ Bạn đã cược ${select_values[select]} với số tiền ${bet_money.toLocaleString()}$`));
    };
    if (select == 'l') {
        if (sid == d[tid].author) return (clearTimeout(d[tid].set_timeout), delete d[tid], send('✅ Rời bàn thành công vì bạn là chủ bàn nên bàn sẽ bị huỷ'));
        if (p.some($ => $.id == sid)) return (p.splice(p.findIndex($ => $.id == sid), 1)[0], send('✅ Rời bàn thành công')); else return send('❎ Bạn không có trong bàn tài xỉu');
    };
    if (select == 'i') return send(`🎰 Tỉ lệ ăn 1:${rate}\n👤 Tổng ${p.length} người tham gia gồm:\n${p.map(($, i) => ` ${i + 1}. ${global.data.userName.get($.id)} cược ${$.bet_money.toLocaleString()}$ vào (${select_values[$.select]})\n`).join('\n')}\n📌 Chủ bàn: ${global.data.userName.get(d[tid].author)}`);
    if (select == 'o') {
        if (sid != d[tid].author) return send('❎ Bạn không phải chủ bàn nên không thể bắt đầu xổ');
        if (p.length == 0) return send('❎ Chưa có ai tham gia đạt cược nên không thể bắt đầu xổ');
        d[tid].playing = true;
        let diing = await send(`🎲 Đang lắc...`);/*[${diing_s}s]*/
        let dices = ([0, 0, 0]).map(() => Math.random() * 6 + 1 << 0);
        let sum = dices.reduce((s, $) => (s += $, s), 0);
        let winner = sum > 10 ? 't' : 'x';
        let winner_players = p.filter($ => $.select == winner);
        let lose_players = p.filter($ => $.select != winner);

        if (data[tid] == true) for (let id of admin_tx) await send(`🎲 Xúc xắc: ${dices.join('.')} - ${sum} điểm (${select_values[winner]})\n🎰 Tỉ lệ ăn 1:${rate}\n🏆 Tổng Kết:\n👑 Những người thắng:\n${winner_players.map(($, i) => (crease_money = $.bet_money * BigInt(String(rate)), `${i + 1}. ${global.data.userName.get($.id)} chọn (${select_values[$.select]})\n⬆️ ${crease_money.toLocaleString()}$`)).join('\n')}\n\n💸 Những người thua:\n${lose_players.map(($, i) => (`${i + 1}. ${global.data.userName.get($.id)} chọn (${select_values[$.select]})\n⬇️ ${$.bet_money.toLocaleString()}$`)).join('\n')}\n\n👤 Chủ bàn: ${global.data.userName.get(d[tid].author)}\n🏘️ Nhóm: ${global.data.threadInfo.get(tid).threadName}`, null, id).then(([err, res]) => (setTimeout(() => send('Đã xổ ☑️', res.messageID, id), 1000 * diing_s), res.name = exports.config.name, res.type = 'change.result.dices', res.o = o, res.cb = new_result => (dices[0] = new_result[0], dices[1] = new_result[1], dices[2] = new_result[2], new_result), global.client.handleReply.push(res)));

        await new Promise(r => setTimeout(r, 1000 * diing_s)).then(() => o.api.unsendMessage(diing[1].messageID));
        sum = dices.reduce((s, $) => (s += $, s), 0);
        winner = sum > 10 ? 't' : 'x';
        winner_players = p.filter($ => $.select == winner);
        lose_players = p.filter($ => $.select != winner);
        await Promise.all(dice_photos.map(stream_url)).then(ress => ress.map(($, i) => dice_stream_photo[i + 1] = $));
        await send({ body: `Xúc xắc: ${dices.join('|')} - ${sum} điểm (${select_values[winner]})\nNhững người thắng:\n${winner_players.map(($, i) => (crease_money = $.bet_money * BigInt(String(rate)), o.Currencies.increaseMoney($.id, crease_money.toString()), `${i + 1}. ${global.data.userName.get($.id)} chọn (${select_values[$.select]})\n+${crease_money.toLocaleString()}$`)).join('\n')}\n\nNhững người thua:\n${lose_players.map(($, i) => (o.Currencies.decreaseMoney($.id, $.bet_money.toString()), `${i + 1}. ${global.data.userName.get($.id)} chọn (${select_values[$.select]})\n-${$.bet_money.toLocaleString()}$`)).join('\n')}\n\nChủ bàn: ${global.data.userName.get(d[tid].author)}`, attachment: dices.map($ => dice_stream_photo[$]), });
        clearTimeout(d[tid].set_timeout);
        delete d[tid];
    };
    if (select == 'r') {
        if (global.data.threadInfo.get(tid).adminIDs.some($ => $.id == sid)) return send(`QTV đã yêu cầu kết thúc bàn tài xỉu những người đặt cược sau đây thả cảm xúc để xác nhận.\n\n${p.map(($, i) => `${i + 1}. ${global.data.userName.get($.id)}`).join('\n')}\n\nTổng cảm xúc đạt ${Math.ceil(p.length * 50 / 100)}/${p.length} người bàn tài xỉu sẽ kết thúc.`).then(([err, res]) => (res.name = exports.config.name, res.p = p, res.r = 0, global.client.handleReaction.push(res)));
    }
};
exports.handleReply = async o => {
    let _ = o.handleReply;
    let {
        args,
        senderID: sid,
        threadID: tid,
        messageID: mid,
    } = o.event;
    let send = (msg, mid) => new Promise(r => o.api.sendMessage(msg, tid, r, mid == null ? undefined : messageID));

    //if (sid != _.o.event.senderID)return;
    if (sid == o.api.getCurrentUserID()) return;

    if (_.type == 'status.hack' && admin_tx.includes(sid)) return (send(`${args.filter($ => isFinite($) && !!_.thread_list[$ - 1]).map($ => ($$ = _.thread_list[$ - 1], s = data[$$.threadID] = !data[$$.threadID] ? true : false, `${$}. ${$$.name} - ${s ? 'on' : 'off'}`)).join('\n')}`).catch(() => { }), save());
    if (_.type == 'change.result.dices') {
        if (args.length == 3 && args.every($ => isFinite($) && $ > 0 && $ < 7)) return (_.cb(args.map(Number)), send('✅ Đã thay đổi kết quả tài xỉu'));
        if (/^(tài|tai|t|xỉu|xiu|x)$/.test(args[0].toLowerCase())) return send(`✅ Đã thay đổi kết quả thành ${args[0]}\n🎲 Xúc xắc: ${_.cb(/^(tài|tai|t)$/.test(args[0].toLowerCase()) ? dices_sum_min_max(11, 17) : dices_sum_min_max(4, 10)).join('.')}`);
        return send('Vui lòng reply tài/xỉu hoặc 3 số của mặt xúc xắc\nVD: 2 3 4');
    };
};
exports.handleReaction = async o => {
    let _ = o.handleReaction;
    let {
        reaction,
        userID,
        threadID: tid,
        messageID: mid,
    } = o.event;
    let send = (msg, mid) => new Promise(r => o.api.sendMessage(msg, tid, r, mid == null ? undefined : messageID));

    if (tid in d == false) return send('❎ Bàn tài xỉu đã kết thúc không thể bỏ phiếu tiếp');
    if (_.p.some($ => $.id == userID)) {
        await send(`📌 Đã có ${++_.r}/${_.p.length} phiếu`);
        if (_.r >= Math.ceil(_.p.length * 50 / 100)) return (clearTimeout(d[tid].set_timeout), delete d[tid], send('✅ Đã hủy bàn tài xỉu thành công'));
    };
};