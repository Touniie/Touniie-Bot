const axios = require("axios");

module.exports.config = {
  name: "tiente",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Q.Huy",
  description: "Chuyển đổi tiền tệ bằng API trực tuyến",
  commandCategory: "Tìm kiếm",
  cooldowns: 5,
  usages: "[amount] [fromCurrency] [toCurrency]",
};

module.exports.run = async function ({ api, event, args }) {
  const amount = parseFloat(args[0]);
  const fromCurrency = args[1];
  const toCurrency = args[2];

  if (isNaN(amount) || !fromCurrency || !toCurrency) {
    api.sendMessage("❎ Vui lòng cung cấp số tiền hợp lệ, từ tiền tệ quy đổi tiền tệ theo quốc gia yêu cầu!", event.threadID);
    return;
  }

  try {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    const exchangeRates = response.data.rates;
    if (toCurrency in exchangeRates) {
      const convertedAmount = (amount * exchangeRates[toCurrency]).toFixed(2);
      api.sendMessage(`✅ ${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`, event.threadID);
    } else {
      api.sendMessage("⚠️ Mã tiền tệ được cung cấp không hợp lệ!", event.threadID);
    }
  } catch (error) {
    console.error("⚠️ Lỗi khi tìm nạp tỷ giá hối đoái:", error);
    api.sendMessage("⚠️ Đã xảy ra lỗi khi tìm nạp tỷ giá hối đoái.", event.threadID);
  }
};