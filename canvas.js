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

class sudoku {
    constructor(a) { this.config = a }
    async run({ api, event }) {
        await sdkcanvas([
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ].map(r => r.join(' ')))
        setTimeout(() => api.sendMessage({ attachment: require('fs').createReadStream(__dirname + '/output.png')}, event.threadID), 200)
    }
}

module.exports = new sudoku({
    name: 'canvas',
    version: '1.0.0',
    hasPermssion: 2,
    credits: 'Quất',
    description: 'tải link',
    commandCategory: 'Admin',
    usePrefix: false,
    cooldowns: 0
});
