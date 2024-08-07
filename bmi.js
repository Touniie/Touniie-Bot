module.exports.config = {
    name: "bmi",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "tdong",
    description: "Tính toán chỉ số BMI của bạn",
    commandCategory: "Tiện ích",
    usages: "chiều cao + cân nặng",
    cooldowns: 5
};

module.exports.run = async function({ api , event , args , Users }) {
    const { threadID , messageID , senderID } = event;
    if (!args[0] || !args[1]) return api.sendMessage(`❎ Vui lòng dùng ${global.config.PREFIX}bmi + chiều cao + cân nặng để tính chỉ số BMI của bạn!\n📌 Ví dụ: ${global.config.PREFIX}bmi 1.70 50`, threadID, messageID);
    if (isFinite(args[0]) == false) return api.sendMessage('⚠️ Chiều cao không đúng định dạng!', threadID, messageID);
    if (isFinite(args[1]) == false) return api.sendMessage('⚠️ Cân nặng không đúng định dạng!', threadID, messageID);
    var rawHeight = parseFloat(args[0]);
    var weight = parseFloat(args[1]);
    if (rawHeight < 0 || weight < 0) return api.sendMessage('What the fuck', threadID, messageID);
    if (rawHeight < 3) {
        var height = rawHeight;
    } else if (rawHeight >= 3) {
        var height = rawHeight / 100;
    };
    const name = await Users.getNameUser(senderID);
    var rawbmi = weight / ( height * height );
    var bmi = rawbmi.toFixed(2);
    if (bmi < 15) {
        var bodyState = 'Thiếu cân rất nặng';
    } else if (bmi >= 15 && bmi < 16) {
        var bodyState = 'Thiếu cân nặng';
    } else if (bmi >= 16 && bmi < 18.5) {
        var bodyState = 'Thiếu cân';
    } else if (bmi >= 18.5 && bmi < 25) {
        var bodyState = 'Bình thường';
    } else if (bmi >= 25 && bmi < 30) {
        var bodyState = 'Tiền béo phì';
    } else if (bmi >= 30 && bmi < 35) {
        var bodyState = 'Béo phì độ I';
    } else if (bmi >= 35 && bmi < 40) {
        var bodyState = 'Béo phì độ II';
    } else if (bmi >= 40) {
        var bodyState = 'Béo phì độ III';
    };
    api.sendMessage(`👤 Tên: ${name}\n📏 Chiều cao: ${height} mét\n⚖️ Cân nặng: ${weight} kilograms\n📝 Chỉ số BMI: ${bmi}\n✏️ Tình trạng sức khoẻ: ${bodyState}`, threadID, messageID);
};