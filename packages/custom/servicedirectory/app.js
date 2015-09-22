        'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var ServiceDirectory = new Module('servicedirectory');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
ServiceDirectory.register(function(app, auth, database, authservice) {

    //We enable routing. By default the Package Object is passed to the routes
    ServiceDirectory.routes(app, auth, database, authservice);

    //We are adding a link to the main menu for all authenticated users
    ServiceDirectory.menus.add({
        'roles': ['authenticated'],
        'title': 'Services',
        'link': 'all service directory items'
    });
    ServiceDirectory.menus.add({
        'roles': ['authenticated'],
        'title': 'New Service',
        'link': 'create service directory item'
    });

    ServiceDirectory.aggregateAsset('css', 'serviceDirectory.css');


    return ServiceDirectory;
});
