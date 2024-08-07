exports.config = {
    name: 'bank',
    version: '0.0.1',
    hasPermssion: 0,
    credits: 'DC-Nam',
    description: 'banking',
    commandCategory: 'Coin',
    usages: '[]',
    cooldowns: 0,
};
let fs = require('fs');
let folder = __dirname+'/data/banking_accounts/'; if (!fs.existsSync(folder))fs.mkdirSync(folder);
let read = (id, path = folder+id+'.json')=>fs.existsSync(path)?JSON.parse(fs.readFileSync(path)): null;
let reads = _=>fs.readdirSync(folder).map($=>read($.replace('.json', ''))).filter($=>$ != null);
let del = (id, path = folder+id+'.json')=>fs.unlinkSync(path);
let acc_my_login = id=>reads().find($=>$.logins.some($=>$.uid == id)) || null;
let save = (data, path = folder+data.uid+'.json')=>fs.writeFileSync(path, JSON.stringify(data, 0, 4));
let _0 = t=>t < 10?'0'+t: t;
let convert_time = (time, format)=>require('moment-timezone')(time).format(format || 'HH:mm:ss DD/MM/YYYY');
let now = ()=>Date.now()+25200000;
let random_number = (min, max)=>Math.floor(Math.random() * (max - min + 1)) + min;
let random_str = l=>[...Array(l)].map($=>'0123456789'[Math.random()*10<<0]).join('');
let name = id=>global.data.userName.get(id);
let _2fa_ = {};
let create_code_2fa = id=>(_2fa_[id] = random_str(6), setTimeout(_=>delete _2fa_[id], 1000*60*3), `📝 Mã xác thực: ${_2fa_[id]}\nMã có hiệu lực trong vòng 3 phút`);
let check_code_2fa = (id, code)=>_2fa_[id] == code;
let interest = {
    debt: {
        rate: BigInt('5'),
        time: 1000*60*60,
    },
    balance: {
        rate: BigInt('1'),
        time: 1000*60*60*24*1,
    },
};
let _1th = 1000*60*60*24*30;
let ban_millis = _1th;
let due_millis = 1000*60*60*24*2;
exports.onLoad = o=> {
    if (!global.set_interval_bankings_interest_p)global.set_interval_bankings_interest_p = setInterval((()=> {
        for (let file of reads()) {
            let send = msg=>new Promise(r=>o.api.sendMessage(msg, file.uid, (err, res)=>r(res || err)));
            if (typeof file.timestamp_due_repay != 'number' && BigInt(file.debt) > 0n)(file.timestamp_due_repay = now() + due_millis, save(file));
            if (typeof file.expired_ban.time == 'number' && now() > file.expired_ban.time)(file.expired_ban = {}, save(file));
            if (typeof file.expired_ban.time != 'number' && typeof file.timestamp_due_repay == 'number' && now() > file.timestamp_due_repay && BigInt(file.debt) > 0n)(file.expired_ban.time = now() + ban_millis, file.expired_ban.reason = `Qua ${due_millis/1000/60/60/24<<0} ngày chưa trả hết số nợ`, save(file), send(`[ THÔNG BÁO QUÁ HẠN ]\n\n⚠️ Do quá ${due_millis/1000/60/60/24<<0} ngày mà bạn chưa trả hết nợ nên tài khoản đã bị khoá ${ban_millis/1000/60/60/24/30<<0} tháng, liên hệ Admin để làm việc`));
            if (typeof file.expired_ban.time != 'number') for (let type of ['balance', 'debt']) {
                if (BigInt(file[type]) >= 100n && (typeof file.interest_period[type]) != 'number')(file.interest_period[type] = now() + interest[type].time, save(file));
                if (typeof file.interest_period[type] == 'number' && now() > file.interest_period[type] && BigInt(file[type]) >= 100n)(interest_money = BigInt(file[type]) * interest[type].rate / 100n, file[type] = (BigInt(file[type]) + interest_money).toString(), file.interest_period[type] = now() + interest[type].time, save(file), send(`[ THÔNG BÁO LÃI XUẤT ]\n\n+ ${interest_money.toLocaleString()}$ lãi vào ${ {
                    balance: 'số dư', debt: 'số nợ'
                }[type]}`));
            };
        };
    }), 1000);
};
exports.run = async o=> {
    let tid = o.event.threadID;
    let send = (msg, tid_, typ = typeof tid_ == 'object')=>new Promise(r=>(o.api.sendMessage(msg, typ?tid_.event.threadID: (tid_ || tid), (err, res)=>r(res || err), typ?tid_.event.messageID: (tid_?undefined: o.event.messageID))));
    let cmd = o.event.args[0];
    let sid = o.event.senderID;
    let target_id = o.event.messageReply?.senderID || Object.keys(o.event.mentions || {})[0];
    let data = read(sid);
    let {
        getData,
        increaseMoney,
        decreaseMoney,
    } = o.Currencies;
    //if (convert_time(now(), 'd') == '0')return send('⛔ Chủ nhật banking đóng cửa hẹn gặp lại quý khách');
    if (acc_my_login(sid))data = acc_my_login(sid);
    if (!!o.args[0] && !['-r', 'register', 'login', 'unban'].includes(o.args[0]) && data == null)return send(`❎ Bạn chưa có tài khoản ngân hàng, dùng '${cmd} register' để đăng ký`);
    if (!!o.args[0] && !['unban', 'login', 'logout'].includes(o.args[0]) && typeof data?.expired_ban?.time == 'number')return send(`❎ Tài khoản của bạn đã bị cấm do: ${data.expired_ban.reason}, cấm sẽ được mở sau: ${(d=>`${_0(d/1000/60/60/24%30<<0)} ngày ${_0(d/1000/60/60%24<<0)}:${_0(d/1000/60%60<<0)}:${_0(d/1000%60<<0)}`)(data.expired_ban.time - now())}`);
    switch (o.args[0]) {
        case '-r':
        case 'register': {
                let account_number;
                let phí = 100000000n;
                if (data)return send('❎ Bạn đã có tài khoản');
                let create_account = pass=> {
                    if (read(sid) != null)return send('❎ Bạn đã có tài khoản rồi', sid);
                    let form = {
                        "account_number": account_number || random_str(6),
                        "uid": sid,
                        "balance": "0",
                        "created_at": now(),
                        "debt": "0",
                        "count_debt": 0,
                        "status": 0,
                        "history": [],
                        "logins": [],
                        "settings": {},
                        "expired_ban": {},
                        "interest_period": {},
                        pass,
                    };
                    save(form);
                    return send(`✅ Đã tạo tài khoản ngân hàng thành công, dùng '${cmd} info' để xem thông tin tài khoản`, sid);
                };
                send(`🆕 Bạn muốn tự đặt stk theo ý mình không? Reply tin nhắn này bằng stk muốn đặt (phí ${phí.toLocaleString()}$) hoặc 'n' để bỏ qua`).then(res=>(res.name = exports.config.name, res.callback = async o=> {
                    let stk = o.event.args[0];
                    if (isFinite(stk)) {
                        if (reads().some($=>$.account_number == stk))return send(`❎ Stk đã tồn tại`, o);
                        if (BigInt((await getData(sid)).money) < phí)return send('❎ Bạn không đủ tiền', o);
                        account_number = stk;
                        decreaseMoney(sid, phí.toString());
                    };
                    send(`📌 Bạn muốn tự đặt mật khẩu tài khoản hay hệ thống random mật khẩu\n\nPhản hồi 'y' để tự đặt hoặc 'n' để hệ thống random`, o).then(res=>(res.name = exports.config.name, res.callback = async o=> {
                        let call = {
                            y: _=>send('✅ Hệ thống đã gửi bước nhập mật khẩu trong tin nhắn riêng', o).then(()=>send('📌 Reply tin nhắn này để điền mật khẩu bạn muốn đặt', o.event.senderID).then(res=>(res.name = exports.config.name, res.callback = o=>create_account(o.event.args[0]), res.o = o, global.client.handleReply.push(res)))),
                            n: _=>send('✅ Hệ thống đã gửi mật khẩu trong tin nhắn riêng', o).then(_=>create_account(random_str(4)).then(()=>send(`📌 Mật khẩu của bạn là ${read(sid).pass}`, sid))),
                        }[(o.event.args[0] || '').toLowerCase()];
                        if (read(sid) != null)return send('❎ Bạn đã có tài khoản rồi', o);
                        if (!call)return send('❎ Vui lòng reply y/n', o); else call();
                    },
                        res.o = o,
                        global.client.handleReply.push(res)));
                }, res.o = o, global.client.handleReply.push(res)));
            };
            break;
        case '-i':
        case 'info': try {
                let acc = o.args[1]?.split(':') || [];
                let data_target = !!target_id?read(target_id): acc.length != 0?(acc[0] == 'uid'?read(acc[1]): acc[0] == 'stk'?reads().find($=>$.account_number == acc[1]) || null: null): data;
                if (data_target == null)return send('❎ Không tìm thấy tài khoản cần xem thông tin');
                if ((!!target_id || acc.length != 0) && !data_target.settings.public)return send('⚠️ Tài khoản này không công khai thông tin');
                send(`[ NGÂN HÀNG MIRAI BANK ]\n\n👤 Chủ tài khoản: ${name(data_target.uid)?.toUpperCase()}\n🏦 STK: ${data_target.account_number}\n💵 Số dư: ${BigInt(data_target.balance).toLocaleString()}$ ${!!data_target.interest_period.balance && BigInt(data_target.balance) > 100n?`\n⬆️ Lãi: +${(BigInt(data_target.balance) * interest.balance.rate / 100n).toLocaleString()}$ sau ${(f=>`${_0(f/1000/60/60<<0)}:${_0(f/1000/60%60<<0)}:${_0(f/1000%60<<0)}`)(data_target.interest_period.balance - now())}`: ''}\n🔄 Trạng thái bảo mật: ${data_target.pass.length <= 4 && !data_target.settings._2fa?'yếu (pass ngắn, không bật 2fa)': data_target.pass.length > 4 && !!data_target.settings._2fa?`Mạnh`: `khá (${data_target.pass.length <= 4?'pass ngắn': 'không bật 2fa'})`}\n🔒 Global Ban: ${data_target.expired_ban.time?`bị ban vào lúc ${convert_time(data_target.expired_ban.time- _1th)} với lý do: ${data_target.expired_ban.reason}`: 'không bị cấm'}\n⏰ Ngày tạo: ${convert_time(data_target.created_at)}\n⛔ Nợ: ${BigInt(data_target.debt).toLocaleString()}$ ${!!data_target.interest_period.debt && BigInt(data_target.debt) > 100n?`\n⬆️ Lãi: +${(BigInt(data_target.debt) * interest.debt.rate / 100n).toLocaleString()}$ sau ${(f=>`${_0(f/1000/60/60<<0)}:${_0(f/1000/60%60<<0)}:${_0(f/1000%60<<0)}`)(data_target.interest_period.debt - now())}`: ''}\n🌐 Công khai thông tin: ${!data_target.settings.public?'không': 'có'}\n🔢 Xác thực 2 yếu tố: ${!data_target.settings._2fa?'tắt': 'bật'}\n\n📌 số dư/nợ trên 100$ sẽ bắt đầu tính lãi`);
            } catch(e) {
                console.log(e);
                send('⚠️ Có lỗi xảy ra liên hệ dev để xử lý');
            };
            break;
        case 'nạp':
        case 'gửi': {
                let money = o.args[1];
                let min = 100n;
                let userData = await getData(sid);
                if (/^all$/.test(money))money = BigInt(userData.money);
                else if (/^[0-9]+%$/.test(money))money = BigInt(userData.money)*BigInt(money.match(/^[0-9]+/)[0])/100n;
                if (!money || isNaN(money.toString())) return send(`❎ Vui lòng nhập số tiền cần nạp vào tài khoản`); else money = BigInt(money);
                if (money < min) return send(`❎ Số tiền nạp tối thiểu là ${min.toLocaleString()}$`);
                if (BigInt(userData.money) < money) return send(`❎ Bạn không đủ tiền trong ví để nạp vào tài khoản`);
                let newBalance = BigInt(data.balance) + money;

                await decreaseMoney(sid, money.toString());
                data.balance = newBalance.toString();
                data.history.push({
                    type: 'send', amount: money.toString(), author: sid, time: now(),
                });
                save(data);
                send(`✅ Nạp ${money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}$ vào tài khoản thành công`);
            };
            break;
        case 'rút':
        case 'lấy': {
                let money = o.args[1];
                let min = 1n;
                if (/^all$/.test(money))money = BigInt(data.balance);
                else if (/^[0-9]+%$/.test(money))money = BigInt(data.balance)*BigInt(money.match(/^[0-9]+/)[0])/100n;
                if (isNaN(money+'')) return send(`❎ Vui lòng nhập số tiền cần rút khỏi tài khoản`); else money = BigInt(money);
                if (money < min) return send(`❎ Số tiền rút tối thiểu là ${min.toLocaleString()}$`);
                if (money > BigInt(data.balance)) return send(`❎ Bạn không đủ tiền`);
                let newBalance = BigInt(data.balance) - money;
                let userData = await getData(sid);
                let newMoney = BigInt(userData.money) + money;
                await increaseMoney(sid, money.toString());
                data.balance = newBalance.toString();
                data.history.push({
                    type: 'withdraw', amount: money.toString(), author: sid, time: now()});
                save(data);
                send(`✅ Rút ${money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}$ khỏi tài khoản thành công`);
            };
            break;
        case '-t':
        case 'top': {
                if (BigInt(data.balance) < 100000)return send('❎ Yêu cầu số dư của tài khoản banking lớn hơn 100,000$ để kiểm tra bảng xếp hạng');
                send('📌 Thả cảm xúc để xác nhận -10% tiền để kiểm tra bảng xếp hạng banking').then(res=>(res.callback = ()=>(data.balance = (BigInt(data.balance) - BigInt(data.balance) * 10n / 100n).toString(), save(data), send(`[ TOP BẢNG XẾP HẠNG ]\n\n${reads().sort((a, b)=>BigInt(b.balance) < BigInt(a.balance)?-1: 0).slice(0, 10).map(($, i)=>`📊 Top: ${i+1}\n👤 Name: ${$.settings.public?name($.uid)?.toUpperCase(): 'không công khai'}\n💵 Money: ${BigInt($.balance).toLocaleString()}$`).join('\n\n')}`)), res.name = exports.config.name, res.o = o, global.client.handleReaction.push(res)));
            };
            break;
        case '-p':
        case 'pay': {
                let type_pay = (o.args[1] || '').toLowerCase();
                if (!['stk', 'uid'].includes(type_pay))return send(`❎ Vui lòng chọn 'stk' hoặc 'uid'\nVD: ${cmd} pay stk`);
                send(`📌 Phản hồi tin nhắn này kèm ${ {
                    stk: 'stk', uid: 'uid Facebook'
                }[type_pay]} người cần chuyển tiền`).then(res=>(res.name = exports.config.name, res.o = o, res.callback = async o=> {
                        let send = (msg, tid)=>new Promise(r=>(o.api.sendMessage(msg, tid || o.event.threadID, (err, res)=>r(res || err), tid?undefined: o.event.messageID)));
                        let target_pay = o.event.args[0];
                        let receiver = type_pay == 'stk'?reads().find($=>$.account_number == target_pay) || null: read(target_pay);
                        if (!receiver)return send(`⚠️ Tài khoản cần chuyển không tồn tại`);
                        send(`👤 Tên: ${name(receiver.uid)?.toUpperCase()}\n🏦 Stk: ${receiver.account_number}\n\n📌 Reply số tiền cần chuyển`).then(res=>(res.name = exports.config.name, res.o = o, res.callback = async o=> {
                            data = read(data.uid);
                            let send = (msg, tid)=>new Promise(r=>(o.api.sendMessage(msg, tid || o.event.threadID, (err, res)=>r(res || err), tid?undefined: o.event.messageID)));
                            let money_pay = (o.event.args[0] || '').toLowerCase();
                            if (money_pay == 'all')money_pay = data.balance.toString();
                            else if (/^[0-9]+%$/.test(money_pay))money_pay = BigInt(data.balance)*BigInt(money_pay.match(/^[0-9]+/)[0])/100n;
                            if (isNaN(money_pay.toString()))return send('❎ Số tiền không hợp lệ');
                            if (BigInt(money_pay) < 500n)return send(`❎ Số tiền chuyển tối thiểu là 500$`);
                            if (BigInt(money_pay) > BigInt(data.balance))return send(`❎ Bạn không đủ tiền để chuyển`);
                            send('📌 Reply nội dung chuyển khoản').then(res=>(res.name = exports.config.name, res.o = o, res.callback = async o=> {
                                let send = (msg, tid)=>new Promise(r=>(o.api.sendMessage(msg, tid || o.event.threadID, (err, res)=>r(res || err), tid?undefined: o.event.messageID)));
                                let content_pay = o.event.body;
                                send(`👤 Tên: ${name(receiver.uid)?.toUpperCase()}\n🏦 Stk: ${receiver.account_number}\n💵 Số tiền cần chuyển: ${BigInt(money_pay).toLocaleString()}$\n📝 Nội dung pay: ${content_pay}\n\n📌 Thả cảm xúc để xác nhận chuyển tiền`).then(res=>(res.name = exports.config.name, res.o = o, res.callback = async o=> {
                                    data = read(data.uid);
                                    receiver = read(receiver.uid);
                                    let newBalance = BigInt(data.balance) - BigInt(money_pay);
                                    let newReceiverBalance = BigInt(receiver.balance) + BigInt(money_pay);
                                    data.balance = newBalance.toString();
                                    receiver.balance = newReceiverBalance.toString();
                                    data.history.push({
                                        type: 'pay', amount: money_pay.toString(), content: content_pay, author: sid, time: now(), to: receiver.account_number
                                    });
                                    receiver.history.push({
                                        type: 'receive', amount: money_pay.toString(), content: content_pay, time: now(), from: data.account_number
                                    });
                                    save(data);
                                    save(receiver);
                                    await send(`[ THÔNG BÁO NHẬN TIỀN ]\n\n👤 Tên: ${name(data.uid).toUpperCase()}\n🏦 Stk: ${data.account_number}\n💵 Số tiền: ${BigInt(money_pay).toLocaleString()}$\n📝 Nội Dung: ${content_pay}\n\n📌 Số dư của bạn là: ${newReceiverBalance.toLocaleString()}$`, receiver.uid);
                                    send(`✅ Chuyển ${BigInt(money_pay).toLocaleString()}$ cho ${name(receiver.uid)} thành công`, tid);
                                }, global.client.handleReaction.push(res)))
                            }, global.client.handleReply.push(res)))
                        },
                            global.client.handleReply.push(res)))
                    }, global.client.handleReply.push(res)));
            };
            break;
        case '-v':
        case 'vay': {
                let limit = 10000000n;
                let money = o.args[1];
                if (money === 'max')money = limit;
                if (isNaN(money+'')) return send(`❎ Vui lòng nhập số tiền cần vay`);
                if (BigInt(money) < 500n) return send(`❎ Số tiền vay tối thiểu là 500$`);
                if (data.count_debt >= 2) return send(`❎ Bạn đã có khoản nợ chưa trả, vui lòng trả khoản nợ trước khi vay tiền`);
                if (o.args[1] === 'max')money = limit - BigInt(data.debt);
                let newDebt = BigInt(data.debt) + BigInt(money); if (newDebt > limit || money == 0n)return send(`❎ Giới hạn số tiền được vay trên tài khoản là ${limit.toLocaleString()}$`);
                let newBalance = BigInt(data.balance) + BigInt(money);
                data.balance = newBalance.toString();
                data.debt = newDebt.toString();
                data.count_debt++;
                data.history.push({
                    type: 'borrow', amount: money.toString(), author: sid, time: now()});
                if (!data.timestamp_due_repay)data.timestamp_due_repay = now()+ due_millis;
                save(data);
                send(`✅ Vay ${BigInt(money).toLocaleString()}$ thành công, bạn đã có khoản nợ ${newDebt.toLocaleString()}$ với lãi suất ${interest.debt.rate}%/${interest.debt.time/1000/60/60<<0} giờ, sau ${due_millis/1000/60/60/24<<0} ngày không trả hết số nợ tài khoản sẽ bị khoá 1 tháng`);
            };
            break;
        case 'trả': {
            let money = o.args[1];
            if (data.debt == '0')return send('⚠️ Bạn không có khoản nợ nào');
            if (/^all$/.test(money))money = data.debt;
            if (isNaN(money+'')) return send(`❎ Vui lòng nhập số tiền cần trả cho khoản nợ`);
            if (BigInt(money) > BigInt(data.balance))return send('⚠️ Số dư không đủ để trả');
            if (BigInt(money) > BigInt(data.debt) || BigInt(money) < 1n) return send(`❎ Số tiền trả không thể lớn hơn khoản nợ hiện tại/nhỏ hơn 1$ hoặc bạn có thể dùng '${cmd} trả all' để trả toàn bộ nợ`);
            let newDebt = BigInt(data.debt) - BigInt(money);
            let newBalance = BigInt(data.balance) - BigInt(money);
            data.balance = newBalance.toString();
            data.debt = newDebt.toString();
            if (data.debt == '0')(data.count_debt = 0, delete data.timestamp_due_repay);
            data.history.push({
                type: 'repay', amount: money.toString(), author: sid, time: now()});
            save(data);
            send(`✅ Trả khoản nợ ${BigInt(money).toLocaleString()}$ thành công, khoản nợ hiện tại là ${newDebt.toLocaleString()}$${newDebt != 0n?`, hạn trả nợ đã được đặt lại là ${due_millis/1000/60/60/24<<0} ngày`: ''}`);
        };
            break;
        case '-h':
        case 'history':
            send(`[ LỊCH SỬ GIAO DỊCH ]\n\n${data.history.map(($, i)=>(money_str = $.amount?`${BigInt($.amount).toLocaleString()}$`: '', `${i+1}. ${convert_time($.time)} - ${ {
                send: _=>`gửi ${money_str}`,
                withdraw: _=>`rút ${money_str}`,
                pay: _=>`chuyển ${money_str} đến stk ${$.to}`,
                receive: _=>`nhận ${money_str} của stk ${$.from}`,
                borrow: _=>`vay ${money_str}`,
                repay: _=>`trả ${money_str}`,
                login: _=>`login bởi https://www.facebook.com/profile.php?id=${$.from}`,
                setpass: _=>`https://www.facebook.com/profile.php?id=${$.author} đặt mật khẩu là: ${$.pass}`,
                setstk: _=>`https://www.facebook.com/profile.php?id=${$.author} đổi stk là: ${$.stk}`,
            }[$.type]()}`)).join('\n\n')}`);
            break;
        case 'setpass':
            await send('✅ Hệ thống đã gửi bước nhập mật khẩu vào tin nhắn riêng');
            send('📌 Reply tin nhắn này để nhập mật khẩu mới', sid).then(res=>(res.callback = o=> {
                data.pass = o.event.args[0];
                data.history.push({
                    type: 'setpass', pass: data.pass, author: sid, time: now(),
                });
                save(data);
                send('✅ Đã đặt mặt khẩu cho tài khoản\nMật khẩu này có thể dùng để đăng nhập tài khoản Banking trên tài khoản facebook khác', o);
            }, res.name = exports.config.name, res.o = o, global.client.handleReply.push(res)));
            break;
        case 'setstk': {
            let phí = 100000000n;
            if (isNaN(o.args[1]))return send('❎ Stk phải là 1 con số');
            if (BigInt(data.balance) < phí)return send(`❎ Bạn không đủ tiền cần ${phí.toLocaleString()}$`);
            send(`📌 Thả cảm xúc để xác nhận đổi stk với phí là ${phí.toLocaleString()}$`).then(res=>(res.callback = _=> {
                let newBalance = BigInt(data.balance) - phí;
                data.balance = newBalance.toString();
                data.account_number = o.args[1];
                data.history.push({
                    type: 'setstk', stk: o.args[1], author: sid, time: now(),
                });
                save(data);
                send(`✅ Set stk theo yêu cầu thanh công\nTrừ ${phí.toLocaleString()}$`);
            }, res.name = exports.config.name, res.o = o, global.client.handleReaction.push(res)));
        };
            break;
        case 'login': {
            let type = (o.args[1] || '').toLowerCase();

            if (!['uid', 'stk'].includes(type))return send(`❎ Vui lòng chọn 'stk' hoặc 'uid'\nVD: ${cmd} login stk`);
            await send('✅ Hệ thống đã gửi các bước để login vào tin nhắn riêng');
            send(`📌 Reply tin nhắn này để nhập ${ {
                uid: 'uid Facebook', stk: 'stk'
            }[type]}`, sid).then(res=>(res.callback = o=> {
                    let target_id = o.event.args[0];
                    let data_target = type == 'uid'?read(target_id): type == 'stk'?reads().find($=>$.account_number == target_id) || null: null;
                    if (data_target == null)return send('⚠️ Có vẻ tài khoản bạn nhập không tồn tại', o);
                    if (data_target.uid == sid)return send('✅ Facebook bạn là chủ tài khoản này nên hệ thống tự login trước đó rồi', o);
                    send('📌 Reply tin nhắn này để nhập mật khẩu', o).then(res=>(res.callback = async o=> {
                        data_target = read(data_target.uid);
                        let pass = o.event.args[0];
                        if (data_target.pass != pass)return send('⚠️ Mật khẩu không đúng', o);
                        let login = async o=> {
                            data_target.logins.push({
                                "uid": sid,
                                "time": now(),
                            });
                            data_target.history.push({
                                type: 'login', from: sid, time: now(),
                            });
                            save(data_target);
                            if (typeof data?.uid == 'string' && data?.uid != sid)(data.logins.splice(data.logins.findIndex($=>$.uid == sid), 1), save(data));
                            await send(`✅ Đã đăng nhập vào tài khoản banking, dùng '${cmd} info' để xem thông tin tài khoản`);
                            send(`[ Banking - Thông Báo ]\n\n⚠️ tài khoản của bạn vừa được đăng nhập trên https://www.facebook.com/profile.php?id=${sid}\n⛔ nếu bạn không quen người này hãy đổi mật khẩu và reaction tin nhắn để đăng xuất khỏi Faebook vừa đăng nhập ngay hoặc dùng ${cmd} logloca để xem các nơi đã đăng nhập vào tài khoản và thực hiện đăng xuất.`, data_target.uid).then(res=>(res.callback = o=> {
                                data_target = read(data_target.uid);
                                data_target.logins.splice(data_target.logins.findIndex($=>$.uid == sid), 1);
                                save(data_target);
                                send(`✅ Đã đăng xuất khỏi https://www.facebook.com/profile.php?id=${sid}`, o);
                            }, res.name = exports.config.name, res.o = o, global.client.handleReaction.push(res)));
                        };
                        if (!data_target.settings._2fa)login(o);
                        else send(`🔒 Mã xác thực đăng nhập đã được gửi tới FB chính chủ, phản hồi tin nhắn này kèm mã để xác minh`, o).then(res=>(send(create_code_2fa(sid), data_target.uid), res.callback = async o=> {
                            let code = o.event.args[0];
                            if (!check_code_2fa(sid, code))return send('❎ Mã đăng nhập không chính xác');
                            login(o);
                        },
                            res.name = exports.config.name,
                            res.o = o,
                            global.client.handleReply.push(res)));
                    },
                        res.name = exports.config.name,
                        res.o = o,
                        global.client.handleReply.push(res)));
                }, res.name = exports.config.name, res.o = o, global.client.handleReply.push(res)));
        };
            break;
        case 'logout': {
            if (data == null || data?.uid == sid)return send(`❎ Bạn chưa đăng nhập vào tài khoản nào`);

            data.logins.splice(data.logins.findIndex($=>$.uid == sid), 1);
            save(data);
            send(`✅ Đã đăng xuất khỏi tài khoản`);
        };
            break;
        case 'logloca':
            send(`[ Banking - Nơi Đã Đăng Nhập ]\n\n${data.logins.map(($, i)=>`${i+1}. https://www.facebook.com/profile.php?id=${$.uid} (${convert_time($.time)})`).join('\n')}\n\nReply (phản hồi) theo stt để đăng xuất tài khoản khỏi FB tương ứng`).then(res=>(res.callback = o=> {
                let stt = o.event.args;
                if (isNaN(stt.join('')))return send(`❎ Stt phải là con số`, o);
                data.logins = data.logins.filter((e, i)=>!stt.includes(''+(i+1)));
                save(data);
                send('✅ Đã đăng xuất khỏi FB trên', o)
            },
                res.o = o,
                res.name = exports.config.name,
                global.client.handleReply.push(res)));
            break;
        case 'delete': {
            if (data == null)return send(`⚠️ Bạn chưa có tài khoản`);
            if (data.uid != sid)return send(`❎ Không đủ quyền hạn để xoá`);
            if (BigInt(data.debt) > 0n)return send('⚠️ Không thể thực hiện yêu cầu do bạn chưa trả hết nợ');
            let callback = ()=> {
                del(sid);
                send('✅ Đã xoá tài khoản');
            };
            send('📌 Thả cảm xúc để xác nhận xoá tài khoản\n\n⚠️ Sau khi xoá không thể khôi phục').then(res=>(res.name = exports.config.name, res.callback = callback, res.o = o, res.type = 'cofirm_delete_account', global.client.handleReaction.push(res)));
        };
            break;
        case 'public': {
            if (!['on', 'off'].includes(o.args[1]))return send(`⚠️ Hãy thử lại và sử dụng lệnh như sau: ${cmd} public on hoặc off`);
            data.settings.public = o.args[1] == 'on'?true: false;
            save(data);
            send(`✅ Đã ${o.args[1] == 'on'?'bật': 'tắt'} công khai thông tin tài khoản`);
        };
            break;
        case '2fa': {
            if (!['on', 'off'].includes(o.args[1]))return send(`❎ Vui lòng nhập ${cmd} 2fa on hoặc off`);
            data.settings._2fa = o.args[1] == 'on'?true: false;
            save(data);
            send(`✅ Đã ${o.args[1] == 'on'?'bật': 'tắt'} 2fa`);
        };
            break;
        case 'unban': {
            if (!global.config.ADMINBOT.includes(sid))return;
            let data_target = read(target_id || o.args[1] || sid);
            if (data_target == null)return send('⚠️ Không tìm thấy tài khoản');
            if (!data_target.expired_ban.time)return send('❎ Tài khoản không bị ban');
            data_target.expired_ban = {};
            delete data_target.timestamp_due_repay;
            data_target.balance = '0';
            data_target.debt = '0';
            save(data_target);
            send('✅ Đã mở cấm cho tài khoản này');
        };
            break;
        case 'admin':
            if (global.config.ADMINBOT.includes(sid))send(`[ Banking - Lệnh Admin ]\n\n1: 55 66 (xoá file.json với 55 và 66 là id fb).\n2: 88 1000 (thay đổi số dư của ID 88 thành 1000$)\n3: 88 1000 (thay đổi số nợ của ID 88 thành 1000$)\n\n-> Reply STT [data]`).then(res=>(res.callback = async o=> {
                let call = {
                    1: _=>(o.event.args.map($=>del($)), send('done', o)),
                    //2: _=>(d = read(o.event.args))
                }[o.event.args[0]];
                call();
            }, res.name = exports.config.name, res.o = o, global.client.handleReply.push(res))); else break;
        break;
        default:
            send(`[ NGÂN HÀNG MIRAI BANK ]\n\n${cmd} register -> Tạo tài khoản ngân hàng\n${cmd} info -> Xem thông tin tài khoản của bạn\n${cmd} history -> Xem toàn bộ lịch sử giao dịch\n${cmd} nạp/gửi + số tiền -> Nạp tiền vào tài khoản ngân hàng\n${cmd} rút/lấy + số tiền -> Rút tiền khỏi tài khoản ngân hàng\n${cmd} top -> Xem top người dùng giàu nhất\n${cmd} pay + stk -> Gửi tiền vào số tài khoản nào đó\n${cmd} vay + số tiền -> Vay tiền từ ngân hàng\n${cmd} trả + số tiền -> Trả lại số tiền đã vay từ ngân hàng\n${cmd} setpass + pass -> đặt mật khẩu\n${cmd} setstk + stk muốn đặt\n${cmd} login -> Đăng nhập tài khoản\n${cmd} logout -> Đăng xuất tài khoản\n${cmd} delete -> xoá tài khoản\n${cmd} public on/off -> công khai thông tin tài khoản\n${cmd} logloca -> kiểm tra nơi đã đăng nhập\n${cmd} 2fa -> bật/tắt 2fa\n\nMẹo: dùng ${cmd} + dấu - và chữ cái đầu để ghi tắt\nVD: ${cmd} -r`);
            break;
    };
};
exports.handleReaction = async o=> {
    let f = o.handleReaction;

    o.api.unsendMessage(f.messageID);
    if (f.o.event.senderID == o.event.userID)f.callback(o);
};
exports.handleReply = async o=> {
    let f = o.handleReply;

    if (f.o.event.senderID == o.event.senderID)(res = await f.callback(o), res == undefined?o.api.unsendMessage(f.messageID): '');
};