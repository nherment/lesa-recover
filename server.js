'use strict';

var Primus = require('primus')
var http   = require('http')
var fs     = require('fs')
var express = require('express')


var app = express()

app.use(express.bodyParser())
app.use(express.static('./public/'))

app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'text/html')
  fs.createReadStream(__dirname + '/public/index.html').pipe(res)
})

app.post('/api/message', function(req, res) {
  console.log(req.body)
  res.send();
})


//
// Do your express magic.
//

var server = require('http').createServer(app)

var primus = new Primus(server, {/* options */})


primus.on('connection', function connection(spark) {
  console.log('new connection')

  spark.on('data', function data(packet) {
    console.log('incoming:', packet)

    //
    // Close the connection.
    //
    if (packet === 'end') spark.end()

    //
    // Echo the responses.
    //
    if (packet.echo) spark.write(packet.echo)

    //
    // Pipe in some data.
    //
    if (packet.pipe) fs.createReadStream(__dirname + '/index.html').pipe(spark, {
      end: false
    })

    //
    // Major server kill;
    //
    if (packet !== 'kill') return

    primus.write('Spark: '+spark.id +' asked for a full server kill. Server will be killed within 5 seconds')
    setTimeout(process.exit, 5000)
  })
})



primus.on('disconnection', function (spark) {
  // the spark that disconnected
})

//
// Save the compiled file to the hard disk so it can also be distributed over
// cdn's or just be served by something else than the build-in path.
//
primus.save('primus.js')

//
// Everything is ready, listen to a port number to start the server.
//
server.listen(4400)