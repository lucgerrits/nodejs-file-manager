var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const config = require(__dirname + "/../config.json");
router.get('/show', function(req, res, next) {
    var mainfolder = path.join(config.path);
    if (req.query.path) {
        mainfolder = path.join(config.path, req.query.path + "/");
    }
    var files = {
        data: []
    };
    if (fs.existsSync(mainfolder)) {
        var i = 0;
        let isDirectory;
        let row;
        let modified;
        let item_cnt;
        fs.readdirSync(mainfolder, 'utf8').forEach(file => {
            //file = "/" + file;
            try {
                row = [];
                isDirectory = fs.lstatSync(mainfolder + file).isDirectory();
                modified = moment(fs.lstatSync(mainfolder + file).mtime).format("YYYY-MM-DD HH-mm-ss");
                //row.push(i);
                row.push(file);
                if (isDirectory) {
                    item_cnt = fs.readdirSync(mainfolder + file, 'utf8').length;
                    row.push(item_cnt + (item_cnt > 1 ? " items" : " item"));
                } else {
                    row.push(isDirectory ? "" : fs.statSync(mainfolder + file).size);
                }
                row.push(modified);
                row.push(isDirectory ? "directory" : "file");
                row.push(req.query.path + "/" + file);
                files.data.push(row);
                i++;
            } catch (e) {
                console.error(e);
            }
        })
    }
    res.json(files);
});
module.exports = router;