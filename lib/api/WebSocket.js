
var Logger = require('../util/Logger.js')
var logger = new Logger()

var WebSocket = {}

WebSocket.handleClient = function(client) {
  logger.info('connection was made from client', client.id, client.address)

  client.on('data', function (data) {
    console.log('received data from the client', data)
    client.write({ foo: 'bar' })
  })
}

module.exports = WebSocket