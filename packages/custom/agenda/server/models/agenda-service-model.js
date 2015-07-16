'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Agenda Events Schema
 */
var AgendaEventsSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    },
    state: {
        type: String,
        default: 'active',
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    eventDate: {
        type: Date,
        defaut: Date.now
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: false,
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
    
});

/**
 * Validations
 */
AgendaEventsSchema.path('title').validate(function(title) {
    return !!title;
}, 'Title cannot be blank');

AgendaEventsSchema.path('content').validate(function(content) {
    return !!content;
}, 'Content cannot be blank');

AgendaEventsSchema.path('eventDate').validate(function(eventDate) {
    return !!eventDate;
}, 'Period cannot be blank');

/**
 * Statics
 */
AgendaEventsSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('AgendaEvents', AgendaEventsSchema);
