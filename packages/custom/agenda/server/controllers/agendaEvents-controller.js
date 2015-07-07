'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    AgendaEvents = mongoose.model('AgendaEvents'),
    _ = require('lodash');


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

    agendaEvent.remove(function(err) {
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
    AgendaEvents.find().sort('eventDate').populate('user', 'name username').exec(function(err, agendaEvents) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot list the agenda events'
            });
        }

        res.json(agendaEvents);
    });
};


/**
 * Public API List of AgendaEvents
 */
exports.allNewEvents = function(req, res) {
    var searchCriteria ={};

    if (req.body.lastMessage){
        searchCriteria =  {'lastUpdate' : {'$gt': req.body.lastMessageDate}};
    }else{
        searchCriteria = {'published': true};
    }


    AgendaEvents.find(searchCriteria).sort('eventDate').exec(function(err, agendaEvents) {
        if (err) {
            console.log('error ' + err);
            return res.status(500).json({
                error: 'Cannot list the agenda events'
            });
        }
        res.json({'agendaEvents':agendaEvents,'currentDate': new Date()});
    });
};

