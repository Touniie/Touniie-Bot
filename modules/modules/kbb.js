const { get: p } = require('axios'), i = url => p(url, { responseType: 'stream' }).then(r => r.data),
  { tz: t } = require("moment-timezone"), tm = t("Asia/Ho_Chi_Minh").format('HH:mm:ss || DD/MM/YYYY'),
  a = [
    'https://i.imgur.com/4Hfduoe.png',
    'https://i.imgur.com/EHsr9RL.png',
    'https://i.imgur.com/Xuw6yG8.png'
  ],
  b = [
    'https://i.imgur.com/YPhfjfU.png',
    'https://i.imgur.com/mahn5lm.png',
    'https://i.imgur.com/cEivriJ.png'
  ]
module.exports.config = {
  name: "kbb",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "quất",
  description: "",
  commandCategory: "Game",
  usages: "[từ khoá]",
  cooldowns: 0
};
module.exports.run = async function ({ api: ap, event: e, args: ar, Currencies: C, Users: U }) {
  const { threadID: $, senderID: sd } = e, { sendMessage: s } = ap, { increaseMoney: $$, getData: g } = C, { getNameUser: nm } = U
  var kbb = ['kéo', 'búa', 'bao'], rd = kbb[Math.floor(Math.random() * kbb.length)], data = (await g(sd)).data || {};
  ra = ar[0] == 'kéo' ? 0 : ar[0] == 'búa' ? 1 : 2, rb = rd == 'kéo' ? 0 : rd == 'búa' ? 1 : 2, w = 'https://i.imgur.com/tYFcqjH.png', l = 'https://i.imgur.com/4QBP4bC.png', d = 'https://i.imgur.com/AYhzVjZ.png',
    M = (await g(sd)).money, m = ar[1] == 'all' ? M : parseFloat(ar[1]), ip = parseFloat(ar[1]), wn = 1000 + M + m, ls = 1000 + M - m, dr = M + 1000, n = await nm(sd)
  if (!ar[0] || !parseFloat(ar[1]) && ar[1] != 'all') { return s('Vui lòng chọn kéo búa hoặc bao và cược tiền', $) }
  switch (ar[0]) {
    case 'kéo': {
      var _ = rd == 'bao' ? 'thắng' : rd == 'búa' ? 'thua' : 'hòa', dn = _ == 'thắng' ? `nhận: ${m}$\n> Hiện bạn còn: ${wn}$` : _ == 'thua' ? `mất: ${m}$\n> Hiện bạn còn: ${ls}$` : `giữ lại: ${m}$\n> Hiện bạn còn: ${dr}$`,
      at = [await i(a[ra]), await i(_ == 'thắng' ? w : _ == 'thua' ? l : d), await i(b[rb])]
      await $$(sd, parseFloat(_ == 'thắng' ? m : _ == 'thua' ? -m : 0));
      return s({ body: `> Người chơi: ${n}\n> Lúc: ${tm}\n> Kết quả: ${_}\n> Bạn đưa ra: ${ar[0]}\n> Bot đưa ra: ${rd}\n> Bạn ${dn}`, attachment: at }, $)
    }
    case 'búa': {
      var _ = rd == 'kéo' ? 'thắng' : rd == 'bao' ? 'thua' : 'hòa', dn = _ == 'thắng' ? `nhận: ${m}$\n> Hiện bạn còn: ${wn}$` : _ == 'thua' ? `mất: ${m}$\n> Hiện bạn còn: ${ls}$` : `giữ lại: ${m}$\n> Hiện bạn còn: ${dr}$`,
      at = [await i(a[ra]), await i(_ == 'thắng' ? w : _ == 'thua' ? l : d), await i(b[rb])]
      await $$(sd, parseFloat(_ == 'thắng' ? m : _ == 'thua' ? -m : 0));
      return s({ body: `> Người chơi: ${n}\n> Lúc: ${tm}\n> Kết quả: ${_}\n> Bạn đưa ra: ${ar[0]}\n> Bot đưa ra: ${rd}\n> Bạn ${dn}`, attachment: at }, $)
    }
    case 'bao': {
      var _ = rd == 'búa' ? 'thắng' : rd == 'kéo' ? 'thua' : 'hòa', dn = _ == 'thắng' ? `nhận: ${m}$\n> Hiện bạn còn: ${wn}$` : _ == 'thua' ? `mất: ${m}$\n> Hiện bạn còn: ${ls}$` : `giữ lại: ${m}$\n> Hiện bạn còn: ${dr}$`,
      at = [await i(a[ra]), await i(_ == 'thắng' ? w : _ == 'thua' ? l : d), await i(b[rb])]
      await $$(sd, parseFloat(_ == 'thắng' ? m : _ == 'thua' ? -m : 0));
      return s({ body: `> Người chơi: ${n}\n> Lúc: ${tm}\n> Kết quả: ${_}\n> Bạn đưa ra: ${ar[0]}\n> Bot đưa ra: ${rd}\n> Bạn ${dn}`, attachment: at }, $)
    }
  }
}