// var shortToLong = {};
var UrlModel = require('../models/urlModel');
var redis = require("redis");
var host = process.env.REDIS_PORT_6379_TCP_ADDR || "localhost";
var port = process.env.REDIS_PORT_6379_TCP_PORT || "6379";

var redisClient = redis.createClient(port, host);

var encode = []; //["a", ... ,"z", "A", ... ,"Z", 0, ..., 9]

var genCharArray = function (charA, charZ) {
    var arr = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
    for (; i <= j; i++) {
        arr.push(String.fromCharCode(i));
    }
    return arr;
};

encode = encode.concat(genCharArray("a","z"));
encode = encode.concat(genCharArray("A","Z"));
encode = encode.concat(genCharArray("0","9"));

var getShortUrl = function (longUrl, callback) {

    redisClient.get(longUrl, function (err, shortUrl) {
        if (shortUrl) {
            console.log("ShortURL cache. No need to go to Mongo!");
            callback({
                shortUrl: shortUrl,
                longUrl: longUrl
            });
        } else {
            console.log("No such ShortURL. Going to Mongo!");
            UrlModel.findOne( { longUrl: longUrl }, function(err, url) {
                if (url) {
                    callback(url);
                    redisClient.set(url.shortUrl, url.longUrl);
                    redisClient.set(url.longUrl, url.shortUrl);
                } else {
                    generateShortUrl(function(shortUrl) {
                        var url = new UrlModel({shortUrl: shortUrl, longUrl: longUrl});
                        url.save();
                        callback(url);
                        redisClient.set(url.shortUrl, url.longUrl);
                        redisClient.set(url.longUrl, url.shortUrl);
                    });

                }
            });
        }
    });
};

var generateShortUrl = function (callback) {
    UrlModel.count( {}, function(err, length) {
        callback(convertTo62(length));
    });
};

var getLongUrl = function (shortUrl, callback) {
    redisClient.get(shortUrl, function (err, longUrl) {
        if (longUrl) {
            console.log("LongURL cache. No need to go to Mongo!");
            callback({
                shortUrl: shortUrl,
                longUrl: longUrl
            });
        } else {
            console.log("No such LongURL. Going to Mongo!");
            UrlModel.findOne({shortUrl: shortUrl}, function(err, url) {
                callback(url);
                if (url) {
                    redisClient.set(url.shortUrl, url.longUrl);
                    redisClient.set(url.longUrl, url.shortUrl);
                }
            });
        }
    });

};

var convertTo62 = function (num) {
    var result = "";
    do {
        result = encode[num % 62] + result;
        num = Math.floor( num / 62 );
    } while (num);
    return result;
};

module.exports = {
    getShortUrl: getShortUrl,
    getLongUrl: getLongUrl
};