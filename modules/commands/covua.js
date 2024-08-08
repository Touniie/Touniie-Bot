const config = {
  name: "covua",
  version: "1.1.1",
  hasPermssion: 0,
  credits: "BraSL",
  description: "play chess game on bot",
  commandCategory: "Game",
  usages: "[]",
  cooldowns: 3,
};

const fs = require("fs");
const axios = require("axios");

const color = ["black", "white"];

const urlAPI = `http://localhost:3143`;
const apiKey = "ngu";

const onLoad = () => {
  if (!global.moduleData.chess) {
    global.moduleData.chess = new Map();
  }
};

const run = async function ({ api, event, args, Users }) {
  var { senderID, threadID, messageID } = event;
  var send = (data) => api.sendMessage(data, threadID, messageID);
  switch (String(args[0])) {
    case "create":
    case "Create":
    case "c":
      {
        var getData = global.moduleData.chess.get(threadID) || {};
        if (global.moduleData.chess.has(threadID)) {
          return send(`⚠️ Nhóm đang có bàn cờ vua!`, threadID, messageID);
        }
        global.moduleData.chess.set(threadID, {
          author: senderID,
          start: 0,
          type: 2,
          player: [],
        });
        global.AuthThread = threadID;
        return send(
          `✅ Đã Tạo Thành Công Bàn Cờ Vua, 2 Người Chơi Hãy bấm "/covua join" Để Tham Gia!`
        );
      }
      break;
    case "check":
    case "Check":
      {
        var getData = global.moduleData.chess.get(threadID) || {};
        return send(`📌 Trạng thái: ${getData.player.length}/${getData.type}`);
      }
      break;
    case "join":
    case "Join":
      {
        var getData = global.moduleData.chess.get(threadID) || {};
        if (!getData.player) {
          return send(`⚠ Hiện Tại Chưa Có Bàn Cờ Nào!`);
        }
        if (getData.player.length >= getData.type) {
          return send(`⚠ Hiện Tại Phòng Đã Đầy!`);
        }
        if (getData.player.find((i) => i.id == senderID)) {
          return send(`⚠ Bạn Đã Tham Gia Rồi!`);
        }
        if (!getData) {
          return send(`⚠ Hiện Tại Chưa Có Ván Cờ Nào Được Mở!`);
        }
        if (getData.start == 1) {
          return send(`⚠ Đã Bắt Đầu Ván Cờ!`);
        }
        getData.player.push({
          id: senderID,
          color: "",
        });

        global.moduleData.chess.set(threadID, getData);
        send(`📌 Trạng thái: ${getData.player.length}/${getData.type}`);
        // if (getData.player.length === getData.type) {
        //   getPlayer(threadID);
        // }
      }
      break;
    case "chiavai":
    case "Chiavai":
      {
        var getData = global.moduleData.chess.get(threadID) || {};
        if (!getData.player) {
          return send(`⚠ Hiện Tại Chưa Có Bàn Cờ Nào!`);
        }
        if (!getData) {
          return send(`⚠ Hiện Tại Chưa Có Ván Cờ Nào Được Mở!`);
        }
        if (getData.start == 1) {
          return send(`⚠ Đã Bắt Đầu Ván Cờ!`);
        }

        if (getData.player.length === getData.type) {
          const tttc = await getPlayer(threadID, api);

          var msg = `Thông tin người chơi:`,
            num = 1;
          for (const i of getData.player) {
            let nameSender = await Users.getNameUser(i.id);
            msg += `\n${num++}. ${nameSender}: ${i.color}`;
          }
          msg += "\n" + tttc;
          return send(msg);
        }
      }
      break;
    case "leave":
    case "Leave":
      {
        var getData = global.moduleData.chess.get(threadID) || {};
        if (typeof getData.player == undefined) {
          return send(`❎ Nhóm Này Không Có Bàn Cờ Vua Nào!`);
        }
        if (!getData.player.some((i) => i.id == senderID)) {
          return send(`❎ Bạn chưa tham gia vào bàn cờ vua trong nhóm này!`);
        }
        if (getData.start == 1) {
          return send(`❎ Bàn Cờ Vua Nhóm Này Đã Bắt Đầu!`);
        }
        if (getData.author == senderID) {
          global.moduleData.chess.delete(threadID);
          send(`📌 Chủ game đã rời khỏi game tiến hành hủy ván`);
        } else {
          getData.player.splice(
            getData.player.findIndex((i) => i.id === senderID),
            1 ? 1 : 11
          );
          send(`⚠ Bạn Đã Rời Khỏi Bàn Cờ Vua Thành Công!`);
          global.moduleData.chess.set(threadID, getData);
        }
      }
      break;
    case "end":
    case "End":
      {
        var getData = global.moduleData.chess.get(threadID) || {};
        if (typeof getData.player == undefined) {
          return send(`⚠ Nhóm Này Không Có Bàn Cờ Vua Nào!`);
        }
        if (getData.author == senderID) {
          global.moduleData.chess.delete(threadID);
          const end = await endChess(threadID);
          if (!end) return send(`Đã xảy ra lỗi khi kết thúc bàn cờ!`);
          send(`Đã kết thúc bàn cờ!`);
        }
      }
      break;
    case "start":
    case "Start":
    case "s":
      {
        var getData = global.moduleData.chess.get(threadID) || {};
        if (!getData) {
          return send(`Hiện Tại Chưa Có Ván Cờ Vua Nào Được Mở!`);
        }
        if (senderID == getData.author) {
          if (
            getData.player.length <= 1 ||
            getData.player.length != getData.type
          ) {
            return send(
              `Đang Thiếu Người, Hiện Tại Có :${getData.player.length}/${getData.type} Người!`
            );
          }
          if (getData.start == 2) {
            return send(`Đã Bắt Đầu Rồi.`);
          }
          getData.start = 1;
          let nameSender1 = await Users.getNameUser(getData.player[0].id);
          let nameSender2 = await Users.getNameUser(getData.player[1].id);
          var idBoard = threadID;
          createBoard(idBoard, api, getData, nameSender1, nameSender2);
        }
      }
      break;
    case "help":
    case "Help":
    case "h":
      {
        var form = {
          body: "",
          attachment: [],
        };
        form.body = `Cột (File): Chữ cái từ a đến h đại diện cho các cột trên bàn cờ, từ trái sang phải.\nHàng (Rank): Số từ 1 đến 8 đại diện cho các hàng trên bàn cờ, từ dưới lên trên.\n\nVí dụ cho quân tốt ở cột e lên 2 bước ta nhập e2 e4 (như ảnh minh họa)\n\nCách phong tốt\n\n"q": Hậu (Queen) \n"r": Xe (Rook) \n"n": Ngựa (Knight) \n"b": Tượng (Bishop)\n\nVí dụ: a7 a8 q (phong hậu cho tốt)`;
        form.attachment.push(
          (
            await axios.get("https://i.imgur.com/4rptn8B.jpg", {
              responseType: "stream",
            })
          ).data
        );
        form.attachment.push(
          (
            await axios.get("https://i.imgur.com/Qil7Hjs.jpg", {
              responseType: "stream",
            })
          ).data
        );
        form.attachment.push(
          (
            await axios.get("https://i.imgur.com/hfexLc8.jpg", {
              responseType: "stream",
            })
          ).data
        );
        api.sendMessage(form, threadID);
      }
      break;
    default:
      return send(
        `[ Game Cờ Vua Online ]\n\n📌 Hướng Dẫn Sử Dụng:\n${global.config.PREFIX}${this.config.name} create → Tạo bàn chơi.\n${global.config.PREFIX}${this.config.name} join → Tham gia vào bàn cờ.\n${global.config.PREFIX}${this.config.name} chiavai → Tự động chia vai cho 2 người chơi.\n${global.config.PREFIX}${this.config.name} start → Bắt đầu ván cờ vua.\n${global.config.PREFIX}${this.config.name} leave → Rời khỏi bàn chơi.\n${global.config.PREFIX}${this.config.name} end → Kết thúc ván cờ.\n${global.config.PREFIX}${this.config.name} check → Kiểm tra thông tin tham gia.\n${global.config.PREFIX}${this.config.name} help → Hướng dẫn cách chơi.`
      );
  }
};

const handleReply = async function ({ api, event, args, handleReply }) {
  const { senderID, threadID, messageReply } = event;
  const { type } = handleReply;
  var [from, to, promotion] = event.args;
  const id = global.AuthThread;

  try {
    var getData = global.moduleData.chess.get(threadID) || {};
    var dataPlayer = getData.player;
    const dataUser = dataPlayer.find((item) => item.id === senderID);
    var data = dataUser.color === "white" ? "w" : "b";

    if (type === "b") {
      from = convertCoordinate(from);
      to = convertCoordinate(to);
    }
    console.log(from, to);
    var query = "?from=" + from.toLowerCase() + "&to=" + to + "&key=" + apiKey;
    if (promotion) {
      query =
        "?from=" +
        from.toLowerCase() +
        "&to=" +
        to +
        "&promotion=" +
        promotion +
        "&key=" +
        apiKey;
    }

    const forms = {
      method: "POST",
      url: urlAPI + "/api/move/" + id + query,
      data: { pro: process.env },
    };

    if (data === type) {
      try {
        const res = await axios(forms);
        var form = {
          body: "",
          attachment: [],
        };

        if (!res.data.status) {
          if (res.data.game === "end") {
            api.sendMessage(
              `Bàn cờ đã kết thúc\nWin: ${
                res.data.win === "w" ? "black" : "white"
              }\nTrạng thái game: ${res.data.message}`,
              id
            );
            const endG = await endChess(id);
            if (!endG) return api.sendMessage("Lỗi khi xóa bàn cờ!", id);
            global.moduleData.chess.delete(threadID);
            return api.sendMessage("Đã tiến hành xóa bàn cờ thành công", id);
          }
          return api.sendMessage(res.data.message, id);
        }

        api.unsendMessage(messageReply.messageID);
        var msg = "[ Trạng Thái Của Game ]";
        msg += `\n✅ Bên ${
          res.data.play === "w" ? "đen" : "trắng"
        } đã đi\n📌 Đến lượt bên ${res.data.play === "w" ? "trắng" : "đen"}`;
        form.body = msg;
        form.attachment.push(
          (
            await axios.get(res.data.url, {
              responseType: "stream",
            })
          ).data
        );
        return api.sendMessage(form, id, (error, info) => {
          if (error) {
            return api.sendMessage("Đã xảy ra lỗi trong quá trình chơi", id);
          } else {
            global.client.handleReply.push({
              name: config.name,
              messageID: info.messageID,
              type: res.data.play,
            });
          }
        });
      } catch (e) {
        console.log(e.response);
        return api.sendMessage(e.response.data, id);
      }
    } else {
      return api.sendMessage(
        "đây là lượt của bên " + (type === "w" ? "white" : "black"),
        id
      );
    }
  } catch (e) {
    console.log(e);
    return api.sendMessage("Đã xảy ra lỗi", id);
  }
};

async function createBoard(id, api, getData, nameSender1, nameSender2) {
  try {
    let colorSender1 = getData.player[0].color;
    let colorSender2 = getData.player[1].color;

    const forms = {
      method: "POST",
      url: urlAPI + "/api/board/" + id + "?key=" + apiKey,
      data: { pro: process.env },
    };

    const res = await axios(forms);
    var form = {
      body: "",
      attachment: [],
    };
    if (!res.data.status) {
      if (res.data.game === "end") {
        return api.sendMessage(res.data.message, id);
      }
      return api.sendMessage(res.data.message, id);
    }
    var msg = `[ Bắt Đầu Thành Công ]\n──────────────`;
    msg += `\n👤 ${nameSender1}: Bên ${colorSender1}\n👤 ${nameSender2}: Bên ${colorSender2}\n\n`;
    form.body = msg;
    form.attachment.push(
      (
        await axios.get(res.data.url, {
          responseType: "stream",
        })
      ).data
    );
    return api.sendMessage(form, id, (error, info) => {
      if (error) {
        return api.sendMessage("Đã xảy ra lỗi trong quá trình chơi!", id);
      } else {
        global.client.handleReply.push({
          name: config.name,
          messageID: info.messageID,
          type: getData.play,
        });
      }
    });
  } catch (e) {
    console.log(e);
    return api.sendMessage("Đã xảy ra lỗi trong quá trình tạo bàn", id);
  }
}

async function getPlayer(id, api) {
  try {
    var getData = global.moduleData.chess.get(id) || {};
    const jsonString = JSON.stringify(getData.player);
    const bufferData = Buffer.from(jsonString, "utf8");
    const base64String = bufferData.toString("base64");
    const res = await axios.get(
      urlAPI +
        "/api/player/" +
        id +
        "?player=" +
        base64String +
        "&key=" +
        apiKey,
      { data: { pro: process.env } }
    );
    if (res.data.status) {
      getData.player = res.data.resul;
      getData.play = res.data.start;
      global.moduleData.chess.set(id, getData);
      return res.data.message;
    }
  } catch (e) {
    console.log(e);
    return api.sendMessage("Đã xảy ra lỗi khi phân vai", id);
  }
}

function convertCoordinate(coordinate) {
  const colMapping = {
    a: "h",
    b: "g",
    c: "f",
    d: "e",
    e: "d",
    f: "c",
    g: "b",
    h: "a",
  };

  const col = colMapping[coordinate[0].toLowerCase()];
  const row = 9 - parseInt(coordinate[1]);
  return col + row;
}

async function endChess(id) {
  try {
    const res = (
      await axios.delete(
        urlAPI + "/api/board/remove/" + id + "?key=" + apiKey,
        { data: { pro: process.env } }
      )
    ).data;
    if (res.status) {
      return true;
    } else return false;
  } catch (e) {
    return false;
  }
}

module.exports = {
  config,
  onLoad,
  run,
  handleReply,
};
