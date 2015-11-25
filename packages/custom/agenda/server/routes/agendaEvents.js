'use strict';

var agendaEventsCtrl = require('../controllers/agendaEvents-controller');

// AgendaEvents authorization helpers
var hasRolAuth = function(req, res, next) {
    if (!agendaEventsCtrl.hasRol(req)) {
        return res.status(401).send('User is not authorized by role permissions');
    }
    next();
};

module.exports = function (AgendaEvents, app, auth, database, authservice) {

    //Routes for authenticated by platform   (administrators, maintainers)
    app.route('/agendaevents')
        .get(auth.requiresLogin, hasRolAuth, agendaEventsCtrl.all)
        .post(auth.requiresLogin, hasRolAuth, agendaEventsCtrl.create);

    app.route('/agendaevents/:agendaEventId')
        .get(auth.isMongoId, hasRolAuth, agendaEventsCtrl.show)
        .put(auth.isMongoId, auth.requiresLogin, hasRolAuth, agendaEventsCtrl.update)
        .delete(auth.isMongoId, auth.requiresLogin, hasRolAuth, agendaEventsCtrl.destroy);

    //Finish with setting up the messageId param
    app.param('agendaEventId', agendaEventsCtrl.agendaEvent);


    //Define  the mobile api agendaEvents
    app.route ('/public/agendaevents')
        .post (agendaEventsCtrl.allNewEvents);    

};
