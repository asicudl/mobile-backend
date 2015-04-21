'use strict';

var authservice = require('../controllers/authcontroller');

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Authservice, app, auth, database, passport) {
    
  app.route('/auth/official').post(passport.authenticate('ldapauth',{
      failureFlash: true
    }), function(req, res) {
      res.send({
        redirect: (req.user.roles.indexOf('admin') !== -1) ? req.get('referer') : false
      });
  });
    
  app.route('/auth/token').post(passport.authenticate('localtoken', {
      failureFlash: true
    }), function(req, res) {
      res.send({
        user: req.user, 
        redirect: (req.user.roles.indexOf('admin') !== -1) ? req.get('referer') : false
      });
  });
  
   app.route('/auth/token/create').post(authservice.hasAuthorization, authservice.create);
    
};
