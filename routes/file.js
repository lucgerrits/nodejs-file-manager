var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var config = require(__dirname + "/../config.json");
var Archiver = require('archiver');

router.get('/open', function(req, res, next) {
	res.sendFile(path.join(config.path, req.query.path))
});

router.get('/download', function(req, res, next) {
	var zip = Archiver('zip');
	var mypath = path.join(config.path, req.query.path);
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
		zip.directory(mypath, path.basename(mypath))
        .finalize();
    }
});

router.get('/delete', function(req, res, next) {
	var mypath = path.join(config.path, req.query.path);
	try {
	  fs.unlinkSync(mypath);
	  res.send("ok");
	} catch (err) {
	  res.status(500).send(err);
	}
});

module.exports = router;
