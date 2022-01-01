// read from a json file
const fileName = './female2.json';
const player = require(fileName);
const fs = require('fs');
let frames = player.textures[0].frames;
player.meta.image = player.textures[0].image;
player.meta.scale = player.textures[0].scale;
player.meta.format = player.textures[0].format;
player.meta.size = player.textures[0].size;
let newFrames = {};
// for each frame
for (let i = 0; i < frames.length; i++) {
    let frame = frames[i];
    let key = frame.filename.split('.')[0];
    key = key.replace(/^0+/, '');
    if (key === '') {
        key = '0';
    }
    key = player.meta.image + '-' + key;
    let value = frame;
    delete value.filename;
    newFrames[key] = value;
}
player.frames = newFrames;
delete player.textures;
fs.writeFileSync(fileName, JSON.stringify(player, null, 2));