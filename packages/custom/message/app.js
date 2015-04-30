'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Message = new Module('message');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Message.register(function(app, auth, database,authservice) {

  //We enable routing. By default the Package Object is passed to the routes
  Message.routes(app, auth, database,authservice);

  //We are adding a link to the main menu for all authenticated users
Message.menus.add({
    'roles': ['authenticated'],
    'title': 'Messages',
    'link': 'all messages'
  });
  Message.menus.add({
    'roles': ['authenticated'],
    'title': 'Create New Message',
    'link': 'create message'
  });
  
  Message.aggregateAsset('css', 'message.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Message.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Message.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Message.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Message;
});
