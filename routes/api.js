var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var config = require(__dirname + "/../config.json");
var formidable = require('formidable');
var common = require(__dirname + "/../lib/common.js");
router.get('/show', function(req, res, next) {
    var mainfolder = path.join(config.path);
    if (req.query.path) {
        mainfolder = path.join(config.path, common.clear_input_path(req.query.path) + "/");
    }
    console.log(mainfolder)
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
                if (isDirectory) {
                    row.push("<i class=\"fas fa-folder\"></i> " + file + "/");
                    item_cnt = fs.readdirSync(mainfolder + file, 'utf8').length;
                    row.push(item_cnt + (item_cnt > 1 ? " items" : " item"));
                } else {
                    //row.push("<i class=\"fas fa-file\"></i> " + file);
                    row.push(file);
                    row.push(isDirectory ? "" : fs.statSync(mainfolder + file).size);
                }
                row.push(modified);
                row.push(isDirectory ? "directory" : "file");
                row.push(common.clear_input_path(req.query.path) + "/" + file);
                files.data.push(row);
                i++;
            } catch (e) {
                console.error(e);
            }
        })
    }
    if (files.data.length>0) {
        files.data.sort(function (a, b) {
            return a[3].localeCompare(b[3]);
        });
    }
    res.json(files);
});
router.post('/upload', function(req, res, next) {
    var mainfolder = path.join(config.path);
    if (req.query.path) {
        mainfolder = path.join(config.path, common.clear_input_path(req.query.path) + "/");
    }
    if (fs.existsSync(mainfolder)) {
        var form = new formidable.IncomingForm();
        form.parse(req);
        form.on('fileBegin', function(name, file) {
            if (fs.existsSync(mainfolder + file.name)) {
                file.path = mainfolder + "1_" + file.name;
            } else {                
                file.path = mainfolder + file.name;
            }
        });
        form.on('error', function(err) {
            return res.status(500).send("Server error.")
        });
        form.on('end', function() {
            return res.send('File uploaded !');
        });
    } else {
        return res.status(400).send('Path incorrect !');
    }
});
router.post('/mkdir', function(req, res, next) {
    var mainfolder = path.join(config.path);
    if (req.query.path) {
        mainfolder = path.join(config.path, common.clear_input_path(req.query.path) + "/");
    }
    if (!fs.existsSync(mainfolder)){
        try {
            fs.mkdirSync(mainfolder);
            res.send("ok");
        } catch(e) {
            res.status(500).send(e);
        }
    } else {
        res.status(500).send("Folder already exist. Please try another folder name.");
    }
});
module.exports = router;