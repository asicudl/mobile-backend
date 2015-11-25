        'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var ActivityEvents = new Module('activity');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
ActivityEvents.register(function(app, auth, database, authservice) {

    //We enable routing. By default the Package Object is passed to the routes
    ActivityEvents.routes(app, auth, database, authservice);

    //We are adding a link to the main menu for all authenticated users
    ActivityEvents.menus.add({
        'roles': ['activitiesPublisher','activitiesAdmin'],
        'title': 'Activities',
        'link': 'all activity events'
    });
/*    ActivityEvents.menus.add({
        'roles': ['authenticated'],
        'title': 'New Activity',
        'link': 'create activity event'
    });*/

    ActivityEvents.aggregateAsset('css', 'activityEvents.css');


    return ActivityEvents;
});