'use strict';

var activityEventsCtrl = require('../controllers/activityEvents-controller');


// AgendaEvents authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

module.exports = function (ActivityEvents, app, auth, database, authservice) {

    //Routes for authenticated by platform   (administrators, maintainers)
    app.route('/activityevents')
        .get(auth.requiresLogin,activityEventsCtrl.all)
        .post(auth.requiresLogin,  activityEventsCtrl.create);

    app.route('/activityevents/:activityEventId')
        .get(auth.isMongoId, activityEventsCtrl.show)
        .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, activityEventsCtrl.update)
        .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, activityEventsCtrl.destroy);

    //Finish with setting up the messageId param
    app.param('activityEventId', activityEventsCtrl.activityEvent);


    //Define  the mobile api agendaEvents
    app.route ('/api/activityevents')
        .post (activityEventsCtrl.allNewEvents);    

};
