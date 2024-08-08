var dataUser = require('./data/datauser.json');
var dataItem = require('./data/item.json');
var dataMonster = require('./data/monster.json');

function getDataUser(id) {
    if (typeof id !== 'string') {
        throw new Error('id must be a string');
    }
    return dataUser.find(user => user.id == id);
}

function getItems(id) {
    if(id) {
        return dataItem.find(item => item.id == id)
    }
    return dataItem;
}

function getMonster(locationID) {
    if(dataMonster.find(location => location.ID == locationID))
        return (dataMonster.find(location => location.ID == locationID)).creature;
    return undefined;
}

async function getImgMonster(monster, path) {
    var url = monster.image;
    var fs = require('fs-extra');
    var { createCanvas, loadImage } = require('canvas')
    var image = await loadImage(url);
    var canvas = await createCanvas(image.width, image.height);
    var ctx = canvas.getContext('2d');
    ctx.shadowColor = 'red';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.drawImage(image, 0, 0, image.width, image.height);
    var buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path, buffer);
    return fs.createReadStream(path);
}

module.exports = {
    getDataUser,
    getItems,
    getMonster,
    getImgMonster
};