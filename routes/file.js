var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var config = require(__dirname + "/../config.json");
var Archiver = require('archiver');
var rimraf = require('rimraf');
var common = require(__dirname + "/../lib/common.js");
router.get('/open', function(req, res, next) {
    res.sendFile(path.join(config.path, common.clear_input_path(req.query.path)))
});
router.get('/download', function(req, res, next) {
    var zip = Archiver('zip');
    var mypath = path.join(config.path, common.clear_input_path(req.query.path));
    var isDirectory = fs.lstatSync(mypath).isDirectory();
    if (!isDirectory) {
        res.attachment(path.basename(mypath));
        var readStream = fs.createReadStream(mypath);
        readStream.pipe(res);
        //to zip it:
        /*res.attachment(path.basename(mypath) + ".zip");
        zip.pipe(res);
        zip.file(mypath, { name: path.basename(mypath) })
        .finalize();*/
    } else {
        res.attachment(path.basename(mypath) + ".zip");
        zip.pipe(res);
        zip.directory(mypath, path.basename(mypath)).finalize();
    }
});
router.post('/delete', function(req, res, next) {
    var mypath = path.join(config.path, common.clear_input_path(req.query.path));
    if (fs.existsSync(mypath)) {
        var isDirectory = fs.lstatSync(mypath).isDirectory();
        if (!isDirectory) {
            try {
                fs.unlinkSync(mypath);
                res.send("ok");
            } catch (err) {
                res.status(500).send(err);
            }
        } else {
            try {
                rimraf.sync(mypath);
                res.send("ok");
            } catch (err) {
                res.status(500).send(err);
            }
        }
    } else {
        res.status(500).send("File:'" + common.clear_input_path(req.query.path) + "' doesn't exist.");
    }
});
module.exports = router;