
var Logger = require('../../util/Logger.js')
var DBHelper = require('../../database/DBHelper.js')
var logger = new Logger()

var ReportManager = {}


ReportManager.create = function(report, callback) {

  DBHelper.Report.save(report, function(err, savedReport) {

    callback(err, savedReport)

  })

}

ReportManager.get = function(id, callback) {

  logger.info('retrieving report with id', id)

  DBHelper.Report.findOne({_id: id}, {}, function(err, report) {

    callback(err, report)

  })

}

ReportManager.list = function(from, to, callback) {

  DBHelper.Report.find({}, {}, {}, function(err, result) {
    callback(err, result)
  })

}

ReportManager.saveMessage = function(id, message, callback) {

  logger.info('adding message to report', id, message)
  DBHelper.Report.update (
    {_id: id },
    {$push: {'messages': message}},
    {upsert: false},
    function(err, updatedReport) {
      if(err) {
        logger.error(err)
      }
      callback(err, updatedReport)
    }
  )

}

module.exports = ReportManager;