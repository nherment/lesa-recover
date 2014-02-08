'use strict';

/* Services */

var phonecatServices = angular.module('phonecatServices', ['ngResource']);

var logger = console;

phonecatServices.factory('uuid', [function($q, $rootScope) {
    return {
      v4: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8)
          return v.toString(16)
        })
      }
    }
  }]
)

phonecatServices.factory('backend', ['$q', '$rootScope', 'uuid', function($q, $rootScope, uuid) {
  // We return this object to anything injecting our service
  var Service = {}

  var primus = new Primus()

  primus.on('reconnect', function reconnect(opts) {
    logger.info('Reconnecting', 'We are scheduling a new reconnect attempt. This is attempt '+ opts.attempt +' and will trigger a reconnect operation in '+ opts.timeout +'ms.')
  })

  primus.on('reconnect', function reconnect() {
    logger.info('reconnect', 'Reconnect', 'Starting the reconnect attempt, hopefully we get a connection!')
  })

  primus.on('online', function online() {
    logger.info('We have regained control over our internet connection.')
  })

  primus.on('offline', function offline() {
    logger.info('We lost our internet connection.')
  })

  primus.on('open', function open() {
    logger.info('The connection has been established.')
  })

  primus.on('error', function error(err) {
    logger.info('An unknown error has occured', err)
  })

  primus.on('data', function incoming(wrapper) {
    logger.info('Received data', JSON.stringify(wrapper))

    if(wrapper && wrapper.event) {
      // TODO: emit event
    } else if(wrapper.id && callbacks[wrapper.id]) {
      // TODO: implement streaming protocol (eg. wrapper.ongoing = true) and keep calling the callback until ended
      callbacks[wrapper.id](wrapper.message)
      delete callbacks[wrapper.id]
    }

  })

  primus.on('end', function end() {
    logger.info('The connection has ended.')
  })

  primus.on('close', function end() {
    logger.info('We\'ve lost the connection to the server.')
  })

  var callbacks = {}

  // Define a "getter" for getting customer data
  Service.send = function(message, callback) {
    var wrapper = {
      id: uuid.v4(),
      message: message
    }

    if(callback) {
      callbacks[wrapper.id] = callback
    }

    primus.write(wrapper)
  }

  var eventListeners = {}

  Service.on = function(event, eventListener) {
    if(!eventListeners.hasOwnProperty(event)) {
      eventListeners[event] = []
    }
    if(eventListener) {
      eventListeners[event].push(event)
    }
  }

  Service.removeEventListener = function(event, eventListener) {
    if(eventListeners.hasOwnProperty(event) && eventListeners[event].length > 0) {
      for(var i = 0 ; i < eventListeners[event].length ; i++) {
        if(eventListeners[event][i] === eventListener) {
          eventListeners[event].splice(i, 1)
        }
      }
    }
  }

  Service.removeAllListeners = function(event) {
    if(event) {
      if(eventListeners.hasOwnProperty(event)) {
        delete eventListeners[event]
      }
    } else {
      for(event in eventListeners) {
        if(eventListeners.hasOwnProperty(event)) {
          delete eventListeners[event]
        }
      }
    }

  }

  return Service
}])