var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReportSchema = new Schema({
    name: String,
    path: String
});

module.exports = mongoose.model('Report', ReportSchema)