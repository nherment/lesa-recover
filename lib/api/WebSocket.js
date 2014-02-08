
var Logger = require('../util/Logger.js')
var logger = new Logger()

var Reports = require('./middleware/Reports.js')

var WebSocket = {}

WebSocket.handleClient = function(client) {
  logger.info('connection was made from client', client.id, client.address)

  client.on('data', function (data) {


    var handler

    switch(data.type) {
      case "report":
        logger.info('message handled in report middleware', JSON.stringify(data))
        handler = Reports
        break
      default:
        break
    }

    var response = {
      id: data.id,
      error: null,
      payload: null
    }

    if(handler) {

      handler.handleMessage(data.payload, function(err, payload) {
        if(err) {
          response.error = err.message
        } else {
          response.payload = payload
        }
        client.write(response)
      })
    } else {
      response.error = "could not find handler for data type "+data.type
      logger.error(response.error)
      client.write(response)
    }

  })
}

module.exports = WebSocket