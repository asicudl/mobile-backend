'use strict';

var authservice = require('../controllers/authcontroller'),
  expressJwt = require('express-jwt'),
  jwt = require('jsonwebtoken'),
  config = require('meanio').loadConfig();


/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Authservice, app, auth, database, passport) {

    
    // We are going to protect /api routes with JWT
    app.use('/api', expressJwt({secret: config.token.secret}));
    
    /*app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    
    //EVER response the options
    app.options('*', function(req, res){
        res.send(200);
    });*/
 
  var sendToken = function (req,res){
       var token = jwt.encode({ user: req.user}, config.token.secret);
       res.json({ token : token });
  };
    
  app.route('/api/auth/official').post(passport.authenticate('official',{
      failureFlash: true
    }),sendToken);
    
  app.route('/api/auth/token').post(passport.authenticate('appstoredtoken', {
      failureFlash: true
    }), sendToken);
  
   app.route('/auth/token/create').post(authservice.hasAuthorization, authservice.create);
    
};
