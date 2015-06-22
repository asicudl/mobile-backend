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
    title: {
        type: String,
        required: true,
        trim: true
    },
    period:{
        type: String,
        required: true,
        trim: true
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
    eventURL:{
        type: String,
        required: false,
        trim: true
    },
    eventURLTitle:{
        type: String,
        required: false,
        trim: true
    },
    image:{
        type: String,
        required: false,
        trim: true
    },
    published:{
        type: Boolean,
        default: false,
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

AgendaEventsSchema.path('period').validate(function(period) {
    return !!period;
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
