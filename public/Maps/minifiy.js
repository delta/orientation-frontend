// read all .json files in the directory and remove all whitespaces and write back
const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, '../../public/Maps'), (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        if (path.extname(file) === '.json') {
        fs.readFile(path.join(__dirname, '../../public/Maps', file), 'utf8', (err, data) => {
            if (err) throw err;
            fs.writeFile(path.join(__dirname, '../../public/Maps', file), data.replace(/\s/g, ''), (err) => {
            if (err) throw err;
            });
        });
        }
    });
});
