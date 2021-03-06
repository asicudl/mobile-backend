'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Activity Events Schema
 */
var ActivityEventsSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    dueDate: {
        type: Date
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
    image:{
        type: String    ,
        required: false,
    },
    published:{
        type: Boolean,
        default: false,
    },
    state:{
        type: String,
        default: 'active',
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
    
});

/**
 * Validations
 */
ActivityEventsSchema.path('title').validate(function(title) {
    return !!title;
}, 'Title cannot be blank');

ActivityEventsSchema.path('content').validate(function(content) {
    return !!content;
}, 'Content cannot be blank');

ActivityEventsSchema.path('dueDate').validate(function(dueDate) {
    return !!dueDate;
}, 'Due date must be set');

ActivityEventsSchema.path('period').validate(function(period) {
    return !!period;
}, 'Period cannot be blank');

/**
 * Statics
 */
ActivityEventsSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('ActivityEvents', ActivityEventsSchema);