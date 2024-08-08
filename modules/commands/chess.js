let {
    createCanvas,
    loadImage
} = require('canvas');
let {
    Chess,
} = require('chess.js');

let _8 = [...Array(8)].map(($, i)=>i);
let piece_url_images = {
    'p': 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Chess_pdt60.png',
    'r': 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Chess_rdt60.png',
    'n': 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Chess_ndt60.png',
    'b': 'https://upload.wikimedia.org/wikipedia/commons/8/81/Chess_bdt60.png',
    'q': 'https://upload.wikimedia.org/wikipedia/commons/a/af/Chess_qdt60.png',
    'k': 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Chess_kdt60.png',
    'P': 'https://upload.wikimedia.org/wikipedia/commons/0/04/Chess_plt60.png',
    'R': 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Chess_rlt60.png',
    'N': 'https://upload.wikimedia.org/wikipedia/commons/2/28/Chess_nlt60.png',
    'B': 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Chess_blt60.png',
    'Q': 'https://upload.wikimedia.org/wikipedia/commons/4/49/Chess_qlt60.png',
    'K': 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Chess_klt60.png',
};
let piece_letters = Object.keys(piece_url_images);
let piece_images; Promise.all(piece_letters.map($=>loadImage(piece_url_images[$]))).then(rs=>piece_images = rs.reduce((o, $, i)=>(o[piece_letters[i]] = $, o), {}));
let draw_chess_board = chess=> {
    let canvas = createCanvas(500, 500);
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    _8.map(i=>_8.map(j=>(ctx.fillStyle = (i+j)%2 === 0?'#fff': '#999', ctx.fillRect((i*50)+50, (j*50)+50, 50, 50))));
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 50, 50*8, 50*8);
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    _8.map(i=>ctx.fillText(8-i, 25, (i*50+25)+50));
    _8.map(i=>ctx.fillText(String.fromCharCode(65+i), (i*50+25)+50, (50*8+25)+50));
    chess.board().map(($, i)=>$.map(($, j)=>$ !== null?(ctx.drawImage(piece_images[$.color == 'b'?$.type: $.type.toUpperCase()], (j*50)+50, (i*50)+50, 50, 50)): ''));

    let stream = canvas.createPNGStream();

    stream.path = 'tmp.png';

    return stream;
};
let name = id=>global.data.userName.get(id);
let send_chess = (o, chess, send, _ = o.handleReply || {}, sid = o.event.senderID, uid = chess.turn() == 'b'?_.competitor_id: _.author || sid)=>send({
    body: `Lượt phía quân ${chess.turn() == 'b'?'đen': 'trắng'} ${name(uid)}`,
    mentions: [{
        id: uid,
        tag: ''+name(uid),
    }],
    attachment: draw_chess_board(chess),
}, (err, res)=>chess.isCheckmate()?send(`Checkmate! ${name(uid)} thắng cuộc`): chess.isStalemate()?send(`Stalemate! Trò chơi kết thúc với kết quả hòa!`): chess.isInsufficientMaterial()?send(`Insufficient material! Trò chơi kết thúc với kết quả hòa!`): chess.isThreefoldRepetition()?send(`Threefold repetition! Trò chơi kết thúc với kết quả hòa!`): chess.isDraw()?send(`Trò chơi kết thúc với kết quả hòa!`): (res.name = exports.config.name, res.o = o, res.chess = chess, res.competitor_id = _.competitor_id || Object.keys(o.event.mentions)[0], res.author = _.author || sid, global.client.handleReply.push(res)));

exports.config = {
    name: 'chess',
    version: '0.0.1',
    hasPermssion: 0,
    credits: 'DC-Nam',
    description: 'tag người muốn chơi cùng',
    commandCategory: 'Game',
    usages: '[]',
    cooldowns: 3
};
exports.run = o=> {
    let send = (msg, callback)=>o.api.sendMessage(msg, o.event.threadID, callback);
    let competitor_id = Object.keys(o.event.mentions)[0];

    if (!competitor_id)return send(`Hãy tag ai đó để làm đối thủ của bạn`);

    let chess = new Chess();

    send_chess(o, chess, send);
};
exports.handleReply = o=> {
    let {
        chess,
        author,
        competitor_id,
    } = o.handleReply;
    let send = (msg, callback, mid)=>o.api.sendMessage(msg, o.event.threadID, callback, mid);

    if (![author, competitor_id].includes(o.event.senderID))return;
    if (o.event.senderID == author && chess.turn() == 'b')return send(`Bây giờ là lượt phía quân đen, bạn là phía quân trắng!`, undefined, o.event.messageID);
    if (o.event.senderID == competitor_id && chess.turn() == 'w')return send('Bây giờ là lượt phía quân trắng, bạn là phía quân đen!', undefined, o.event.messageID);

    try {
        chess.move((o.event.args.join('') || '').toLowerCase());
    } catch(e) {
        return send(e.toString());
    };

    send_chess(o, chess, send);
};