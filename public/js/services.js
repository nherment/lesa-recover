'use strict';

/* Services */

var phonecatServices = angular.module('phonecatServices', ['ngResource']);


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

phonecatServices.factory('backend', ['$q', '$rootScope', 'uuid', '$log', function($q, $rootScope, uuid, $log) {
  // We return this object to anything injecting our service
  var Service = {}

  var primus = new Primus()

  primus.on('reconnect', function reconnect(opts) {
    $log.info('Reconnecting', 'We are scheduling a new reconnect attempt. This is attempt '+ opts.attempt +' and will trigger a reconnect operation in '+ opts.timeout +'ms.')
  })

  primus.on('reconnect', function reconnect() {
    $log.info('reconnect', 'Reconnect', 'Starting the reconnect attempt, hopefully we get a connection!')
  })

  primus.on('online', function online() {
    $log.info('We have regained control over our internet connection.')
  })

  primus.on('offline', function offline() {
    $log.info('We lost our internet connection.')
  })

  primus.on('open', function open() {
    $log.info('The connection has been established.')
  })

  primus.on('error', function error(err) {
    $log.info('An unknown error has occured', err)
  })

  primus.on('data', function incoming(wrapper) {
    $log.info('Received data', JSON.stringify(wrapper))

    if(wrapper && wrapper.event) {
      // TODO: emit event
    } else if(wrapper.id && callbacks[wrapper.id]) {

      // TODO: implement streaming protocol (eg. wrapper.ongoing = true) and keep calling the callback until ended
      var callback = callbacks[wrapper.id]
      delete callbacks[wrapper.id]

      try {
        callback(wrapper.error, wrapper.payload)
      } catch(err) {
        // this is to not crash here if the callback screws up
        $log.error(err)
      }

    }

  })

  primus.on('end', function end() {
    $log.info('The connection has ended.')
  })

  primus.on('close', function end() {
    $log.info('We\'ve lost the connection to the server.')
  })

  var callbacks = {}

  // Define a "getter" for getting customer data
  Service.send = function(type, payload, callback) {
    var wrapper = {
      id: uuid.v4(),
      type: type,
      payload: payload
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