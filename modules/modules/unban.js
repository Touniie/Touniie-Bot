exports.config = {
    name: 'unban',
    version: '0.0.1',
    hasPermssion: 1,
    credits: 'DC-Nam',
    description: '',
    commandCategory: 'Nhóm',
    usages: '[]',
    cooldowns: 3,
};
let fs = require('fs');

let path = __dirname+'/data/commands-banned.json';
let data = {};
let save = ()=>fs.writeFileSync(path, JSON.stringify(data));

exports.run = o=> {
    if (fs.existsSync(path))data = JSON.parse(fs.readFileSync(path)); else save();
    let {
        senderID: sid,
        threadID: tid,
        messageID,
        mentions,
    } = o.event;
    let send = msg=>o.api.sendMessage(msg, tid, messageID);
    let tag = Object.entries(mentions)[0];
    let user_ban;
    let cmds_ad_ban = [];

    if (!data[tid])data[tid] = {
        cmds: [],
        users: {},
    };
    if (!!tag) {
        let user_ban = data[tid].users[tag[0]];
        let cmds_input = o.args.join(' ').replace(tag[1], '').split(' ').filter($=>!!$);

        if (!user_ban)user_ban = data[tid].users[tag[0]] = {
            all: {},
            cmds: [],
        };
        if (cmds_input.length == 0) {
            if (!user_ban.all.status)return send('❎ Người dùng này chưa bị ban');
            let x = global.config.ADMINBOT.includes(user_ban.all.author),
            z = global.config.ADMINBOT.includes(sid);
            if (x && !z)return send('❎ Người này do admin bot ban nên bạn không đủ quyền hạn unban');
            return(user_ban.all.status = false, save(), send('✅ Thực thi unban người dùng'));
        };
        if ((nothas = user_ban.cmds.filter($=>cmds_input.includes($.cmd)), nothas.length == 0))return send(`❎ Người này chưa từng bị cấm lệnh`);

        data[tid].users[tag[0]].cmds = user_ban.cmds.filter($=> {
            let x = global.config.ADMINBOT.includes($.author), z = global.config.ADMINBOT.includes(sid);
            if (!cmds_input.includes($.cmd))return true;
            if (x&&!z)return(cmds_ad_ban.push($.cmd), true); else return false;
        });
        save();
        return send(`✅ Đã mở cấm lệnh cho người này ${cmds_ad_ban.length > 0?`. Những lệnh sau do admin bot cấm nên bạn không đủ quyền unban: ${cmds_ad_ban.join(', ')}`: ''}`);
    };

    if (o.args.length == 0)return send('❎ Chưa nhập tên lệnh cần mở cấm');

    data[tid].cmds = data[tid].cmds.filter($=> {
        let x = global.config.ADMINBOT.includes($.author), z = global.config.ADMINBOT.includes(sid);
        if (!o.args.includes($.cmd))return true;
        if (x&&!z)return(cmds_ad_ban.push($.cmd), true); else return false;
    });
    save();
    send(`${cmds_ad_ban.length>0?`❎ Những lệnh sau do admin bot cấm nên bạn không đủ quyền unban: ${cmds_ad_ban.join(', ')}`:'✅ Thực thi unban'}`);
};