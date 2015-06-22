'use strict';

angular.module('mean.agendaevents')
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
                     .state('all agenda events', {
                     url: '/agendaevents',
                     templateUrl: 'agendaevents/views/list.html',
                     resolve: {
                         loggedin: checkLoggedin
                     }
                 })
                     .state('create agenda event', {
                     url: '/agendaevents/create',
                     templateUrl: 'agendaevents/views/create.html',
                     resolve: {
                         loggedin: checkLoggedin
                     }
                 })
                     .state('edit agenda event', {
                     url: '/agendaevents/:agendaEventId/edit',
                     templateUrl: 'agendaevents/views/edit.html',
                     resolve: {
                         loggedin: checkLoggedin
                     }
                 })
                     .state('agenda event by id', {
                     url: '/agendaevents/:agendaEventId',
                     templateUrl: 'agendaevents/views/view.html',
                     resolve: {
                         loggedin: checkLoggedin
                     }
                 });
             }
            ]);
