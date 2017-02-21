var RequestModel = require('../models/requestModel');
var geoip = require('geoip-lite');
// log request info
// shortUrl, referer, platform, browser, countryOrRegion, timestamp
var logRequest = function(shortUrl, req) {
    var reqInfo = {};
    reqInfo.shortUrl = shortUrl;
    reqInfo.referer = req.headers.referer || 'Unknown';
    reqInfo.browser = req.useragent.browser || 'Unknown';
    reqInfo.platform = req.useragent.platform || 'Unknown';

    var ip = req.headers['x-forwarded-for'] ||
             req.connection.remoteAddress ||
             req.socket.remoteAddress ||
             req.connection.socket.remoteAddress;
    var geo = geoip.lookup(ip);
    if (geo) {
        reqInfo.countryOrRegion = geo.country;
    } else {
        reqInfo.countryOrRegion = 'Unknown';
    }
    reqInfo.timestamp = new Date();

    var request = new RequestModel(reqInfo);
    request.save();
}
// get stats info
var getUrlInfo = function(shortUrl, info, callback) {
    if (info === 'totalClicks') {
        RequestModel.count( {shortUrl: shortUrl }, function(err, data) {
            callback(data);
        }).lean();
        return;
    }

    var groupId = '';

    if (info === 'hour') {
        groupId = {
            year: {$year: '$timestamp'},
            month: {$month: '$timestamp'},
            day: {$dayOfMonth: '$timestamp'}, // Notes: it is dayOfMonth, not day
            hour: {$hour: '$timestamp'},
            minutes: {$minute: '$timestamp'}
        };
    } else if (info === 'day') {
        groupId = {
            year: {$year: '$timestamp'},
            month: {$month: '$timestamp'},
            day: {$dayOfMonth: '$timestamp'},
            hour: {$hour: '$timestamp'}
        };
    } else if (info === 'month') {
         groupId = {
            year: {$year: '$timestamp'},
            month: {$month: '$timestamp'},
            day: {$dayOfMonth: '$timestamp'},
        };
    } else {
        // browser, platform,.....
        groupId = '$' + info;
    }

    RequestModel.aggregate([
        {
            $match: {
                shortUrl: shortUrl
            }
        },
        {
            $sort: {
                timestamp: -1
            }
        },
        {
            $group: {
                _id: groupId,
                count: {
                    $sum: 1
                }
            }
        }
    ], function(err, data) {
        callback(data);
    })
}

module.exports = {
    logRequest: logRequest,
    getUrlInfo: getUrlInfo
}
