const { spawn } = require("child_process");
const { readFileSync } = require("fs-extra");
let http = require('http');
const axios = require("axios");
var deviceID = require('uuid');
var adid = require('uuid');
const totp = require('totp-generator');
const semver = require("semver");
const logger = require("./utils/log");
const chalk1 = require('chalk');
const chalk = require('chalkercli');
var job = [
"FF9900","FFFF33","33FFFF","FF99FF","FF3366","FFFF66","FF00FF","66FF99","00CCFF","FF0099","FF0066","0033FF","FF9999","00FF66","00FFFF","CCFFFF","8F00FF","FF00CC","FF0000","FF1100","FF3300","FF4400","FF5500","FF6600","FF7700","FF8800","FF9900","FFaa00","FFbb00","FFcc00","FFdd00","FFee00","FFff00","FFee00","FFdd00","FFcc00","FFbb00","FFaa00","FF9900","FF8800","FF7700","FF6600","FF5500","FF4400","FF3300","FF2200","FF1100"
];
    var random = 
job[Math.floor(Math.random() * job.length)]      
var express = require('express');
const bodyParser = require('body-parser');
const { Chess } = require("chess.js");
const { createCanvas, loadImage, registerFont } = require("canvas");
const cors = require("cors");
const app = express();
const fs = require("fs");
// const domain = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
global.domainChess = `http://localhost:3143`
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.set("json spaces", 4);
app.use(express.urlencoded({limit: '10mb', extended: true }));
app.use(express.static(__dirname + "/chess/chess/"));
app.get('/', function (req, res) {
res.sendFile(__dirname + '/index.html');
});
const path = __dirname + "/chess/game_state.json";
const chess = new Chess();
const canvasWidth = 700;
const canvasHeight = 700;
const squareSize = canvasWidth / 8;

registerFont(__dirname + "/chess/font/Montserrat-Bold.ttf", { family: "font" });

const pieces = {
  wk: "white-king.png",
  wq: "white-queen.png",
  wr: "white-rook.png",
  wb: "white-bishop.png",
  wn: "white-knight.png",
  wp: "white-pawn.png",
  bk: "black-king.png",
  bq: "black-queen.png",
  br: "black-rook.png",
  bb: "black-bishop.png",
  bn: "black-knight.png",
  bp: "black-pawn.png",
};

const lightColor = "#edeed1";
const darkColor = "#779952";
const specialLetters = ["a", "c", "e", "g"];

// Vẽ bàn cờ từ trạng thái FEN
async function drawChessBoard(fen) {
  const chesss = new Chess(fen);
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");
  

  // Vẽ các ô trên bàn cờ
  const board = chesss.board();
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const x = col * squareSize;
      const y = row * squareSize;

      const color = (row + col) % 2 === 0 ? lightColor : darkColor;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, squareSize, squareSize);

        // Vẽ số ở cột đầu tiên bên trái
        if (col === 0) {
          ctx.font = "18px font";
          ctx.fillStyle = color === lightColor ? darkColor : lightColor;

          const number = 8 - row;
          const numberX = x + 2;
          const numberY = y + 15;
          ctx.fillText(number.toString(), numberX, numberY);
        }

        // Vẽ chữ cái ở hàng cuối cùng
        if (row === 7) {
          ctx.font = "18px font";
          const letter = String.fromCharCode(97 + col);
          const textColorToUse = specialLetters.includes(letter)
            ? lightColor
            : darkColor;
          ctx.fillStyle = textColorToUse;

          const letterX = x + squareSize - 13;
          const letterY = canvasHeight - 3;
          ctx.fillText(letter, letterX, letterY);
        }

      const piece = board[row][col];
      if (piece !== null) {
        const pieceImg = await loadImage(
          __dirname + `/chess/image/${pieces[piece.color + piece.type]}`
        );
         ctx.drawImage(
          pieceImg,
          x,
          y,
          squareSize,
          squareSize
        );
      }
    }
  }
  return canvas;
}

async function drawChessBoardBlack(fen) {
  const chess = new Chess(fen);
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  const board = chess.board();
  for (let row = 7; row >= 0; row--) {
    for (let col = 7; col >= 0; col--) {
      const x = (7 - col) * squareSize; // Đảo ngược vị trí cột
      const y = (7 - row) * squareSize; // Đảo ngược vị trí hàng

      const color = (row + col) % 2 === 0 ? lightColor : darkColor;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, squareSize, squareSize);

      if (col === 7) {
      ctx.font = "18px font";
      ctx.fillStyle = color === lightColor ? darkColor : lightColor;

      const number = 8 - row;
      const numberX = x + 2;
      const numberY = y + 15;
      ctx.fillText(9-number.toString(), numberX, numberY);
    }

    if (row === 0) {
      ctx.font = "18px font";
      const letter = String.fromCharCode(97 + (7 - col)); 
      const textColorToUse = specialLetters.includes(letter)
        ? lightColor
        : darkColor;
      ctx.fillStyle = textColorToUse;

      const letterX = x + squareSize - 12;
      const letterY = y + squareSize - 3 ; 
      ctx.fillText(letter, letterX, letterY);
    }
      
      const piece = board[row][col];
      if (piece !== null) {
        const pieceImg = await loadImage(
          __dirname + `/chess/image/${pieces[piece.color + piece.type]}`
        );
        ctx.drawImage(pieceImg, x, y, squareSize, squareSize);
      }
    }
  }
  return canvas;
}

// Kiểm tra và thực hiện phong tốt nếu cần
// Hàm kiểm tra vị trí đích của tốt
function isPawnPromotionSquare(from, to, ches) {
  if (ches.get(from).type === "P" && to[1] === "8") {
    return true;
  }

  if (ches.get(from).type === "p" && to[1] === "1") {
    return true;
  }

  if (ches.get(from).type === "p" && to[1] === "8") {
    return true;
  }

  if (ches.get(from).type === "P" && to[1] === "1") {
    return true;
  }
  return false;
}

async function handlePlayerMove(id, from, to, promotion, res) {
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  const foundIndex = data.findIndex((item) => item.id === id);
  const imagePath = __dirname + `/chess/chess/${id}.png`;
  const fen = data[foundIndex].fen;

  const chess = new Chess(fen);

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");
  
  if (chess.turn() === "w" && chess.get(from).color === "b")
    return res.status(200).json({ status: false, message: "Lượt này bên trắng đi!" });
  if (chess.turn() === "b" && chess.get(from).color === "w")
    return res.status(200).json({ status: false, message: "Lượt này bên đen đi!" });
  if (chess.isGameOver()) {
    return res.status(200).json({
      status: false,
      game: "end",
      win: chess.turn(),
      message: chess.isCheckmate() ? "Chiếu hậu!" : "Hòa!",
    });
  }

  const form = { from: from, to: to };
  if (isPawnPromotionSquare(from, to, chess)) {
    if (!promotion) return res.status(200).json({ status: false, message: `Vui lòng phong tốt để được đi tiếp\n\n"q": Hậu (Queen) \n"r": Xe (Rook) \n"n": Ngựa (Knight) \n"b": Tượng (Bishop)\n\nVí dụ: a7 a8 q (phong hậu cho tốt)` });
    form.promotion = promotion;
  }

  const moveResult = chess.move(form);

  if (moveResult !== null) {
    const fen_new = chess.fen();
    const board = chess.board();

    if(chess.turn() === "b"){
      for (let row = 7; row >= 0; row--) {
    for (let col = 7; col >= 0; col--) {
      const x = (7 - col) * squareSize; // Đảo ngược vị trí cột
      const y = (7 - row) * squareSize; // Đảo ngược vị trí hàng

      const color = (row + col) % 2 === 0 ? lightColor : darkColor;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, squareSize, squareSize);

      if (col === 7) {
      ctx.font = "18px font";
      ctx.fillStyle = color === lightColor ? darkColor : lightColor;

      const number = 8 - row;
      const numberX = x + 2;
      const numberY = y + 15;
      ctx.fillText(9-number.toString(), numberX, numberY);
    }

    if (row === 0) {
      ctx.font = "18px font";
      const letter = String.fromCharCode(97 + (7 - col)); 
      const textColorToUse = specialLetters.includes(letter)
        ? lightColor
        : darkColor;
      ctx.fillStyle = textColorToUse;

      const letterX = x + squareSize - 12;
      const letterY = y + squareSize - 3 ; 
      ctx.fillText(letter, letterX, letterY);
    }

      const piece = board[row][col];
      if (piece !== null) {
        const pieceImg = await loadImage(
          __dirname + `/chess/image/${pieces[piece.color + piece.type]}`
        );
        ctx.drawImage(pieceImg, x, y, squareSize, squareSize);
      }
    }
  }
    }else if(chess.turn() === "w"){
    for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const x = col * squareSize;
      const y = row * squareSize;

      const color = (row + col) % 2 === 0 ? lightColor : darkColor;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, squareSize, squareSize);

        // Vẽ số ở cột đầu tiên bên trái
        if (col === 0) {
          ctx.font = "18px font";
          ctx.fillStyle = color === lightColor ? darkColor : lightColor;

          const number = 8 - row;
          const numberX = x + 2;
          const numberY = y + 15;
          ctx.fillText(number.toString(), numberX, numberY);
        }

        // Vẽ chữ cái ở hàng cuối cùng
        if (row === 7) {
          ctx.font = "18px font";
          const letter = String.fromCharCode(97 + col);
          const textColorToUse = specialLetters.includes(letter)
            ? lightColor
            : darkColor;
          ctx.fillStyle = textColorToUse;

          const letterX = x + squareSize - 13;
          const letterY = canvasHeight - 3;
          ctx.fillText(letter, letterX, letterY);
        }

      const piece = board[row][col];
      if (piece !== null) {
        const pieceImg = await loadImage(
          __dirname + `/chess/image/${pieces[piece.color + piece.type]}`
        );
         ctx.drawImage(
          pieceImg,
          x,
          y,
          squareSize,
          squareSize
        );
      }
    }
  }
}
    const out = fs.createWriteStream(imagePath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', async () => {
    await saveGameState(id, fen_new);
    res.json({
      status: true,
      play: chess.turn(),
      url: global.domainChess + `/${id}.png` 
    });
  });
  } else {
    return res.status(200).json({
      status: false,
      message: "Nước đi không hợp lệ! Vui lòng thử lại.",
    });
  }
}

// Lưu trạng thái của trò chơi vào file JSON
function saveGameState(id, fen) {
  const gameState = { id, fen };
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  const foundIndex = data.findIndex((item) => item.id === id);

  if (foundIndex !== -1) {
    data[foundIndex].fen = fen;
  } else {
    data.push(gameState);
  }
  fs.writeFileSync(path, JSON.stringify(data, null, 4));
}

function randomColor() {
  return Math.random() < 0.5 ? 'white' : 'black';
}

app.post("/api/key/:type",(req, res) => {
  const { type } = req.params;
  const { name, key } = req.query
  const data = JSON.parse(fs.readFileSync(pathKey, 'utf8'));
  if (type === 'create') {
    var new_Key = {
      key: createKey(6),
      name: name.toUpperCase()
    }
    data.push(new_Key)
    res.json({
      status: true,
      message: 'Tạo Key Thành Công!'
    })
  } else if (type === 'remove') {
    var check = data.find((item) => item.key === key);
    if (!check) {
      return res.json({
        status: false,
        message: 'Không tìm thấy key cần xóa!'
      })
    }
    var new_data = data.filter((item) => item.key !== key);
    data.push(new_data)
    res.json({
      status: true,
      message: 'Tạo Key Thành Công!'
    })
  } else if (type === 'check') {
    var check = data.find((item) => item.key === key);
    var status = check ? true : false
    return res.json({
      status
    })
  }
  fs.writeFileSync(pathKey, JSON.stringify(data, null, 4));
});

// API endpoint để di chuyển quân cờ
app.post("/api/move/:id",(req, res) => {
  const { id } = req.params;
  const { from, to, promotion } = req.query;

  var promo = !promotion ? false : promotion;

  handlePlayerMove(id, from, to, promo, res);
});

app.get("/api/move/test/:id", (req, res) => {
  const { id } = req.params;
  const { from, to, promotion } = req.query;

  var promo = !promotion ? false : promotion;

  handlePlayerMove(id, from, to, promo, res);
});

app.get("/api/player/:id", (req, res) => {
  const { id } = req.params;
  const { player } = req.query

  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  const foundIndex = data.find((item) => item.id === id);
  
  const bufferData = Buffer.from(player, 'base64');

  const jsonString = bufferData.toString('utf8');

  const jsonData = JSON.parse(jsonString);
  jsonData[0].color = randomColor();
  jsonData[1].color = jsonData[0].color === 'white' ? 'black' : 'white';

  const fen = foundIndex ? foundIndex.fen : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

  var msg = 'Bên White đi trước'
  const ches = new Chess(fen);
  const lastChar = ches.turn()
  if(foundIndex){
  if (lastChar === "w") {
  msg = "White được phép di chuyển trong lượt tới";
} else if (lastChar === "b") {
  msg = "Black được phép di chuyển trong lượt tới";
}
  }
  res.json({
    status: true,
    message: msg,
    start: lastChar,
    resul: jsonData
  })
});

// API endpoint để hiển thị trạng thái bàn cờ dựa trên trạng thái FEN
app.post("/api/board/:id",async (req, res) => {
  const { id } = req.params;
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  const foundIndex = data.find((item) => item.id === id);
  const imagePath = __dirname + `/chess/chess/${id}.png`;
  var fen;
  if (!foundIndex) {
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; //chess.fen();
    saveGameState(id, fen);
  } else fen = foundIndex.fen
  try {
    const ches = new Chess(fen)
    if(ches.turn() === 'b'){
    const chessBoardImageB = await drawChessBoardBlack(fen);
     const outB = fs.createWriteStream(imagePath);
  const streamB = chessBoardImageB.createPNGStream();
  streamB.pipe(outB);
  console.log({
	status: true,
	play: ches.turn(),
	url: global.domainChess + `/${id}.png` 
  })
  outB.on('finish', async () => {
    return res.json({
      status: true,
      play: ches.turn(),
      url: global.domainChess + `/${id}.png` 
    });
  });
      return;
    }
    const chessBoardImage = await drawChessBoard(fen);
     const out = fs.createWriteStream(imagePath);
  const stream = chessBoardImage.createPNGStream();
  stream.pipe(out);
  out.on('finish', async () => {
    res.json({
      status: true,
      play: ches.turn(),
      url: global.domainChess + `/${id}.png` 
    });
  });
  } catch (e) {
    console.log(e)
    res.json({
      status: false,
      message: 'Đã xảy ra lỗi khi tạo bàn cờ!'
    })
  }
});
///////--------------TEST
app.get("/api/board/:id", async (req, res) => {
  const { id } = req.params;
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  const foundIndex = data.find((item) => item.id === id);
  const imagePath = __dirname + `/chess/chess/${id}.png`;
  var fen;
  if (!foundIndex) {
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; //chess.fen();
    saveGameState(id, fen);
  } else fen = foundIndex.fen
  try {
    const ches = new Chess(fen)
    if(ches.turn() === 'b'){
    const chessBoardImageB = await drawChessBoardBlack(fen);
     const outB = fs.createWriteStream(imagePath);
  const streamB = chessBoardImageB.createPNGStream();
  streamB.pipe(outB);
  outB.on('finish', async () => {
    return res.json({
      status: true,
      play: ches.turn(),
      url: global.domainChess + `/${id}.png` 
    });
  });
      return;
    }
    const chessBoardImage = await drawChessBoard(fen);
     const out = fs.createWriteStream(imagePath);
  const stream = chessBoardImage.createPNGStream();
  stream.pipe(out);
  out.on('finish', async () => {
    res.json({
      status: true,
      play: ches.turn(),
      url: global.domainChess + `/${id}.png` 
    });
  });
  } catch (e) {
    console.log(e)
    res.json({
      status: false,
      message: 'Đã xảy ra lỗi khi tạo bàn cờ!'
    })
  }
});

////////////------------------ END
app.delete("/api/board/remove/:id", async (req, res) => {
  const { id } = req.params;
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  var datas = data.find((item) => item.id === id);
  if(datas){
  var new_data = data.filter((item) => item.id !== id);
  fs.writeFileSync(path, JSON.stringify(new_data, null, 4));
    return res.json({
      status: true,
      message: 'Đã xóa bàn cờ thành công!'
    })
  }else return res.json({
      status: false,
      message: 'Không có bàn cờ để xóa!'
    })
});
app.listen(3143, function () {
  console.log(chalk1.hex("#" + random)(`[ Niiozic ] - Máy chủ đang khởi động...`), "");
});  
function startBot(message) {
    (message) ? logger(message, "[ Bắt đầu ]") : "";

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "mirai.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });
    child.on("close", (codeExit) => {
        if (codeExit != 0 || global.countRestart && global.countRestart < 5) {
            startBot("Mirai Loading");
            global.countRestart += 1;
            return;
        } else return;
    });

    child.on("error", function (error) {
        logger("Đã xảy ra lỗi: " + JSON.stringify(error), "[ Bắt đầu ]");
    });
};
const config = require('./config.json')
async function login(){
  if(config.ACCESSTOKEN !== "") return
  if (config.EMAIL === "") {
      return console.log('Thiếu email tài khoản');
    }
    var uid = config.EMAIL
    var password = config.PASSWORD
    var fa = config.OTPKEY
  
    var form = {
        adid: adid.v4(),
        email: uid,
        password: password,
        format: 'json',
        device_id: deviceID.v4(),
        cpl: 'true',
        family_device_id: deviceID.v4(),
        locale: 'en_US',
        client_country_code: 'US',
        credentials_type: 'device_based_login_password',
        generate_session_cookies: '1',
        generate_analytics_claim: '1',
        generate_machine_id: '1',
        currently_logged_in_userid: '0',
        try_num: "1",
        enroll_misauth: "false",
        meta_inf_fbmeta: "NO_FILE",
        source: 'login',
        machine_id: randomString(24),
        meta_inf_fbmeta: '',
        fb_api_req_friendly_name: 'authenticate',
        fb_api_caller_class: 'com.facebook.account.login.protocol.Fb4aAuthHandler',
        api_key: '882a8490361da98702bf97a021ddc14d',
        access_token: '275254692598279|585aec5b4c27376758abb7ffcb9db2af'
    }

    form.sig = encodesig(sort(form))
    var options = {
        url: 'https://b-graph.facebook.com/auth/login',
        method: 'post',
        data: form,
        transformRequest: [
            (data, headers) => {
                return require('querystring').stringify(data)
            },
        ],
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            "x-fb-friendly-name": form["fb_api_req_friendly_name"],
            'x-fb-http-engine': 'Liger',
            'user-agent': 'Mozilla/5.0 (Linux; Android 12; TECNO CH9 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/109.0.5414.118 Mobile Safari/537.36[FBAN/EMA;FBLC/pt_BR;FBAV/339.0.0.10.100;]',
        }
    }
    axios(options).then(i => {
      var sessionCookies = i.data.session_cookies;
        var cookies = sessionCookies.reduce((acc, cookie) => {
            acc += `${cookie.name}=${cookie.value};`
            return acc
        }, "");
            if(i.data.access_token){
              config.ACCESSTOKEN = i.data.access_token
              saveConfig(config)
            }
    }).catch(async function (error) {
        var data = error.response.data.error.error_data;
        form.twofactor_code = totp(decodeURI(fa).replace(/\s+/g, '').toLowerCase())
        form.encrypted_msisdn = ""
        form.userid = data.uid
        form.machine_id = data.machine_id
        form.first_factor = data.login_first_factor
        form.credentials_type = "two_factor"
        await new Promise(resolve => setTimeout(resolve, 2000));
        delete form.sig
        form.sig = encodesig(sort(form))
        var option_2fa = {
            url: 'https://b-graph.facebook.com/auth/login',
            method: 'post',
            data: form,
            transformRequest: [
                (data, headers) => {
                    return require('querystring').stringify(data)
                },
            ],
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'x-fb-http-engine': 'Liger',
                'user-agent': 'Mozilla/5.0 (Linux; Android 12; TECNO CH9 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/109.0.5414.118 Mobile Safari/537.36[FBAN/EMA;FBLC/pt_BR;FBAV/339.0.0.10.100;]',
            }
        }
        axios(option_2fa).then(i => {
          var sessionCookies = i.data.session_cookies;
        var cookies = sessionCookies.reduce((acc, cookie) => {
            acc += `${cookie.name}=${cookie.value};`
            return acc
        }, "");
            if(i.data.access_token){
              config.ACCESSTOKEN = i.data.access_token
              saveConfig(config)
            }
        }).catch(function (error) {
            console.log(error.response.data)

        })
      
    });
  
}

function saveConfig(data) {
  setTimeout(()=>{
  	const json = JSON.stringify(data,null,4);
	fs.writeFileSync(`./config.json`, json);
    
  },50)
}
function randomString(length) {
    length = length || 10
    var char = 'abcdefghijklmnopqrstuvwxyz'
    char = char.charAt(
        Math.floor(Math.random() * char.length)
    )
    for (var i = 0; i < length - 1; i++) {
        char += 'abcdefghijklmnopqrstuvwxyz0123456789'.charAt(
            Math.floor(36 * Math.random())
        )
    }
    return char
}
function getRandomAOV(input) {
  const randomIndex = Math.floor(Math.random() * input.length);
  return input[randomIndex];
}
function encodesig(string) {
    var data = ''
    Object.keys(string).forEach(function (info) {
        data += info + '=' + string[info]
    })
    data = md5(data + '62f8ce9f74b12f84c123cc23437a4a32')
    return data
}

function md5(string) {
    return require('crypto').createHash('md5').update(string).digest('hex')
}

function sort(string) {
    var sor = Object.keys(string).sort(),
        data = {},
        i
    for (i in sor)
        data[sor[i]] = string[sor[i]]
    return data
}

axios.get("https://raw.githubusercontent.com/ThanhAli-Official/GbanMiraiProject/main/package.json").then((res) => {
  const rainbow = chalk.rainbow(`\nVision -> 3.8.0`).stop();
rainbow.render();
const frame = rainbow.frame();
console.log(frame);
});
async function startb(){
  
  if(config.ACCESSTOKEN !== "") {
    startBot();
  } else {
    login()
    setTimeout(()=>{
      startBot();
    },7000)
  }
}
startb()
