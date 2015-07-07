'use strict';

/* jshint -W098 */
angular.module('mean.activity')

    .controller('ActivityEventsController', 

                ['$scope', '$stateParams', '$location', 'Global', 'ActivityEvents','$sce',

                 function($scope, $stateParams, $location, Global, ActivityEvents,$sce) {
                     $scope.global = Global;
                     $scope.tempReceptients = [];

                     $scope.trustSrc = function(src) {
                         return $sce.trustAsResourceUrl(src);
                     };

                     $scope.hasAuthorization = function(activityEvent) {
                         if (!activityEvent || !activityEvent.user) return false;
                         return $scope.global.isAdmin || activityEvent.user._id === $scope.global.user._id;
                     };

                     $scope.create = function(isValid) {
                         if (isValid) {
                           
                             var activityEvent = new ActivityEvents({
                                 title: this.title,
                                 published: this.published,
                                 eventURL: this.eventURL,
                                 location: this.location,
                                 period: this.period,
                                 content: this.content,
                                 image: this.loadedimg
                             });

                             activityEvent.$save(function(response) {
                                 $location.path('activityevents/' + response._id);
                             });

                             this.title = '';
                             this.content = '';
                             this.eventURL = '';
                             this.published = false;
                             this.period = '';
                             this.location = '';
                             this.image = '';
                         } else {
                             $scope.submitted = true;
                         }
                     };

                     $scope.remove = function(activityEvent) {
                         var option;
                         
                         if (activityEvent) {
                            option = confirm ('Would you like to remove the event "' + activityEvent.title + '"');      
                             
                            if (option){
                                activityEvent.$remove(function(response) {

                                    for (var i in $scope.activityEvent) {
                                        if ($scope.activityEvents[i] === activityEvent) {
                                            $scope.activityEvents.splice(i,1);
                                         }
                                     }
                                                     
                                     $location.path('activityevents');
                                 });
                             }
                         } else {
                             
                             option = confirm ('Would you like to remove the event "' +  $scope.activityEvent.title + '"');
                             if (option){
                                 $scope.activityEvent.$remove(function(response) {
                                    $location.path('activityevents');
                                });
                             }
                         }
                     };

                     $scope.update = function(isValid) {
                         if (isValid) {
                             var activityEvent = $scope.activityEvent;
                             activityEvent.image = $scope.loadedimg;
                             if(!activityEvent.updated) {
                                 activityEvent.updated = [];
                             }
                             activityEvent.updated.push(new Date().getTime());

                             activityEvent.$update(function() {
                                 $location.path('activityevents/' + activityEvent._id);
                             });
                         } else {
                             $scope.submitted = true;
                         }
                     };

                     $scope.find = function() {
                         ActivityEvents.query(function(activityEvents) {
                             $scope.activityEvents = activityEvents;
                         });
                     };

                     $scope.findOne = function() {
                         ActivityEvents.get({
                             activityEventId : $stateParams.activityEventId
                         }, function(activityEvent) {
                             $scope.activityEvent = activityEvent;
                             $scope.loadedimg = $scope.activityEvent.image;
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
