'use strict';

var serviceDirectoryCtrl = require('../controllers/serviceDirectory-controller');


// service directory authorization helpers -- Must be changed by role
var hasRolAuth = function(req, res, next) {
    if (!serviceDirectoryCtrl.hasRol(req)) {
        return res.status(401).send('User is not authorized by role permissions');
    }
    next();
};

module.exports = function (ActivityEvents, app, auth, database, authservice) {

    //Routes for authenticated by platform   (administrators, maintainers)
    app.route('/servicedirectory')
        .get(auth.requiresLogin, hasRolAuth, serviceDirectoryCtrl.all)
        .post(auth.requiresLogin, hasRolAuth, serviceDirectoryCtrl.create);

    app.route('/servicedirectory/:serviceDirectoryId')
        .get(auth.isMongoId, hasRolAuth, serviceDirectoryCtrl.show)
        .put(auth.isMongoId, auth.requiresLogin, hasRolAuth, serviceDirectoryCtrl.update)
        .delete(auth.isMongoId, auth.requiresLogin, hasRolAuth, serviceDirectoryCtrl.destroy);

    //Finish with setting up the serviceDirectory Id param
    app.param('serviceDirectoryId', serviceDirectoryCtrl.serviceDirectory);


    //Define  the mobile api service directory
    app.route ('/public/servicedirectory')
        .post (serviceDirectoryCtrl.allNewServices);    

};
