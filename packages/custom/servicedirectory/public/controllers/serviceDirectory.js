'use strict';

/* jshint -W098 */
angular.module('mean.servicedirectory')

    .controller('ServiceDirectoryController', 

                ['$scope', '$stateParams', '$location', 'Global', 'ServiceDirectory','$sce',

                 function($scope, $stateParams, $location, Global, ServiceDirectory,$sce) {
                     $scope.global = Global;
                     
                     $scope.trustSrc = function(src) {
                         return $sce.trustAsResourceUrl(src);
                     };

                     $scope.hasAuthorization = function(serviceDirectory) {
                         if (!serviceDirectory || !serviceDirectory.user) return false;
                         return $scope.global.isAdmin || serviceDirectory.user._id === $scope.global.user._id;
                     };

                     $scope.create = function(isValid) {
                         if (isValid) {
                           
                             var serviceDirectory = new ServiceDirectory({
                                 title: this.title,
                                 published: this.published,
                                 URL: this.URL,
                                 gmapsURL: this.gmapsURL,
                                 location: this.location,
                                 attendingSchedule: this.attendingSchedule,
                                 phoneNumber: this.phoneNumber,
                                 email: this.email,
                                 content: this.content,
                                 image: this.loadedimg
                             });

                             serviceDirectory.$save(function(response) {
                                 $location.path('servicedirectory/' + response._id);
                             });

                             this.title = '';
                             this.content = '';
                             this.URL = '';
                             this.gmapsURL = '';
                             this.published = false;
                             this.attendingSchedule = '';
                             this.phoneNumber ='';
                             this.email = '';
                             this.location = '';
                             this.image = '';
                         } else {
                             $scope.submitted = true;
                         }
                     };

                     $scope.remove = function(serviceDirectory) {
                         var option;
                         
                         if (serviceDirectory) {
                            option = confirm ('Would you like to remove the event "' + serviceDirectory.title + '"');      
                             
                            if (option){
                                serviceDirectory.$remove(function(response) {

                                    for (var i in $scope.serviceDirectoryItems) {
                                        if ($scope.serviceDirectoryItems[i] === serviceDirectory) {
                                            $scope.serviceDirectoryItems.splice(i,1);
                                         }
                                     }
                                                     
                                    $location.path('servicedirectory');
                                 });
                             }
                         } else {
                             
                             option = confirm ('Would you like to remove the event "' +  $scope.serviceDirectory.title + '"');
                             if (option){
                                 $scope.serviceDirectory.$remove(function(response) {
                                     $location.path('servicedirectory');
                                });
                             }
                         }
                     };

                     $scope.update = function(isValid) {
                         if (isValid) {
                             var serviceDirectory = $scope.serviceDirectory;
                             serviceDirectory.image = $scope.loadedimg;
                             if(!serviceDirectory.updated) {
                                 serviceDirectory.updated = [];
                             }
                             serviceDirectory.updated.push(new Date().getTime());

                             serviceDirectory.$update(function() {
                                 $location.path('servicedirectory/' + serviceDirectory._id);
                             });
                         } else {
                             $scope.submitted = true;
                         }
                     };

                     $scope.find = function() {
                         ServiceDirectory.query(function(serviceDirectoryItems) {
                             $scope.serviceDirectoryItems = serviceDirectoryItems;
                         });
                     };

                     $scope.findOne = function() {
                         
                         ServiceDirectory.get({
                             serviceDirectoryId : $stateParams.serviceDirectoryId
                         }, function(serviceDirectory) {
                             $scope.serviceDirectory = serviceDirectory;
                             $scope.loadedimg = $scope.serviceDirectory.image;
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
                     
                      $scope.deleteFile = function(){
                         $scope.loadedimg = '';
                         delete $scope.activityEvent.image;
                     };
                 }
                ]);
