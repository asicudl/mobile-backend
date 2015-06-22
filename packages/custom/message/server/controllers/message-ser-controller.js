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
    ttl: 3600,
};

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
 * Find message by id
 */
exports.deviceToken = function(req, res, next, id) {
    req.deviceToken = id;
    next();
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
    };  

    options.categories = message.receptientsIds;
      
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
  Message.find().sort('-created').limit(50).populate('user', 'name username').exec(function(err, messages) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the messages'
      });
    }
    res.json(messages);

  });
};


/**
 * List of Messages
 */
exports.toMe = function(req, res) {
  
  var searchCriteria =  {'receptientsIds' : req.user.username,'created' : {'$gt': asFarLastWeek(req.body.lastMessageDate)}};
    
  Message.find(searchCriteria).sort('-created').populate('user', 'name username').exec(function(err, messages) {
    if (err) {
	console.log('error ' + err);
      return res.status(500).json({
        error: 'Cannot list the messages'
      });
    }
    res.json({'messages':messages,'currentDate': new Date()});
  });
};


//Those methods should be on other module
exports.registerDevice = function (req,res){
    
    var categories = [];
   
    if (req.body.alias !== 'unregister'){
        categories.push(req.user.username);
    }
    
    agSender.Register( settings             ).register(req.user.username,req.body.deviceToken,req.body.deviceType,req.body.operatingSystem,req.body.osVersion,categories)
    .on( 'success', function( response) {
        res.status(200).json(JSON.parse(response)); 
    })
    .on( 'error', function( err ) {
        res.status(500).send({'err':err}); 
    });      
};

exports.unregisterDevice = function (req,res){
    agSender.Register( settings ).unregister(req.deviceToken)
    .on( 'success', function( response) {
        res.status(200).send(response); 
    })
    .on( 'error', function( err ) {
        res.status(500).send({'err':err}); 
    });     
};

