'use strict';

/* App Module */

var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'phonecatControllers',
  'phonecatFilters',
  'phonecatServices'
]);

phonecatApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/signin', {
        templateUrl: 'partials/signin.html',
        controller: 'SignInCtrl'
      }).
      when('/signup', {
        templateUrl: 'partials/signup.html',
        controller: 'SignUpCtrl'
      }).
      when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
      }).
      when('/decision-tree', {
        templateUrl: 'partials/decision-tree.html',
        controller: 'DecisionTreeCtrl'
      }).
      when('/reports', {
        templateUrl: 'partials/reports.html',
        controller: 'ReportsCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);
