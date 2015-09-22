'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Service Directory  Schema
 */
var ServiceDirectorySchema = new Schema({
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
    gmapsURL: {
        type: String,
        required: false,
        trim: true
    },
    URL:{
        type: String,
        required: false,
        trim: true
    },
    phoneNumber:{
        type: String,
        required: false,
        trim: true
    },
    attendingSchedule: {
        type: String,
        required: false,
        trim: true
    },
    email:{
        type: String,
        required: false,
        trim: true
    },
    image:{
        type: String    ,
        required: false,
    },
    status:{
        type: String,
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
ServiceDirectorySchema.path('title').validate(function(title) {
    return !!title;
}, 'Title cannot be blank');

ServiceDirectorySchema.path('content').validate(function(content) {
    return !!content;
}, 'Content cannot be blank');

/**
 * Statics
 */
ServiceDirectorySchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('ServiceDirectory', ServiceDirectorySchema);