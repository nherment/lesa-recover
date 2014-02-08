var ReportManager = require('../managers/ReportManager.js')


function handleMessage(payload, callback) {

  switch(payload.action) {

    case 'list':
      ReportManager.list(payload.from, payload.to, function(err, list) {
        callback(err, list)
      })
      break

    case 'get':
      ReportManager.get(payload.id, function(err, report) {
        callback(err, report)
      })
      break

    case 'pushMessage':
      if(payload.message) {
        payload.message.from = 'agent'
        payload.message.date = Date.now()
        ReportManager.saveMessage(payload.reportId, payload.message, function(err, report) {
          callback(err, report)
        })
      } else {
        callback(new Error('missing "message" in the payload'), undefined)
      }
      break

    default:
      setTimeout(function() {
        callback(new Error('unknown action ['+payload.action+'] in report middleware'), undefined)
      })
      break
  }

}


module.exports = {
  handleMessage: handleMessage
}