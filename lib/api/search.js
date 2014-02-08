

var HttpsAgent = require('agentkeepalive').HttpsAgent;
var Algolia = require('./algolia-search');

var keepaliveAgent = new HttpsAgent({
    maxSockets: 1,
    maxKeepAliveRequests: 0, // no limit on max requests per keepalive socket
    maxKeepAliveTime: 30000 // keepalive for 30 seconds
});

var client = new Algolia('YourApplicationID', 'YourAPIKey', keepaliveAgent);



var Search = {}


Search.search = function(txt, callback) {
}


module.exports = Search