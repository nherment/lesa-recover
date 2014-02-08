
var Logger = require('../../util/Logger.js')
var DBHelper = require('../../database/DBHelper.js')
var logger = new Logger()

var ReportManager = {}


ReportManager.create = function(report, callback) {

  DBHelper.save(report, function(err, savedReport) {

    callback(err, savedReport)

  })

}

ReportManager.list = function(from, to, callback) {

  DBHelper.Report.find({}, {}, {}, function(err, result) {
    callback(err, result)
  })

}

module.exports = ReportManager;