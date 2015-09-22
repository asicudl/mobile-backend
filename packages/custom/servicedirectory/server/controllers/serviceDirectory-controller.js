'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ServiceDirectory = mongoose.model('ServiceDirectory'),
    _ = require('lodash');


/**
 * Find service directory item by id
 */
exports.serviceDirectory = function(req, res, next, id) {
    ServiceDirectory.load(id, function(err,serviceDirectory) {
        if (err) return next(err);
        if (!serviceDirectory) return next(new Error('Failed to load the service Directory Event ' + id));
        req.serviceDirectory = serviceDirectory;
        next();
    });
};


/**
 * Create an activity evetn
 */
exports.create = function(req, res) {

    var serviceDirectory = new ServiceDirectory(req.body);
    serviceDirectory.user = req.user;

    serviceDirectory.save(function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot save the serviceDirectory'
            });
        }

        res.json(serviceDirectory);

    });
};

/**
 * Update an service directory item
 */
exports.update = function(req, res) {
    var serviceDirectory = req.serviceDirectory;

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
};

/**
 * Delete an service directory item
 */
exports.destroy = function(req, res) {
    var serviceDirectory = req.serviceDirectory;

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

};

/**
 * Show an service directory item
 */
exports.show = function(req, res) {
    res.json(req.serviceDirectory);
};

/**
 * List of service directory items
 */
exports.all = function(req, res) {
    ServiceDirectory.find({'state':'active'}).sort('title').populate('user', 'name username').exec(function(err, serviceDirectory) {
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
    var searchCriteria =  req.body.lastServicesUpdate ? {'lastUpdate' : req.body.lastServicesUpdate} : {};

    ServiceDirectory.find(searchCriteria).sort ('title').exec(function(err, serviceDirectory) {
        if (err) {
            console.log('error ' + err);
            return res.status(500).json({
                error: 'Cannot list the service directory items'
            });
        }
        res.json({'activityItems' : serviceDirectory, 'currentDate' : new Date()});
    });
};

