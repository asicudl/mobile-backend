'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ServiceDirectory = mongoose.model('ServiceDirectory'),
    _ = require('lodash');

// role authorization helpers
var isGroupPublisher = function(req) {    
    return (_.contains(req.user.roles,'servicesPublisher'));
};

var isGroupAdmin = function(req) {
    return (_.contains(req.user.roles,'servicesAdmin'));
};

/**
 * Find service directory item by id
 */
exports.serviceDirectory = function(req, res, next, id) {
    ServiceDirectory.load(id, function(err,serviceDirectory) {
        if (err) return next(err);
        if (!serviceDirectory) return next(new Error('Failed to load the service Directory Event ' + id));
        if (isGroupAdmin(req) || (isGroupPublisher(req) && req.user.username === serviceDirectory.user.username))
            req.serviceDirectory = serviceDirectory;
        next();
    });
};


/**
 * Create an serviceDirectory event
 */
exports.create = function(req, res) {

    var serviceDirectory = new ServiceDirectory(req.body);
    serviceDirectory.user = req.user;

    if (isGroupAdmin(req) || isGroupPublisher(req)){
        
        serviceDirectory.save(function(err) {
            if (err) {
                return res.status(500).json({
                    error: 'Cannot save the serviceDirectory'
                });
            }

            res.json(serviceDirectory);

        });
        
    }else{
        return res.status(500).json({
            error: 'Cannot save the serviceDirectory'
        });
    }
};

/**
 * Update an service directory item
 */
exports.update = function(req, res) {
    var serviceDirectory = req.serviceDirectory;

    if (isGroupAdmin(req) || (isGroupPublisher(req) && req.user.username === serviceDirectory.user.username)){
    
        serviceDirectory = _.extend(serviceDirectory, req.body);
        serviceDirectory.lastUpdate = new Date();

        serviceDirectory.save(function(err) {
            if (err) {
                return res.status(500).json({
                    error: 'Cannot update the service directory item'
                });
            }

            res.json(serviceDirectory);
        });
    
    }else{
        return res.status(500).json({
            error: 'Cannot update the service directory item'
        });
    }
};

/**
 * Delete an service directory item
 */
exports.destroy = function(req, res) {
    var serviceDirectory = req.serviceDirectory;

    if (isGroupAdmin(req) || (isGroupPublisher(req) && req.user.username === serviceDirectory.user.username)){
        
        serviceDirectory.state = 'deleted';
        serviceDirectory.lastUpdate = new Date();

        serviceDirectory.save(function(err) {
            if (err) {
                return res.status(500).json({
                    error: 'Cannot update the service directory item'
                });
            }

            res.json(serviceDirectory);
        });
        
    }else{
        return res.status(500).json({
            error: 'Cannot update the service directory item'
        });
    }
};

/**
 * Show an service directory item
 */
exports.show = function(req, res) {
    if (isGroupAdmin(req) || (isGroupPublisher(req) && req.user.username === req.serviceDirectory.user.username)){
        res.json(req.serviceDirectory);
    }
};

/**
 * List of service directory items
 */
exports.all = function(req, res) {
    
    var findFilter = {'state': 'unexistingState'};
    if (isGroupAdmin(req)){
        findFilter = {'state': 'active'};
    }else if (isGroupPublisher(req)){
        findFilter = {'state': 'active', 'user': req.user};
    }
    
    ServiceDirectory.find(findFilter).sort('title').populate('user', 'name username').exec(function(err, serviceDirectory) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot list the service directory items'
            });
        }

        res.json(serviceDirectory);
    });
};


/**
 * Public API List of Service Directory Items
 */
exports.allNewServices = function(req, res) {
	var searchCriteria = {};
    
    if (req.body.lastServicesUpdate !== undefined){
        searchCriteria =  {'lastUpdate' : {'$gt': req.body.lastServicesUpdate}};
    }else{
        searchCriteria = {'state': 'active','published': true};
    }
		
    
	ServiceDirectory.find(searchCriteria).sort ('title').exec(function(err, serviceDirectory) {
        if (err) {
            console.log('error ' + err);
            return res.status(500).json({
                error: 'Cannot list the service directory items'
            });
        }

        //si algun ítem s'ha esborrat o despublicat, només enviem l'identificador i l'estat, la resta de dades no cal enviar-les.
        var items = [];
        for(var i in serviceDirectory){
            var item = serviceDirectory[i];
            if(item.state === 'deleted' || !item.published){
                var row = {};
                row._id = item._id;
                if(item.state === 'deleted'){
                    row.state = item.state;
                }
                if(!item.published){
                    row.published = item.published;
                }
                items.push(row);
            }
            else{
                items.push(item);
            }
        }
        res.json({'offeredServiceItems' : items, 'currentDate' : new Date()});
    });
};