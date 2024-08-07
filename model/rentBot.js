const fs = require("fs-extra");
const { join } = require("path");
const logger = require("../utils/log.js");

var pathRent = join(
  process.cwd(),
  "modules",
  "commands",
  "data",
  "thuebot.json"
);

function checkExpiration(time_end) {
  const form_mm_dd_yyyy = (input = "", split = input.split("/")) =>
    `${split[1]}/${split[0]}/${split[2]}`;
  const expirationTime = new Date(form_mm_dd_yyyy(time_end)).getTime();
  const currentTime = Date.now() + 25200000;

  return expirationTime >= currentTime ? true : false;
}

module.exports = async function(api) {
    logger("Bắt đầu check Data Rent...", "[ RENT ] >");
    var data = JSON.parse(fs.readFileSync(pathRent, "utf-8")),
        listThreadID = [];

    data.map(async ($) => {
        var check = checkExpiration($.time_end);
        if (!check) listThreadID.push($.t_id);
    });

    data = data.filter(($) => !listThreadID.includes($.t_id));
    fs.writeFileSync(pathRent, JSON.stringify(data, null, 2), "utf-8");

    var spam = (await api.getThreadList(100, null, ["OTHER"])) || [];
    var pending = (await api.getThreadList(100, null, ["PENDING"])) || [];
    const list = [...spam, ...pending]
        .filter((group) => group.isSubscribed && group.isGroup)
        .map((group) => group.threadID);

    var checkP = data.map(($$) => $$.t_id);
    list.map(($) => {
        var checkId = checkP.includes($);
        if (!checkId) listThreadID.push($);
    });

    if (listThreadID.length > 0) {
        for (const id of listThreadID) {
            api.sendMessage(
                `❎ Vui lòng liên hệ Admin để thuê bot\nhttps://www.facebook.com/100042167594620`,
                id
            );
            await new Promise((resolve) => setTimeout(resolve, 1000));
            api.removeUserFromGroup(api.getCurrentUserID(), id);
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        return logger(`Đã xóa thành công ${listThreadID.length} nhóm`, "[ RENT ] >");
    }
    logger("Không có Thread hết hạn!", "[ RENT ] >");
};
