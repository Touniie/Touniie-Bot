
module.exports.config = {
  name: "enc",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "NLam182",
  description: "encode obf!",
  commandCategory: "Admin",
  cooldowns: 2,
  dependencies: {}
};
const l = require("axios");
const f = require("fs-extra");
module.exports.run = async ({
  event: b,
  api: e,
  args: d
}) => {
  if (this.config.credits !== "NLam182") {
    console.log("\u001b[33m[ WARN ]\u001b[37m » Đổi credits con cặc đjt mẹ mày luôn đấy con chó:))");
    return api.sendMessage("[ WARN ] Phát hiện người điều hành bot " + global.config.BOTNAME + " đổi credits modules \"" + this.config.name + "\"", event.threadID);
  }
  if (d.length < 2) {
    return e.sendMessage("❎ Vui lòng cung cấp đủ thông tin <link> <số lần> để sử dụng lệnh!\nEx: -enc https://raw.linkmodule 3\nvới 3 là số lần enc", b.threadID);
  }
  const a = d[0];
  const c = d[1];
  if (parseInt(c) > 5) {
    return e.sendMessage("⚠️ Số lần không thể vượt quá 5!", b.threadID);
  }
  const g = [];
  g.push(Date.now());
  await e.sendMessage("Đang tiến hành enc, hãy chờ...", b.threadID);
  const h = "https://hehe.zeidteam.repl.co/enc?link=" + a + "&solan=" + c;
  const i = await l.get(h);
  if (!i.data || !i.data.obfuscatedCode) {
    return e.sendMessage("⚠️ Không thể lấy mã obfuscated từ API!", b.threadID);
  }
  const j = i.data.obfuscatedCode;
  f.writeFileSync("enc.txt", j, "utf8");
  e.sendMessage({
    body: "✅ Đã obfuscate thành công " + c + " lần và gửi dữ liệu vào tệp enc.txt!\n⏰ Thời gian xử lý: " + Math.floor((Date.now() - g[0]) / 1000) + " giây",
    attachment: f.createReadStream("enc.txt")
  }, b.threadID, (a, b) => {
    f.unlinkSync("enc.txt");
  });
};