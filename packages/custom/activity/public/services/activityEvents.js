'use strict';

//Messages service used for messages REST endpoint
angular.module('mean.activity').factory('ActivityEvents', ['$resource',
  function($resource) {
      return $resource('activityevents/:activityEventId', {
          activityEventId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);