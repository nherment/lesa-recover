var ReportManager = require('../managers/ReportManager.js')


function handleMessage(message, callback) {

  switch(message.action) {

    case 'list':
      ReportManager.list(message.from, message.to, function(err, list) {
        callback(err, list)
      })
      break

    case 'get':
      ReportManager.get(message.id, function(err, report) {
        callback(err, report)
      })
      break

    default:
      setTimeout(function() {
        callback(new Error('unknown action ['+message.action+'] in report middleware'), undefined)
      })
      break
  }

}


module.exports = {
  handleMessage: handleMessage
}