module.exports.config = {
	name: "locmemdie",
	version: "1.0.0",
	hasPermssion: 1,
	credits: "ProCoderMew",
	description: "Lọc người dùng Facebook",
	commandCategory: "Nhóm",
	usages: "",
	cooldowns: 0
};

module.exports.run = async function({ api, event }) {
    var { userInfo, adminIDs } = await api.getThreadInfo(event.threadID);    
    var success = 0, fail = 0;
    var arr = [];
    for (const e of userInfo) {
        if (e.gender == undefined) {
            arr.push(e.id);
        }
    };

    adminIDs = adminIDs.map(e => e.id).some(e => e == api.getCurrentUserID());
    if (arr.length == 0) {
        return api.sendMessage("❎ Trong nhóm không tồn tại tài khoản bị khóa", event.threadID);
    }
    else {
        api.sendMessage("🔎 Nhóm bạn hiện có " + arr.length + " tài khoản bị khoá", event.threadID, function () {
            if (!adminIDs) {
                api.sendMessage("❎ Nhưng bot không phải là quản trị viên nên không thể lọc", event.threadID);
            } else {
                api.sendMessage("🔄 Bắt đầu lọc...", event.threadID, async function() {
                    for (const e of arr) {
                        try {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            await api.removeUserFromGroup(parseInt(e), event.threadID);   
                            success++;
                        }
                        catch {
                            fail++;
                        }
                    }
                  
                    api.sendMessage("✅ Đã lọc thành công " + success + " tài khoản", event.threadID, function() {
                        if (fail != 0) return api.sendMessage("❎ Lọc thất bại " + fail + " tài khoản", event.threadID);
                    });
                })
            }
        })
    }
}