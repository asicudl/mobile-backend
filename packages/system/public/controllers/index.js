'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global',
  function($scope, Global) {
    $scope.global = Global;
    $scope.sites = {
      
      'udlapp':{
        'name':'UdL Messagig APP',
        'text':'This APP goal is deliver instant messages to students from Campus Virtual course sites. Students would be able to see institutional agenda as well as Services Directory information',
        'author':'Projectes inters (ASIC)',
        'link':'http://www.udl.cat',
        'image':'/system/assets/img/imatge-portada-back.png'
      }
    };
    $scope.packages = {
      'cv':{
        'name':'Campus Virtual',
        'text':'Campus Virtual is the learning management system used by UdL and powered by Sakai technology to bring ',
        'author':'Projectes inters (ASIC)',
        'link':'http://www.udl.cat',
        'image':'/system/assets/img/cv-landing.png'
      },
    };

    $scope.$watch(function () {
      for (var i = 0; i < $scope.sites.length; i+=1) {
        if ($scope.sites[i].active) {
          return $scope.sites[i];
        }
      }
    }, function (currentSlide, previousSlide) {
      if (currentSlide !== previousSlide) {
        console.log('currentSlide:', currentSlide);
      }
    });
  }
]);
