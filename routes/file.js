var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var config = require(__dirname + "/../config.json");
/* GET home page. */
router.get('/', function(req, res, next) {
	res.sendFile(path.join(config.path, req.query.path))
});

module.exports = router;
