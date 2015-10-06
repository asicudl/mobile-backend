'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ActivityEvents = mongoose.model('ActivityEvents'),
    _ = require('lodash');


/**
 * Find activity event by id
 */
exports.activityEvent = function(req, res, next, id) {
    ActivityEvents.load(id, function(err, activityEvent) {
        if (err) return next(err);
        if (!activityEvent) return next(new Error('Failed to load the activity Event ' + id));
        req.activityEvent = activityEvent;
        next();
    });
};


/**
 * Create an activity evetn
 */
exports.create = function(req, res) {

    var activityEvent = new ActivityEvents(req.body);
    activityEvent.user = req.user;

    activityEvent.save(function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot save the activityEvent'
            });
        }

        res.json(activityEvent);

    });
};

/**
 * Update an activity event
 */
exports.update = function(req, res) {
    var activityEvent = req.activityEvent;

    activityEvent = _.extend(activityEvent, req.body);
    activityEvent.lastUpdate = new Date();

    activityEvent.save(function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the activity event'
            });
        }

        res.json(activityEvent);
    });
};

/**
 * Delete an activity event
 */
exports.destroy = function(req, res) {
    var activityEvent = req.activityEvent;

    activityEvent.state = 'deleted';
    activityEvent.lastUpdate = new Date();

    activityEvent.save(function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the activity event'
            });
        }

        res.json(activityEvent);
    });

};

/**
 * Show an activity event
 */
exports.show = function(req, res) {
    res.json(req.activityEvent);
};

/**
 * List of activity events
 */
exports.all = function(req, res) {
    ActivityEvents.find({'state': 'active'}).sort('dueDate').populate('user', 'name username').exec(function(err, activityEvents) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot list the activity events'
            });
        }

        res.json(activityEvents);
    });
};


/**
 * Public API List of ActivityEvents
 */
exports.allNewEvents = function(req, res) {
    var searchCriteria ={};

	if (req.body.lastActivityDate){
        searchCriteria =  {'state': 'active', 'lastUpdate' : {'$gt': req.body.lastServicesUpdate}};
    }else{
        searchCriteria = {'state': 'active','published': true};
    }
		
    ActivityEvents.find(searchCriteria).sort ('dueDate') .exec(function(err, activityEvents) {
        if (err) {
            console.log('error ' + err);
            return res.status(500).json({
                error: 'Cannot list the activity events'
            });
        }
        res.json({'activityItems' : activityEvents, 'currentDate' : new Date()});
    });
};

