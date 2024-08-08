class SlotGame {
  constructor(config) {
    this.config = config;
  }

  async run({
    api: {
      sendMessage,
      setMessageReaction,
      unsendMessage,
    },
    event: { threadID, messageID, senderID },
    Currencies: { setData, getData, increaseMoney },
    args: [fruit, betAmount],
  }) {
    var url = (a) => get(a, { responseType: "stream" }).then((r) => r.data),
      URL = (a, b) =>
        get(a, { responseType: "stream" }).then(
          (r) => ((r.data.path = `tmp.${b}`), r.data)
        ),
      read = (a) => readFileSync(a, "utf8"),
      write = (a, b) => writeFileSync(a, b, "utf8"),
      parse = (a) => JSON.parse(read(a)),
      have = (a) => existsSync(a),
      ify = (a, b) => write(a, JSON.stringify(b, null, 1)),
      int = parseInt,
      float = parseFloat,
      big = BigInt,
      incl = (a, b) => a.includes(b),
      number = (a) => a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      random = (a) => Math.floor(Math.random() * a),
      random2 = (a) => a[Math.floor(Math.random() * a.length)],
      lower = (a) => a.toLowerCase(),
      string = (a) => a.toString(),
      lth = (a) => a.length;

    const fruitIcons = {
      nho: "🍇",
      dưa: "🍉",
      táo: "🍏",
      777: "7️⃣",
      dâu: "🍓",
      đào: "🍑",
    };

    const fruits = Object.keys(fruitIcons);

    const { money } = await getData(senderID);

    const send = (message, callback) =>
      sendMessage(message, threadID, callback ? callback : messageID);

    if (incl(fruits, fruit)) {
      if (!int(betAmount) && betAmount != "all" && !betAmount.endsWith("%"))
        return send("❎ Tiền cược không hợp lệ");

      let bet = big(
        betAmount == "all"
          ? money
          : betAmount.endsWith("%")
          ? (money / big(100)) * big(betAmount.split("%")[0])
          : betAmount
      );

      if (bet < 50 || bet > money)
        return send(
          bet < 50 ? "❎ Vui lòng cược ít nhất 50$" : "❎ Bạn không đủ tiền"
        );

      let [result1, result2, result3] = Array.from({ length: 3 }, () =>
        random2(fruits)
      );

      let results = [result1, result2, result3];

      let matchingFruits = lth(results.filter((r) => r == fruit));

      setData(senderID, {
        money: money + (matchingFruits == 0 ? -bet : bet * big(matchingFruits)),
      });

      send("🎰 Đang quay slot...", (message, callback) => {
        /*let sendReactionAndMessage = (delay, reaction) => setTimeout(() => {
                    setMessageReaction(reaction, callback.messageID, function (e, data) {
                       if(e) return console.log(e)
});
                }, delay * 1000);

                sendReactionAndMessage(1, "5️⃣");
                sendReactionAndMessage(1, "4️⃣");
                sendReactionAndMessage(1, "3️⃣");
                sendReactionAndMessage(1, "2️⃣");
                sendReactionAndMessage(1, "1️⃣");
                sendReactionAndMessage(1, "0️⃣");*/

        setTimeout(() => unsendMessage(callback.messageID), 4500);

        setTimeout(
          () =>
            send(
              `🎭 Có ${matchingFruits} ${
                fruitIcons[fruit]
              }\n🎰 Kết quả: ${results
                .map((r) => `${fruitIcons[r]}`)
                .join(" | ")}\n${
                incl(results, fruit) ? "🎉 Bạn đã thắng" : "💸 Bạn đã thua"
              }: ${incl(results, fruit) ? "+" : "-"}${number(
                matchingFruits == 0 ? bet : bet * big(matchingFruits)
              )}$`
            ),
          5000
        );
      });
    } else {
      send("❎ Bạn chưa đặt cược");
    }
  }
}

module.exports = new SlotGame({
  name: "slot",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "Niio-team (Quất)", // format code như cặc by BraSL
  description: "Đánh bạc bằng hình thức hoa quả",
  commandCategory: "Game",
  usages:
    "slot [nho/dưa/táo/777/dâu/đào] + số tiền cược lưu ý số tiền cược phải trên 50$",
  cooldowns: 0,
});
