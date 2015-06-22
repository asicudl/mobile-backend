'use strict';

/* jshint -W098 */
angular.module('mean.agendaevents')

    .controller('AgendaEventsController', 

                ['$scope', '$stateParams', '$location', 'Global', 'AgendaEvents','$sce',

                 function($scope, $stateParams, $location, Global, AgendaEvents,$sce) {
                     $scope.global = Global;
                     $scope.tempReceptients = [];

                     $scope.trustSrc = function(src) {
                         return $sce.trustAsResourceUrl(src);
                     };

                     $scope.hasAuthorization = function(agendaEvent) {
                         if (!agendaEvent || !agendaEvent.user) return false;
                         return $scope.global.isAdmin || agendaEvent.user._id === $scope.global.user._id;
                     };

                     $scope.create = function(isValid) {
                         if (isValid) {
                             var img = null;

                             //Set the image from the cropper if it has
                             if (this.$$childTail && this.$$childTail.img)
                                 img = this.$$childTail.img;

                             var agendaEvent = new AgendaEvents({
                                 title: this.title,
                                 published: this.published,
                                 eventURL: this.eventURL,
                                 eventURLTitle: this.eventURLTitle,
                                 location: this.location,
                                 period: this.period,
                                 content: this.content,
                                 image: img
                             });

                             agendaEvent.$save(function(response) {
                                 $location.path('agendaevents/' + response._id);
                             });

                             this.title = '';
                             this.content = '';
                             this.eventURL = '';
                             this.eventURLTitle = '';
                             this.published = false;
                             this.period = '';
                             this.location = '';
                         } else {
                             $scope.submitted = true;
                         }
                     };

                     $scope.remove = function(agendaEvent) {
                         if (agendaEvent) {
                             agendaEvent.$remove(function(response) {

                                 for (var i in $scope.agendaEvents) {
                                     if ($scope.agendatEvents[i] === agendaEvent) {
                                         $scope.agendaEvents.splice(i,1);
                                     }
                                 }
                                 $location.path('agendaevents');
                             });
                         } else {
                             $scope.agendaEvent.$remove(function(response) {
                                 $location.path('agendaevents');
                             });
                         }
                     };

                     $scope.update = function(isValid) {
                         if (isValid) {
                             var agendaEvent = $scope.agendaEvent;
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

                     $scope.changeFile = function(){
                         var f = document.getElementById('inputImage').files[0];
                         var r = new FileReader();
                         
                         r.onloadend = function(e){
                             $scope.$apply (function (){
                                 $scope.loadedimg = e.target.result;
                             });
                         };
                         r.readAsDataURL(f);
                     };
                 }
                ]);
