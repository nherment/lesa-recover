'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('HomeCtrl', ['$scope', 'backend',
  function($scope, backend) {
//    backend.send('hello')
  }]
);

phonecatControllers.controller('SignInCtrl', ['$scope', 'backend',
  function($scope, backend) {
//    backend.send('hello')
  }]
);

phonecatControllers.controller('SignUpCtrl', ['$scope', 'backend',
  function($scope, backend) {
  }]
);

phonecatControllers.controller('DecisionTreeCtrl', ['$scope', 'backend',
  function($scope, backend) {
//    backend.send('hello')
  }]
);

phonecatControllers.controller('ReportsCtrl', ['$scope', 'backend', '$log',
  function($scope, backend, $log) {

//    $scope = {reports:'foo'}

    function list() {
      backend.send('report', {action: 'list'}, function(err, reports) {
        $log.info(err, reports)
        $scope.$apply(function(){
          $scope.reports = reports
        })
      })
    }

    list();

  }]
);

phonecatControllers.controller('ReportCtrl', ['$scope', 'backend', '$log', '$routeParams',
  function($scope, backend, $log, $routeParams) {

//    $scope = {reports:'foo'}

    function get(id) {
      backend.send('report', {action: 'get', id: id}, function(err, report) {
        $log.info(err, report)
        $scope.$apply(function(){
          $scope.reportId = id;
          $scope.report = report
        })
      })
    }
    function sendMessage(content) {
      var message = {
        content: content
      }
      backend.send('report', {action: 'pushMessage', reportId: $scope.reportId, message: message}, function(err, report) {
        $log.info(err, report)
        get($scope.reportId)
      })
    }

    $scope.sendMessage = function() {
      if($scope.newMessage) {
        var content = $scope.newMessage
        $scope.newMessage = '';
        sendMessage(content)
      }
    }

    get($routeParams.reportId);

  }]
);