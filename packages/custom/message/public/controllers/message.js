'use strict';

/* jshint -W098 */
angular.module('mean.message').controller('MessagesController', ['$scope', '$stateParams', '$location', 'Global', 'Messages',
  function($scope, $stateParams, $location, Global, Messages) {
    $scope.global = Global;
    $scope.tempReceptients = [];
      
    $scope.hasAuthorization = function(message) {
      if (!message || !message.user) return false;
      return $scope.global.isAdmin || message.user._id === $scope.global.user._id;
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var message = new Messages({
          subject: this.subject,
          receptientsIds: this.tempReceptients,
          siteId: this.siteId,
          siteTitle: this.siteTitle,
          notiURL: this.notiURL,
          author: this.author,
          content: this.content
        });
        message.$save(function(response) {
          $location.path('messages/' + response._id);
        });

        this.subject = '';
        this.content = '';
        this.siteId = '';
        this.siteTitle = '';
        this.notiURL = '';
        this.author = '';
        this.tempReceptients = [];
      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(message) {
      if (message) {
        message.$remove(function(response) {
          for (var i in $scope.messages) {
            if ($scope.messages[i] === message) {
	      $scope.messages.splice(i,1);
            }
          }
          $location.path('messages');
        });
      } else {
        $scope.message.$remove(function(response) {
          $location.path('messages');
        });
      }
    };
      
    $scope.addRcp = function (){
        if ($scope.newrcp && $scope.newrcp!==''){
            $scope.tempReceptients.push ($scope.newrcp);
            $scope.newrcp = '';
        }
    };
      
    $scope.addRcpToMsg = function (){
        if ($scope.newrcp && $scope.newrcp!==''){
            $scope.message.receptientsIds.push ($scope.newrcp);
            $scope.newrcp = '';
        }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var message = $scope.message;
        if(!message.updated) {
          message.updated = [];
	}
        message.updated.push(new Date().getTime());

        message.$update(function() {
          $location.path('messages/' + message._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function() {
      Messages.query(function(messages) {
        $scope.messages = messages;
      });
    };

    $scope.findOne = function() {
      Messages.get({
        messageId: $stateParams.messageId
      }, function(message) {
        $scope.message = message;
      });
    };
  }
]);
