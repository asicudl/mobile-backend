'use strict';

angular.module('mean.authservice').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('authservice example page', {
      url: '/authservice/example',
      templateUrl: 'authservice/views/index.html'
    });
  }
]);
