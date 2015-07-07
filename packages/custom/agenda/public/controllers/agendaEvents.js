'use strict';

/* jshint -W098 */
angular.module('mean.agenda')


    .controller('AgendaEventsController', 

                ['$scope', '$stateParams', '$location', 'Global', 'AgendaEvents','$sce',
                 
               
                 
                 function($scope, $stateParams, $location, Global, AgendaEvents,$sce) {
                     $scope.global = Global;
                     $scope.eventDate = new Date();
                     
                     $scope.trustSrc = function(src) {
                         return $sce.trustAsResourceUrl(src);
                     };

                     $scope.hasAuthorization = function(agendaEvent) {
                         if (!agendaEvent || !agendaEvent.user) return false;
                         return $scope.global.isAdmin || agendaEvent.user._id === $scope.global.user._id;
                     };

                     $scope.create = function(isValid) {
                         if (isValid) {
                           
                             var agendaEvent = new AgendaEvents({
                                 title: this.title,
                                 eventDate: this.eventDate,
                                 location: this.location,
                                 content: this.content,
                             });

                             agendaEvent.$save(function(response) {
                                 $location.path('agendaevents/' + response._id);
                             });

                             this.title = '';
                             this.content = '';
                             this.eventDate = '';
                             this.location = '';
                         } else {
                             $scope.submitted = true;
                         }
                     };

                     $scope.remove = function(agendaEvent) {
                         var option;
                         
                         if (agendaEvent) {
                             option = confirm ('Would you like to remove the event "' + agendaEvent.title + '"');      
                             
                            if (option){
                                 agendaEvent.$remove(function(response) {

                                     for (var i in $scope.agendaEvents) {
                                         if ($scope.agendaEvents[i] === agendaEvent) {
                                            $scope.agendaEvents.splice(i,1);
                                         }
                                     }
                                                     
                                     $location.path('agendaevents');
                                 });
                             }
                         } else {
                             
                             option = confirm ('Would you like to remove the event "' +  $scope.agendaEvent.title + '"');
                             if (option){
                                 $scope.agendaEvent.$remove(function(response) {
                                    $location.path('agendaevents');
                                });
                             }
                         }
                     };

                     $scope.update = function(isValid) {
                         if (isValid) {
                             var agendaEvent = $scope.agendaEvent;
                             agendaEvent.image = $scope.loadedimg;
                             if(!agendaEvent.updated) {
                                 agendaEvent.updated = [];
                             }
                             agendaEvent.updated.push(new Date().getTime());

                             agendaEvent.$update(function() {
                                 $location.path('agendaevents/' + agendaEvent._id);
                             });
                         } else {
                             $scope.submitted = true;
                         }
                     };

                     $scope.find = function() {
                         AgendaEvents.query(function(agendaEvents) {
                             $scope.agendaEvents = agendaEvents;
                         });
                     };

                     $scope.findOne = function() {
                         AgendaEvents.get({
                             agendaEventId : $stateParams.agendaEventId
                         }, function(agendaEvent) {
                             $scope.agendaEvent = agendaEvent;
                         });
                     };

                 }]);
    
