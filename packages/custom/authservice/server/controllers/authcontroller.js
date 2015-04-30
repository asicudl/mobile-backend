'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  AuthClient = mongoose.model('AuthClient'),
  _ = require('lodash');
/*
* Authorization to change whatever that about your username
*/ 

exports.hasAuthorization = function (req,res,next){
    
  //Security at this point is based on jwt token and is extracted by express-jwt
  if (!req.user || !req.user.username){
        res.status(400).json([{
            msg: 'You must be logged in to create a device',
            param: 'username'
          }]);
  }else if (_.contains(!req.user.roles,'udlaccount')){
        res.status(400).json ([{
            msg: 'It\'s a non official account',
            param: 'role'
        }]);
  }else{
        next();
   }
};   


/**
 * Create authclient
 */
exports.createOrUpdate = function(req, res, next) {

   AuthClient
    .findOne({
        username: req.user.username,
        device: req.body.device
    })
    .exec(function(err, authclient) {
      if (err) return next(err);
      
       if (!authclient) {
         authclient  = new AuthClient(req.body); 
      }
      
       req.assert('username', 'Username cannot be more than 20 characters').len(1, 20);
       req.assert('device', 'Device id cannot be more than 20 characters').len(1, 20);
  
        var errors = req.validationErrors();
        
        if (errors) {
            console.log ('has errors');
            return res.status(400).send(errors);
        }

        //Create a random token
        authclient.token = authclient.makeSalt();
        authclient.authuser = req.user._id;

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
                      console.log ('default');
                      if (err.errors) {
                          console.log ('has errors');
                        for (var x in err.errors) {
                        console.log ('this error is ' + err.errors[x].message);  
                        modelErrors.push({
                            param: x,
                            msg: err.errors[x].message,
                            value: err.errors[x].value
                          });
                        }

                        res.status(400).json(modelErrors);
                      }
                }
        
                
                return res.status(400).json([{
                    msg: 'Error creating token',
                    param: 'username'
                }]);
            }

        res.json ({'token': authclient.token});
        });     
   });
};


