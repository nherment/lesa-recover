'use strict';

var Logger = require('./lib/util/Logger.js')
var WebSocket = require('./lib/api/WebSocket.js')

var logger = new Logger()

var express = require('express')
var Primus = require('primus')
var app = express()

app.configure(function() {
  app.use(express.static('./public'))
  app.use(express.json())
  app.use(express.urlencoded())
})

var server = require('http').createServer(app)

var primus = new Primus(server, {})

server.listen(3000, function() {
  logger.info('server starter on port', 3000)
})

primus.on('connection', function (spark) {
  WebSocket.handleClient(spark)
})