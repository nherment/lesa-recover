// Twilio Credentials
var accountSid = process.env.TWILIO_ACCOUNT_SID
var authToken = process.env.TWILIO_AUTH_TOKEN

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken)

function SMS() {}

SMS.send = function(destination, message) {

  client.messages.create({
    to: destination,
    from: '+1415XXXXXX',
    body: 'Hello there'
  }, function(err, message) {
    if(err) {
      console.log(err)
    } else {
      console.log(message)
    }
  })

}

module.exports = SMS;