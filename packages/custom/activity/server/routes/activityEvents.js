'use strict';

var activityEventsCtrl = require('../controllers/activityEvents-controller');


// activityEvents authorization helpers
var hasRolAuth = function(req, res, next) {
    if (!activityEventsCtrl.hasRol(req)) {
        return res.status(401).send('User is not authorized by role permissions');
    }
    next();
};

module.exports = function (ActivityEvents, app, auth, database, authservice) {

    //Routes for authenticated by platform   (administrators, maintainers)
    app.route('/activityevents')
        .get(auth.requiresLogin, hasRolAuth, activityEventsCtrl.all)
        .post(auth.requiresLogin, hasRolAuth, activityEventsCtrl.create);

    app.route('/activityevents/:activityEventId')
        .get(auth.isMongoId, hasRolAuth, activityEventsCtrl.show)
        .put(auth.isMongoId, hasRolAuth, activityEventsCtrl.update)
        .delete(auth.isMongoId, hasRolAuth, activityEventsCtrl.destroy);

    //Finish with setting up the messageId param
    app.param('activityEventId', activityEventsCtrl.activityEvent);


    //Define  the mobile api agendaEvents
    app.route ('/public/activityevents')
        .post (activityEventsCtrl.allNewEvents);    

};
