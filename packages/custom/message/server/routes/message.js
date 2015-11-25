'use strict';

var messages = require('../controllers/message-ser-controller');
  

// Message authorization helpers
var hasRolAuth = function(req, res, next) {
    if (!messages.hasRol(req)) {
        return res.status(401).send('User is not authorized by role permissions');
    }
    next();
};

module.exports = function(Messages, app, auth, database,authservice) {

  //Routes for authenticated by platform   (administrators, maintainers)
    
  app.route('/messages')
    .get(auth.requiresLogin, hasRolAuth, messages.all)
    .post(auth.requiresLogin, hasRolAuth, messages.create);
  app.route('/messages/:messageId')
    .get(auth.isMongoId, hasRolAuth, messages.show)
    .put(auth.isMongoId, auth.requiresLogin, hasRolAuth, messages.update)
    .delete(auth.isMongoId, auth.requiresLogin, hasRolAuth, messages.destroy);

  //Finish with setting up the messageId param
  app.param('messageId', messages.message);

 //Define  the mobile api messages
 app.route ('/api/messages')
     .post (authservice.hasAuthorization, messages.toMe);    
    
 app.route ('/aero/rest/registry/device').post(authservice.canBeRegistered, messages.registerDevice);
 app.route ('/aero/rest/registry/device/:deviceToken').delete(authservice.canBeRegistered, messages.unregisterDevice);
    
 app.param ('deviceToken',messages.deviceToken);
};
