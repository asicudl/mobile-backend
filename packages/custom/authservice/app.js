'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Authservice = new Module('authservice');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Authservice.register(function(app, auth, database, passport) {

    //We enable routing. By default the Package Object is passed to the routes
    Authservice.routes(app, auth, database, passport);
    require('./passport-service')(passport);    
    
    Authservice.routes(app, auth, database, passport);
    
    return Authservice;
});
