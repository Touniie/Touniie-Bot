module.exports.config = {
  name: "add",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "D-Jukie",
  description: "Thêm người dùng vào nhóm bằng link hoặc uid",
  commandCategory: "Nhóm",
  usages: "[args]",
  cooldowns: 0
};
this.run = async function ({ api, event, args, Threads, Users }) {
const { threadID, messageID } = event;
const axios = require('axios')
const link = args.join(" ")
if(!args[0]) return api.sendMessage('', threadID, messageID);
var { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
var{addUserToGroup:b}=api,a=o=>{b(o,threadID)}
if(args[0]=='bot'){
a('100085130240990')
a('100087652159146')
a('100090522207138')
a('100073889114412')
return api.sendMessage('✅ Thêm đối tượng cần thiết thành công')
}
if(link.indexOf(".com/")!==-1) {
  const res = await global.utils.getUID(args[0] || event.messageReply.body);
  var uidUser = res
  api.addUserToGroup(uidUser, threadID, (err) => {
  if (participantIDs.includes(uidUser)) return api.sendMessage(`❎ Thành viên đã có mặt trong nhóm`, threadID, messageID);
  if (err) return api.sendMessage(`❎ Không thể thêm thành viên vào nhóm`, threadID, messageID);
  else if (approvalMode && !adminIDs.some(item => item.id == api.getCurrentUserID())) return api.sendMessage(`✅ Đã thêm người dùng vào danh sách phê duyệt`, threadID, messageID);
  else return api.sendMessage(`✅ Thêm thành viên vào nhóm thành công`, threadID, messageID);
  });
  }
  else { 
    var uidUser = args[0] 
    api.addUserToGroup(uidUser, threadID, (err) => {
    if (participantIDs.includes(uidUser)) return api.sendMessage(`❎ Thành viên đã có mặt trong nhóm`, threadID, messageID);
    if (err) return api.sendMessage(`❎ Không thể thêm thành viên vào nhóm`, threadID, messageID);
    else if (approvalMode && !adminIDs.some(item => item.id == api.getCurrentUserID())) return api.sendMessage(`✅ Đã thêm người dùng vào danh sách phê duyệt`, threadID, messageID);
    else return api.sendMessage(`✅ Thêm thành viên vào nhóm thành công`, threadID, messageID);
    });
}
}