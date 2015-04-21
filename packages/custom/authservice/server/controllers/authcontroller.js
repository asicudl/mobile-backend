'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  AuthClient = mongoose.model('AuthClient');
  

/*
* Authorization to change whatever that about your username
*/ 

exports.hasAuthorization = function (req,res,next){
  //Security 
    
   if (!req.user || !req.user.username){
        res.status(400).json([{
            msg: 'You must be logged in to create a device',
            param: 'username'
          }]);
   } else if (req.user.username !== req.body.username){
          res.status(400).json([{
            msg: 'You are not login as this user',
            param: 'username'
          }]);
    }else{
        next();
    }
};   


/**
 * Create authclient
 */
exports.create = function(req, res, next) {
    
  var authclient = new AuthClient(req.body);

  req.assert('username', 'Username cannot be more than 20 characters').len(1, 20);
  req.assert('device', 'Device id cannot be more than 20 characters').len(1, 20);
  
  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  //Create a random token
  authclient.token = authclient.makeSalt();
  authclient.authuser = req.user;
      
  authclient.save(function(err) {
    if (err) {
      switch (err.code) {
        case 11000:
        case 11001:
          res.status(400).json([{
            msg: 'Username already taken',
            param: 'username'
          }]);
          break;
        default:
          var modelErrors = [];

          if (err.errors) {

            for (var x in err.errors) {
              modelErrors.push({
                param: x,
                msg: err.errors[x].message,
                value: err.errors[x].value
              });
            }

            res.status(400).json(modelErrors);
          }
      }

      return res.status(400);
    }
    
    res.json ({'token': authclient.token});
  });
};

