/*
- Uptime tự động trên replit
- Hỗ trợ cho replit free
- Có thể bật tắt tính năng
- Thay đổi tên phía dưới config để hệ thống dễ nhận dạng nhé!
- Code by D-Jukie vui lòng không thay đổi credits, tks!
*/

const axios = require("axios");
const logger = require("./log");

const config = {
	status: true,
	name: 'Disme Project'
};

if(config.status == false) return
var username = process.env.REPL_OWNER
if(username !== undefined) {
	var urlRepl = `https://${process.env.REPL_SLUG}.${username}.repl.co`;
	logger('Bạn đang chạy bot ở link: ' + urlRepl, '[ CHECK HOST ]');
	if(process.env.REPLIT_CLUSTER == 'hacker') return logger('Bạn đang dùng Replit Hacker, hãy nhớ bật "Always On" để BOT luôn chạy nhé!', '[ CHECK HOST ]');
	logger('Bạn đang dùng Replit thường, hệ thống sẽ tự động kết nối với UptimeRobot cho bạn!', '[ CHECK HOST ]');
	connectUptime(urlRepl, username);
};
async function connectUptime(url, name) {
	try {
		axios.get(`https://api.phamvandien.xyz/uptimerobot?url=${url}&key=${username}&monitor=${config.name}`)
		logger('Đã hoàn thành kết nối Uptime cho bạn!', '[ UPTIME ]');
	}
	catch {
		logger('Server Uptime gặp sự cố, không thể bật uptime cho bạn!', '[ UPTIME ]');
	}	
};