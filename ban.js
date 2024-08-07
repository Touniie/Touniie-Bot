exports.config = {
    name: 'ban',
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

let time = format=>require('moment-timezone')().tz('Asia/Ho_Chi_Minh').format(format || 'HH:mm:ss DD/MM/YYYY');

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
    let is_qtv_box = id=>global.data.threadInfo.get(tid).adminIDs.some($=>$.id == id);

    if (!data[tid])data[tid] = {
        cmds: [],
        users: {},
    };
    if (!!tag) {
        if (is_qtv_box(tag[0])||global.config.ADMINBOT.includes(tag[0]))return send('⚠️ Không thể ban quản trị viên');
        let user_ban = data[tid].users[tag[0]];
        let cmds_input = o.args.join(' ').replace(tag[1], '').split(' ').filter($=>!!$);

        if (!user_ban)user_ban = data[tid].users[tag[0]] = {
            all: {},
            cmds: [],
        };
        if (cmds_input.length == 0)return(user_ban.all = {
            status: true,
            author: sid,
            time: time(),
        }, save(), send('✅ Thực thi ban người dùng'));

        for (let cmd of cmds_input)if (!user_ban.cmds.some($=>$.cmd == cmd))user_ban.cmds.push({
            cmd,
            author: sid,
            time: time(),
        });
        save();
        return send(`✅ Đã cấm ${tag[1]} sử dụng những lệnh sau: ${cmds_input.join(', ')}`);
    };

    if (o.args.length == 0)return send('❎ Chưa nhập tên lệnh cần cấm');

    for (let cmd of o.args) {
        let has = data[tid].cmds.some($=>$.cmd == cmd);
        if (!has)data[tid].cmds.push({
            cmd,
            author: sid,
            time: time(),
        });
    };
    save();
    send('✅ Thực thi ban lệnh');
};