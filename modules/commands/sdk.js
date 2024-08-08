let z = z => `Hãy nhập 9 số của hàng số ${z}, nếu không có nhập 0`,
    rep = (a, b) => global.client.handleReply.push({ name: 'sudoku', messageID: a.messageID, x: b }), q = []
function run({ api: { sendMessage }, event: { threadID, messageID } }) {
    let send = (a, b) => sendMessage(a, threadID, b, messageID)
    send(z(1), (a, b) => rep(b, 1))
}
async function handleReply({ api: { sendMessage, unsendMessage }, event: { args, senderID, threadID, messageID, messageReply }, handleReply: { x } }) {
    let send = (a, b) => sendMessage(a, threadID, b, messageID)
try {
    if(args.length != 9 || !args.every(a => /[0-9]/.test(a))) return send('9 phần tử đều phải là từ 0 đến 9', (a, b) => setTimeout(() => unsendMessage(b.messageID), 2000))
let s = a => send(z(a), (x, y) => rep(y, a))
q.push(args.map(r => parseInt(r)))
unsendMessage(messageReply.messageID)
if(q.length == 9) {
await sdkcanvas(solveSudoku(q).map(r => r.join(' ')))
setTimeout(() => sendMessage({ attachment: require('fs').createReadStream(__dirname + '/output.png')}, threadID, messageID), 1000)
}
    if (x == 1) s(2)
if (x == 2) s(3)
if (x == 3) s(4)
if (x == 4) s(5)
if (x == 5) s(6)
if (x == 6) s(7)
if (x == 7) s(8)
if (x == 8) s(9)
} catch(e) { send(e.message)}
}
module.exports = {
    run,
    handleReply,
    config: {
        name: 'sudoku',
        version: '1.0.0',
        hasPermssion: 0,
        credits: 'quất',
        description: 'Giải mã sudoku',
        commandCategory: 'Game',
        usages: '[]',
        cooldowns: 0,
    }
}
function solveSudoku(a) {
    if (solve(a)) return a
    return false
}

function solve(d) {
    const c = findc(d)
    if (!c) return true
    const [a, b] = c
    for (let e = 1; e <= 9; e++) {
        if (isValid(d, a, b, e)) {
            d[a][b] = e
            if (solve(d)) return true
            d[a][b] = 0
        }
    }
    return false
}

function findc(a) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (a[i][j] == 0) return [i, j]
        }
    }
    return null
}

function isValid(a, b, c, d) {
    for (let i = 0; i < 9; i++) {
        if (a[b][i] == d || a[i][c] == d || a[3 * Math.floor(b / 3) + Math.floor(i / 3)][3 * Math.floor(c / 3) + i % 3] == d) return false
    }
    return true
}
async function sdkcanvas(board) {
    let { createCanvas, loadImage } = require('canvas'),
        fs = require('fs'),
        draw = ctx => {
            ctx.font = 'bold 30px Arial'
            ctx.fillStyle = 'black'
            const rows = board
            for (let i = 0; i < 9; i++) {
                const row = rows[i].split(' ')
                for (let j = 0; j < 9; j++) if (row[j] !== '0') ctx.fillText(row[j], 37 + j * 46 + 20, 127 + i * 46 + 35)
            }
        }
    let canvas = createCanvas(500, 650),
        ctx = canvas.getContext('2d')
    ctx.drawImage(await loadImage('https://i.imgur.com/AHQrmbY.jpg'), 0, 0, canvas.width, canvas.height)
    draw(ctx)
    canvas.createPNGStream().pipe(fs.createWriteStream(__dirname + '/output.png'))
}