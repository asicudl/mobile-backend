'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ActivityEvents = mongoose.model('ActivityEvents'),
    _ = require('lodash');

// role authorization helpers
var isGroupPublisher = function(req) {    
    return (_.contains(req.user.roles,'activitiesPublisher'));
};

var isGroupAdmin = function(req) {
    return (_.contains(req.user.roles,'activitiesAdmin'));
};

/**
 * Find activity event by id
 */
exports.activityEvent = function(req, res, next, id) {
    ActivityEvents.load(id, function(err, activityEvent) {
        if (err) return next(err);
        if (!activityEvent) return next(new Error('Failed to load the activity Event ' + id));
        if (isGroupAdmin(req) || (isGroupPublisher(req) && req.user.username === activityEvent.user.username))
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
    
    if (isGroupAdmin(req) || isGroupPublisher(req)){
        activityEvent.save(function(err) {
            if (err) {
                return res.status(500).json({
                    error: 'Cannot save the activityEvent'
                });
            }
            res.json(activityEvent);
        });
    }else{
        return res.status(500).json({
            error: 'You cant create activities'
        });
    }
};

/**
 * Update an activity event
 */
exports.update = function(req, res) {
    var activityEvent = req.activityEvent;

    if (isGroupAdmin(req) || (isGroupPublisher(req) && req.user.username === activityEvent.user.username)){
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
    }else{
        return res.status(500).json({
            error: 'Cannot update activities'
        });
    }
};

/**
 * Delete an activity event
 */
exports.destroy = function(req, res) {
    var activityEvent = req.activityEvent;
    
    if (isGroupAdmin(req) || (isGroupPublisher(req) && req.user.username === activityEvent.user.username)){

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
        
    }else{
        return res.status(500).json({
            error: 'Cannot delete activities'
        });
    }
};

/**
 * Show an activity event
 */
exports.show = function(req, res) {
    if (isGroupAdmin(req) || (isGroupPublisher(req) && req.user.username === req.activityEvent.user.username)){
        res.json(req.activityEvent);
    }
};

/**
 * List of activity events
 */
exports.all = function(req, res) {
    
    var findFilter = {'state': 'unexistingState'};
    if (isGroupAdmin(req)){
        findFilter = {'state': 'active'};
    }else if (isGroupPublisher(req)){
        findFilter = {'state': 'active', 'user': req.user};
    }
            
    ActivityEvents.find(findFilter).sort('dueDate').populate('user', 'name username').exec(function(err, activityEvents) {
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
    var searchCriteria = {};

	if (req.body.lastActivityDate!==undefined){
        searchCriteria =  {'lastUpdate' : {'$gt': req.body.lastActivityDate}};
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

        //si algun ítem s'ha esborrat o despublicat, només enviem l'identificador i l'estat, la resta de dades no cal enviar-les.
        var activityItems = [];
        for(var i in activityEvents){
            var item = activityEvents[i];
            if(item.state === 'deleted' || !item.published){
                var row = {};
                row._id = item._id;
                if(item.state === 'deleted'){
                    row.state = item.state;
                }
                if(!item.published){
                    row.published = item.published;
                }
                activityItems.push(row);
            }
            else{
                activityItems.push(item);
            }
        }
        res.json({'activityItems' : activityItems, 'currentDate' : new Date()});
    });
};

