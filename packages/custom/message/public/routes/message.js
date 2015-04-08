'use strict';

angular.module('mean.message').config(['$stateProvider',
   function($stateProvider) {
    // Check if the user is connected
    var checkLoggedin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') $timeout(deferred.resolve);

        // Not Authenticated
        else {
          $timeout(deferred.reject);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    // states for my app
    $stateProvider
      .state('all messages', {
        url: '/messages',
        templateUrl: 'message/views/list.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('create message', {
        url: '/messages/create',
        templateUrl: 'message/views/create.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('edit message', {
        url: '/messages/:messageId/edit',
        templateUrl: 'message/views/edit.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('message by id', {
        url: '/messages/:messageId',
        templateUrl: 'message/views/view.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });
  }
]);
