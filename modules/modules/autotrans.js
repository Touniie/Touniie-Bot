let
r = require('axios').get,
f = require('fs'),
p = __dirname+'/data/statusAutoTrans.json',
d,
api = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=';
;    
if(!f.existsSync(p))f.writeFileSync(p,'{}');
d=JSON.parse(f.readFileSync(p));
;
class Module {
    constructor(a) {
        this.config = a;
    };
    run(o) {
        let
        t = o.event.threadID;
        d[t] = !d[t]?true:false;
        f.writeFileSync(p,JSON.stringify(d)),o.api.sendMessage(`✅ ${d[t]?'bật':'tắt'} ${this.config.name}`,t);
    };
    handleEvent(o) {
        let
        a = o.event.body,
        t = o.event.threadID;

        if (!a || a.startsWith(global.config.PREFIX) || !d[t] || o.api.getCurrentUserID() == o.event.senderID)return; else r(api+encodeURI(a)).then(s=>s.data[2] != 'vi'?o.api.sendMessage(s.data[0].map(el=>el[0]).join(''), t, o.event.messageID): '').catch(console.log);
    };
};

module.exports = new Module({
    name: 'autotrans',
    version: '1.1',
    hasPermssion: 0,
    credits: 'DC-Nam',
    description: '',
    commandCategory: 'Tiện ích',
    usages: '[]',
    cooldowns: 0,
});