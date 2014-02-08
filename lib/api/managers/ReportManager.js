
var Logger = require('../../util/Logger.js')
var DBHelper = require('../../database/DBHelper.js')
var logger = new Logger()

var ReportManager = {}


ReportManager.create = function(report, callback) {

  DBHelper.save(report, callback);

}

ReportManager.list = function(from, to, callback) {



}

module.exports = ReportManager;