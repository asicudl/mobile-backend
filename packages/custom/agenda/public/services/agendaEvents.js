'use strict';

//Messages service used for messages REST endpoint
angular.module('mean.agenda').factory('AgendaEvents', ['$resource',
  function($resource) {
    return $resource('agendaevents/:agendaEventId', {
        agendaEventId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);