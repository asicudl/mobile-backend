'use strict';

/* jshint -W098 */
angular.module('mean.authservice').controller('AuthserviceController', ['$scope', 'Global', 'Authservice',
  function($scope, Global, Authservice) {
    $scope.global = Global;
    $scope.package = {
      name: 'authservice'
    };
  }
]);
