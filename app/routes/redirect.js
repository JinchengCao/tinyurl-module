var express = require("express");
var router = express.Router();
var urlService = require("../services/urlService");
var statsService = require("../services/statsService");
var path = require('path');

router.get("*", function (req, res) {
    var shortUrl = req.originalUrl.slice(1);
    urlService.getLongUrl(shortUrl, function(url) {
        if (url) {
            res.redirect(url.longUrl);
            // log request info
            statsService.logRequest(shortUrl, req);
        } else {
            res.status(200).sendFile('index.html', { root: path.join(__dirname, '../public/')});
        }
    });
});

module.exports = router;