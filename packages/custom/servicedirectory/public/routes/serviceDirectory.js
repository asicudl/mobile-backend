'use strict';

angular.module('mean.servicedirectory')
    .config(['$stateProvider',

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
                     .state('all service directory items', {
                     url: '/servicedirectory',
                     templateUrl: 'servicedirectory/views/list.html',
                     resolve: {
                         loggedin: checkLoggedin
                     }
                 })
                     .state('create service directory item', {
                     url: '/servicedirectory/create',
                     templateUrl: 'servicedirectory/views/create.html',
                     resolve: {
                         loggedin: checkLoggedin
                     }
                 })
                     .state('edit service directory item', {
                     url: '/servicedirectory/:serviceDirectoryId/edit',
                     templateUrl: 'servicedirectory/views/edit.html',
                     resolve: {
                         loggedin: checkLoggedin
                     }
                 })
                     .state('activity service directory item by id', {
                     url: '/servicedirectory/:serviceDirectoryId',
                     templateUrl: 'servicedirectory/views/view.html',
                     resolve: {
                         loggedin: checkLoggedin
                     }
                 });
             }
            ]);
