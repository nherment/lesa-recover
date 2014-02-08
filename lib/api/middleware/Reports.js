

function handleMessage(message, callback) {


  setTimeout(function() {
    callback(undefined, 'ok')
  })



}


module.exports = {
  handleMessage: handleMessage
}