'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var AgendaEvents = new Module('agenda');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
AgendaEvents.register(function(app, auth, database, authservice) {

    //We enable routing. By default the Package Object is passed to the routes
    AgendaEvents.routes(app, auth, database,authservice);

    //We are adding a link to the main menu for all authenticated users
    AgendaEvents.menus.add({
        'roles': ['agendaPublisher','agendaAdmin'],
        'title': 'Agenda',
        'link': 'all agenda events'
    });
    /*AgendaEvents.menus.add({
        'roles': ['authenticated'],
        'title': 'New Event',
        'link': 'create agenda event'
    });*/

    AgendaEvents.aggregateAsset('css', 'agendaEvents.css');


    return AgendaEvents;
});
