'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Utils = new Module('utils');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Utils.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Utils.routes(app, auth, database);

    Utils.aggregateAsset('css', 'textAngular.css',{global: true});
    Utils.aggregateAsset('js','datetimepicker.js', {global:true});
    Utils.aggregateAsset('js','textAngular-rangy.js', {global:true});
    Utils.aggregateAsset('js','textAngular-sanitize.js', {global:true});
    Utils.aggregateAsset('js','textAngular.js', {global:true});

    return Utils;
});
