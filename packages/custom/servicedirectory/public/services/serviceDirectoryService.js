'use strict';

//Messages service used for messages REST endpoint
angular.module('mean.servicedirectory').factory('ServiceDirectory', ['$resource',
  function($resource) {
      return $resource('servicedirectory/:serviceDirectoryId', {
          serviceDirectoryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);