'use strict';

angular.module('mean.activity')
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
                     .state('all activity events', {
                     url: '/activityevents',
                     templateUrl: 'activity/views/list.html',
                     resolve: {
                         loggedin: checkLoggedin
                     }
                 })
                     .state('create activity event', {
                     url: '/activityevents/create',
                     templateUrl: 'activity/views/create.html',
                     resolve: {
                         loggedin: checkLoggedin
                     }
                 })
                     .state('edit activity event', {
                     url: '/activityevents/:activityEventId/edit',
                     templateUrl: 'activity/views/edit.html',
                     resolve: {
                         loggedin: checkLoggedin
                     }
                 })
                     .state('activity event by id', {
                     url: '/activityevents/:activityEventId',
                     templateUrl: 'activity/views/view.html',
                     resolve: {
                         loggedin: checkLoggedin
                     }
                 });
             }
            ]);
