'use strict';

var agendaEventsCtrl = require('../controllers/agendaEvents-controller');


// AgendaEvents authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

module.exports = function (AgendaEvents, app, auth, database, authservice) {

    //Routes for authenticated by platform   (administrators, maintainers)
    app.route('/agendaevents')
        .get(auth.requiresLogin,agendaEventsCtrl.all)
        .post(auth.requiresLogin, agendaEventsCtrl.create);

    app.route('/agendaevents/:agendaEventId')
        .get(auth.isMongoId, agendaEventsCtrl.show)
        .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, agendaEventsCtrl.update)
        .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, agendaEventsCtrl.destroy);

    //Finish with setting up the messageId param
    app.param('agendaEventId', agendaEventsCtrl.agendaEvent);


    //Define  the mobile api agendaEvents
    app.route ('/api/agendaevents')
        .post (agendaEventsCtrl.allNewEvents);    

};
