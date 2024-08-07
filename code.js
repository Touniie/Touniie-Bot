module.exports.config = {
  name: "code",
  version: "1.1.1",
  hasPermssion: 2,
  credits: "Quất",
  description: "Tạo code nhận xu",
  commandCategory: "Admin",
  usages: "test",
  cooldowns: 3,
};
const path = __dirname + '/data/code.json'
const fs = require("fs")
module.exports.handleEvent = async function ({ api, event, args, Currencies }) {
  try{
  const { increaseMoney, decreaseMoney, getData } = Currencies;
  if(event.body === '') return
  if(event.body === undefined) return
  var data = JSON.parse(fs.readFileSync(path))
  if(data.length > 0){ 
    const findCode = data.find(item=> item.key === (event.args[0]).toLowerCase())
    if(findCode){
      const findU = findCode.user.find(item=> item.userID === event.senderID)
    if(findU) return api.sendMessage('❎ Bạn đã nhập code trước đó', event.threadID)
      await increaseMoney(event.senderID,String(findCode.money));
      api.sendMessage(`🎊 Xin chúc mừng bạn đã nhập được mã code trúng thưởng '${findCode.key}' bạn được cộng thêm ${formatNumber(findCode.money)}$`, event.threadID)
      findCode.number--
      findCode.user.push({
        userID: event.senderID
      })
      if(findCode.number <= 0){
         
        setTimeout(function() {
				api.sendMessage(`❎ Code: ${findCode.key}\nTrạng thái: Đã hết lượt nhập`,event.threadID)}, 500);
        data = data.filter(item => item.key !== findCode.key)
      }
     return fs.writeFileSync(path, JSON.stringify(data,null,4),'utf8')
    }
  }
  }catch(e){
    console.log(e)
  }
}

module.exports.run = async function ({ api, event, args }) {
  try{
  var data = JSON.parse(fs.readFileSync(path))
  const { ADMINBOT } = global.config;
  if (ADMINBOT.includes(event.senderID)) {
    const code = args[0].split(" ");
    const key = code[0].toLowerCase();
    const number = parseInt(code[1]);
    const money = String(code[2]);
    const findC = data.find(item=> item.key === key)
    if(findC) return api.sendMessage('❎ Code này đã có trong data', event.threadID)
    
    if (!key || !number || !money) {
        return api.sendMessage("❎ keyword không hợp lệ", event.threadID)
    } 
        data.push({ key, number, money, user: [] })
        fs.writeFileSync(path, JSON.stringify(data,null,4),'utf8')
        return api.sendMessage("✅ Tạo key thành công", event.threadID)
    
  }
  }catch(e){
    console.log(e)
  }
}

function formatNumber(number) {
  return number.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}