'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Message Schema
 */
var MessageSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  siteId: {
    type: String,
    required: false,
    trim: true
  },
  siteTitle: {
    type: String,
    required: false,
    trim: true
  },
  author: {
    type: String,
    required: false,
    trim: true
  },
  notiURL:{
    type: String,
    required: false,
    trim: true
  },
  receptientsIds: [String],
  content: {
    type: String,
    required: true,
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
MessageSchema.path('subject').validate(function(subject) {
  return !!subject;
}, 'Subject cannot be blank');

MessageSchema.path('content').validate(function(content) {
  return !!content;
}, 'Content cannot be blank');

/**
 * Statics
 */
MessageSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Message', MessageSchema);
