module.exports.config = {
  name: "2048",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Khoa x Nam",
  description: "2048",
  commandCategory: "Game",
  usages: "",
  cooldowns: 0
};

const fs = require("fs-extra");
const dirpath = __dirname + `/game2048/`;
const { loadImage, createCanvas } = require("canvas");
let __2048 = '2,4,8,16,32,64,128,256,512,1024,2048'.split(',');
let all_ô = {};

function findMax(map) {
  let mergedMap = [].concat(...map), max = mergedMap[0];
  for (let i = 1; i < mergedMap.length; i++) {
    if (mergedMap[i]> max) max = mergedMap[i];
  }
  return max;
}

function isGameOver(map) {
  let mergedMap = [].concat(...map);
  if (mergedMap.includes(0)) return false;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (i !== 4 - 1 && map[i][j] === map[i + 1][j]) return false;
      if (j !== 4 - 1 && map[i][j] === map[i][j + 1]) return false;
    }
  }
  return true;
}

async function draw(map,id) {
  const canvas = createCanvas(2500, 1500);
  const ctx = canvas.getContext('2d');
  let name = global.data.userName.get(id) || "getName error!";
  let score = [].concat(...map).reduce((a,b)=>a+b)
  let max = findMax(map);
  let background = await loadImage("https://raw.githubusercontent.com/KhoaDo472005/2048/main/board.png");
  ctx.drawImage(background, 0, 0, 2500, 1500);
  ctx.font = '82px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'white';
  ctx.shadowColor = "#000000";
  ctx.shadowBlur = 5;
  ctx.shadowOffstX = 5;
  ctx.shadowOffstY = 5;
  ctx.fillText(name, 320, 130, 600);
  ctx.font = '75px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(""+score, 2250, 110, 300);
  ctx.fillText(""+max, 2250, 210, 300);
  ctx.textAlign = 'center';
  ctx.font = '70px Arial';
  ctx.fillStyle = '#c2ff61';
  ctx.fillText(id, 320, 220, 600);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (map[i][j]==0) continue;
      let number = all_ô[map[i][j]];
      ctx.drawImage(number, 680+300*j, 205+300*i, 240, 240);
    }
  }
  let path = dirpath + id + ".png";
  fs.writeFileSync(path, canvas.toBuffer("image/png"));
  return path;
}

function delData(id) {
  if (fs.existsSync(dirpath + id + ".json")) fs.unlinkSync(dirpath + id + ".json");
  if (fs.existsSync(dirpath + id + ".png")) fs.unlinkSync(dirpath + id + ".png");
  return;
}

function createMap() {
  let map = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  const numberOfNumbers = Math.random() < 0.8 ? 2 : 3;
  for (let i = 0; i < numberOfNumbers; i++) {
    const row = Math.floor(Math.random() * 4);
    const col = Math.floor(Math.random() * 4);
    if (map[row][col] === 0) {
      map[row][col] = Math.random() < 0.8 ? 2 : 4;
    } else { i--; }
  }
  return map;
}

function move(currentMap, direction) {
  let map = [...currentMap];
  function moveLine(line) {
    let movedLine = line.filter(cell => cell !== 0);
    let emptyCells = line.length - movedLine.length;
    if (direction === 'd' || direction === 'r') movedLine.reverse();
    for (let i = 0; i < movedLine.length - 1; i++) {
      if (movedLine[i] === movedLine[i + 1]) {
        movedLine[i] = movedLine[i] * 2;
        movedLine[i + 1] = 0;
        emptyCells++;
      }
    }
    if (direction === 'd' || direction === 'r') movedLine.reverse();
    movedLine = movedLine.filter(cell => cell !== 0);
    let newLine = ['u','l'].includes(direction) ? movedLine.concat(Array(emptyCells).fill(0)): Array(emptyCells).fill(0).concat(movedLine);
    return newLine;
  }
  function moveMap(direction) {
    let newMap = [];
    if (direction === 'u' || direction === 'd') {
      for (let col = 0; col < map[0].length; col++) {
        let line = [];
        for (let row = 0; row < map.length; row++) {
          line.push(map[row][col]);
        }
        line = moveLine(line);
        for (let row = 0; row < map.length; row++) {
          newMap[row] = newMap[row] || [];
          newMap[row][col] = line[row];
        }
      }
    } else if (direction === 'l' || direction === 'r') {
      for (let row = 0; row < map.length; row++) {
        newMap[row] = moveLine(map[row]);
      }
    }
    return newMap;
  }
  return moveMap(direction);
}

module.exports.onLoad = () => {
  if (!fs.existsSync(dirpath)) fs.mkdirSync(dirpath);
  Promise.all(__2048.map($=>loadImage(`https://raw.githubusercontent.com/KhoaDo472005/2048/main/no${$}.png`))).then(imgs=>imgs.map(($, i)=>all_ô[__2048[i]] = $));
}

module.exports.run = async function ({ api, event }) {
  let { threadID, messageID, senderID } = event;
  let choose = ["1", "2","3"];
  let text = "Reply lựa chọn!\n1. Chơi mới\n2. Hướng dẫn";
  if (fs.existsSync(dirpath + senderID + ".json")) { choose.push("3"); text += "\n3. Chơi tiếp" }
  return api.sendMessage(text, threadID, (error, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      author: senderID,
      invalidC: choose,
      type: "procedure"
    })
  }, messageID)
}

module.exports.handleReply = async function ({ event, api, handleReply}) {
  let {sendMessage: send, unsendMessage: unsend} = api;
  let {threadID: tid, messageID: mid, senderID: sid, args} = event;
  if (sid !== handleReply.author) return;
  try {
    if (handleReply.type == "procedure") {
      if (!handleReply.invalidC.includes(event.body)) return send("❌ Lựa chọn không hợp lệ!", tid, mid);
      if (event.body == "1") {
        unsend(handleReply.messageID);
        let map = createMap();
        fs.writeFileSync(dirpath+`${sid}.json`, JSON.stringify(map, null, 2));
        return send({body:"Rep bằng kí tự ứng với hướng di chuyển!", attachment: fs.createReadStream(await draw(map, sid))}, tid, (error, info) => {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: sid,
            type: "play"
          })
        }, mid);
      }
      if (event.body == "2") return send(
        "Bạn cần phải sử dụng các kí tự U, D, L và R để di chuyển các ô vuông trong bảng.\n"+
        "Mục tiêu của trò chơi là kết hợp các ô vuông có cùng giá trị để tạo ra một ô vuông có giá trị 2048\n"+
        "Khi bảng đầy và không có hai ô liền kề nào bằng nhau, bạn thua!", tid, mid);
      if (event.body == "3") {
        try {
          unsend(handleReply.messageID);
          let map = JSON.parse(fs.readFileSync(dirpath+sid+".json"));
          return send({body:"Rep bằng kí tự ứng với hướng di chuyển!", attachment: fs.createReadStream(await draw(map, sid))}, tid, (error, info) => {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: sid,
              type: "play"
            })
          }, mid);
	    } catch (error) { return send(`⚠️ Đã xảy ra lỗi!\n Vui lòng thử lại hoặc chơi mới\nChi tiết lỗi:\n${error}`,tid,mid) }
      }
    }
    if (handleReply.type == "play") {
      let act = event.body.toLowerCase();
      if (!["u","d","l","r"].includes(act)) return send("⚠️ Lựa chọn không hợp lệ!\nu: lên trên\nd: xuống dưới\nl: sang trái\nr: sang phải",tid,mid);
      unsend(handleReply.messageID);
      let map = JSON.parse(fs.readFileSync(dirpath+sid+".json"));
      newMap = move(map, act);
      if ([].concat(...newMap).includes(2048)) return send({body:"🏆 Bạn đã thắng!", attachment: fs.createReadStream(await draw(newMap, sid))}, tid, ()=> delData(sid), mid);
      let text1 = [].concat(...map).join(" ");
      let text2 = [].concat(...newMap).join(" ");
      if (text1 !== text2) {
        let check = 1;
        while (check == 1) {
          let r = Math.floor(Math.random() * 4);
          let c = Math.floor(Math.random() * 4);
          if (newMap[r][c] == 0) {
            newMap[r][c] = Math.random() < 0.8 ? 2 : 4;
            check++;
          }
	    }
      }
      if (isGameOver(newMap)) return send({body:"Trò chơi kết thúc!", attachment: fs.createReadStream(await draw(newMap, sid))}, tid, ()=> delData(sid), mid);
      fs.writeFileSync(dirpath+`${sid}.json`, JSON.stringify(newMap, null, 2));
      return send({body:"Rep bằng kí tự ứng với hướng di chuyển!", attachment: fs.createReadStream(await draw(newMap, sid))}, tid, (error, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: sid,
          type: "play"
        })
      }, mid);
    } 
  } catch(error) { return send("⚠️ Đã xảy ra lỗi!"+error, tid, mid); };
}