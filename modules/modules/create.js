let configg = a => `{
  name: '${a}',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'quất',
  description: '[]',
  commandCategory: '[]',
  usages: '[]',
  cooldowns: 0,
  usePrefix: false
}`,
    api_event = '({ api: { sendMessage }, event: { senderID, threaID, messageID } })',
send = 'let send = (a, b) => sendMessage(a, threadID, b, messageID)'
class create {
    constructor(a) { this.config = a }
    run({ api: { sendMessage }, event: { threadID, messageID }, args }) {
        if (!args) return
        sendMessage(`Bạn muốn dạng nào\n${'cơ bản-class-function-biến'.split('-').map((a, b) => `${b + 1} ${a}`).join('\n')}`, threadID, (a, b) => { global.client.handleReply.push({ name: 'create', messageID: b.messageID, ten: args.join(' ') }) }, messageID)
    }
    handleReply({ api: { sendMessage }, event: { body, messageID, threadID }, args, handleReply: { ten } }) {
        if ('1234'.split('').includes(body)) {
            require('fs').writeFileSync(`${__dirname}/${ten}.js`,
                body == 1 ? `this.config = ${configg(ten)}
this.run = async ${api_event} => {
  ${send}
}` :
                    body == 2 ? `class quất {
  constructor(a) {
    this.config = a
  }
  async run({ api: { sendMessage }, event: { senderID, threaID, messageID } }) {
    ${send}
  }
}             
module.exports = new quất(${configg(ten)})` :
                        body == 3 ? `async function run${api_event}{
  ${send}
}
module.exports = { 
  run,
  config: ${configg(ten)}
 }` :
                            `let config = ${configg(ten)},
run = async ${api_event} => {
  ${send}
}
module.exports = { 
  config,
  run
}`, 'utf8')
            sendMessage('tạo thành công cấu trúc mdl', threadID, messageID)
        }
    }
}
module.exports = new create({
    name: 'create',
    version: '1.1.1',
    hasPermssion: 2,
    credits: 'quất',
    description: 'Liên hệ ADMIN bot',
    commandCategory: 'Admin',
    usages: '[]',
    cooldowns: 0
})