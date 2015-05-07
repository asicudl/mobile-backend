'use strict';

var mongoose = require('mongoose'),
  LDAPStrategy = require('passport-ldapauth').Strategy,
  TokLocalStrategy = require('passport-local').Strategy,
  BasicRegisterStrategy = require('passport-http').BasicStrategy,
  User = mongoose.model('User'),
  AuthClient = mongoose.model('AuthClient'),
  config = require('meanio').loadConfig();

module.exports = function(passport){
    
    /*This strategy will run over LDAP and generate a JWT to keep API operations*/
    
    passport.use('official',new LDAPStrategy(
        {
            server: {
                url: config.ldap.url,
                bindCredentials: '',
                searchBase: config.ldap.base,
                searchFilter: '(uid={{username}})'
            }
        },
        
        function(profile, done) {
            
            User.findOne({
                'username': profile.uid 
            }, function(err, user) {
            
                if (err) {
                    return done(err);
                }
                
                var updatedUser = new User({
                  email: profile.mail,
                  name: profile.displayName,
                  username: profile.uid,
                  provider: 'udl',
                  roles: ['udlaccount']
                });
                
                //Just create or update email if different
                if (!user || updatedUser.email !== user.email){
                    updatedUser.save(function(err) {
                        if (err) {
                            console.log(err);
                            return done(null, false, {message: 'UdL login failed, already used by other login strategy'});
                        } else {
                            return done(err, updatedUser);
                        }    
                    });
                }else{
                     return done(err,user);         
                }
            });
        }
    ));
    
    
  /*This strategy will run over LOCAL mobile app token storage and generate a JWT to keep API operations*/
    
  passport.use('appstoredtoken', new TokLocalStrategy(
      {
          usernameField: 'username',
          passwordField: 'token',
          passReqToCallback: true
      },
    
      function(req, username, password, done) {
      
          var device = req.body.device;
          var token = req.body.token;

          //We use the custon search to get the populated user. //We must user performance test
          AuthClient.findAuthClient(username,device,
            function(err, authclient) {
              if (err) {
                  return done(err);
              }

              if (!authclient) {
                  return done(null, false, {
                      message: 'Unknown user'
                  });
              }

            if (!authclient.authenticate(token)) {
              return done(null, false, {
                message: 'Invalid token'
              });
            }
            return done(null, authclient.authuser);
          });
        }
    ));
    
    /* This strategy will be usefull to handle the registration aerogear service */
    
    passport.use('basic-registration',new BasicRegisterStrategy(
        function(username, password, done) {
            var userValues = username.split(';;');
  
            //Handle username and device from username parameter received from 
            if (userValues.length === 2){
                var token = password;
                    
                AuthClient.findAuthClient( userValues[0],userValues[1],
                    function(err, authclient) {

                        if (err) {
                            console.log ('error'); 
                            return done(err);
                        }

                        if (!authclient) {
                            console.log ('notfound');
                            return done(null, false, {
                                message: 'Unknown user'
                            });
                        }

                        if (!authclient.authenticate(token)){
                            console.log ('notokenw');
                          return done(null, false, {
                            message: 'Invalid token'
                          });
                        }
                        
                        //Copy the    
                        var user = authclient.authuser;
                        //Make it accessible for later operations
                        user.authclient = authclient;
                    
                        return done(null, authclient.authuser);
                  });
            }else{
                console.log ('fuck');
                return done(null,false,{message:'Invalid user'});
            }
        }
    ));

};