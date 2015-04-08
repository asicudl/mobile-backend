'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Message = mongoose.model('Message'),
  _ = require('lodash'),
  agSender = require('unifiedpush-node-sender'),
  settings = require('./msg-settings.json');


var options = {
    config: {
        ttl: 3600,
    }/*
    criteria: {
        variants: [ "1234", "56788" ],
        categories: [ "category1", "category2" ]
    }*/
};




/**
 * Find message by id
 */
exports.message = function(req, res, next, id) {
  Message.load(id, function(err, message) {
    if (err) return next(err);
    if (!message) return next(new Error('Failed to load message ' + id));
    req.message = message;
    next();
  });
};

/**
 * Create an message
 */
exports.create = function(req, res) {
  var message = new Message(req.body);
  message.user = req.user;

  message.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot save the message'
      });
    }
    
      
    //Send it to the platform
    var sendMessage = {
        alert: message.subject,
        sound: 'default',
        badge: 2,
        simplePush: 'version=123',
        contentAvailable: true,
        'udl-noti-subject': message.subject,
        'udl-noti-site': message.siteId,
        'udl-noti-sitename': message.siteTitle,
        'udl-noti-body': message.content,
        'udl-noti-category':'cv',
        'udl-noti-url': message.notiURL,
        'udl-noti-state': 'read'
     
    };  
      
    agSender.Sender( settings ).send( sendMessage, options )
    .on( 'success', function( response ) {
        console.log( 'success called', response );
    })
    .on( 'error', function( err ) {
        console.log( err );
    });      
      
    res.json(message);
      
  });
};

/**
 * Update an message
 */
exports.update = function(req, res) {
  var message = req.message;

  message = _.extend(message, req.body);

  message.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the message'
      });
    }
    res.json(message);

  });
};

/**
 * Delete an message
 */
exports.destroy = function(req, res) {
  var message = req.message;

  message.remove(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot delete the message'
      });
    }
    res.json(message);

  });
};

/**
 * Show an message
 */
exports.show = function(req, res) {
  res.json(req.message);
};

/**
 * List of Messages
 */
exports.all = function(req, res) {
  Message.find().sort('-created').populate('user', 'name username').exec(function(err, messages) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the messages'
      });
    }
    res.json(messages);

  });
};
