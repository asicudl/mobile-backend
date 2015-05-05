'use strict';

var messages = require('../controllers/message-ser-controller');
  

// Message authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.message.user.id !== req.user.id) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

module.exports = function(Messages, app, auth, database,authservice) {

  //Routes for authenticated by platform   (administrators, maintainers)
    
  app.route('/messages')
    .get(auth.requiresLogin,messages.all)
    .post(auth.requiresLogin, messages.create);
  app.route('/messages/:messageId')
    .get(auth.isMongoId, messages.show)
    .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, messages.update)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, messages.destroy);

  //Finish with setting up the messageId param
  app.param('messageId', messages.message);

 //Define  the mobile api messages
 app.route ('/api/messages')
     .post (authservice.hasAuthorization, messages.toMe);    
    
};
