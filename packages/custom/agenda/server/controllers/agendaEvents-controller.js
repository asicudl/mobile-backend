'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    AgendaEvents = mongoose.model('AgendaEvents'),
    _ = require('lodash');

var asFarLastWeek = function (curdate){
    var today = new Date();
    var dateReturn = new Date ();
    dateReturn.setDate(today.getDate() - 7);

    try{
        var currentDate = new Date(curdate);	
        dateReturn = (currentDate < dateReturn) ? dateReturn : currentDate;
    }catch (error){
        console.log ('error transforming date' + error); 
    }

    return dateReturn;
};

/**
 * Find agenda event by id
 */
exports.agendaEvent = function(req, res, next, id) {
    AgendaEvents.load(id, function(err, agendaEvent) {
        if (err) return next(err);
        if (!agendaEvent) return next(new Error('Failed to load the agenda event ' + id));
        req.agendaEvent = agendaEvent;
        next();
    });
};


/**
 * Create an agenda evetn 
 */
exports.create = function(req, res) {

    var agendaEvent = new AgendaEvents(req.body);
    agendaEvent.user = req.user;

    agendaEvent.save(function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot save the agendaEvent'
            });
        }

        res.json(agendaEvent);

    });
};

/**
 * Update an agenda event
 */
exports.update = function(req, res) {
    var agendaEvent = req.agendaEvent;

    agendaEvent = _.extend(agendaEvent, req.body);
    agendaEvent.lastUpdate = new Date();

    agendaEvent.save(function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot update the agendaEvent'
            });
        }

        res.json(agendaEvent);
    });
};

/**
 * Delete an agenda event
 */
exports.destroy = function(req, res) {
    var agendaEvent = req.agendaEvent;
    
    agendaEvent.state = 'deleted';
    agendaEvent.lastUpdate = new Date();
        
    agendaEvent.save(function(err) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot delete the agendaEvent'
            });
        }

        res.json(agendaEvent);
    });
};

/**
 * Show an agenda event
 */
exports.show = function(req, res) {
    res.json(req.agendaEvent);
};

/**
 * List of agenda events
 */
exports.all = function(req, res) {
    AgendaEvents.find({'state': 'active'}).sort('eventDate').populate('user', 'name username').exec(function(err, agendaItems) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot list the agenda events'
            });
        }

        res.json(agendaItems);
    });
};


/**
 * Public API List of AgendaEvents
 */
exports.allNewEvents = function(req, res) {
    var searchCriteria =  {'lastUpdate' : {'$gt': asFarLastWeek(req.body.lastAgendaDate)}};

    AgendaEvents.find(searchCriteria).sort('eventDate').exec(function(err, agendaItems) {
        if (err) {
            console.log('error ' + err);
            return res.status(500).json({
                error: 'Cannot list the agenda events'
            });
        }
        console.log ('el currentDate' + new Date());
        res.json({'agendaItems':agendaItems, 'currentDate': new Date()});
    });
};

