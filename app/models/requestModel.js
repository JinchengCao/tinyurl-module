var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new Schema({
    shortUrl: String,
    referer: String,
    platform: String,
    browser: String,
    countryOrRegion: String,
    timestamp: Date
});

var RequestModel = mongoose.model('RequestModel', RequestSchema);

module.exports = RequestModel;
