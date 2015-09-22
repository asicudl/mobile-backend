'use strict';

var serviceDirectoryCtrl = require('../controllers/serviceDirectory-controller');


// serviice directory authorization helpers -- Must be changed by role

var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin) {
        return res.status(401).send('User is not authorized');
    }
    
    next();
};

module.exports = function (ActivityEvents, app, auth, database, authservice) {

    //Routes for authenticated by platform   (administrators, maintainers)
    app.route('/servicedirectory')
        .get(auth.requiresLogin,serviceDirectoryCtrl.all)
        .post(auth.requiresLogin,  serviceDirectoryCtrl.create);

    app.route('/servicedirectory/:serviceDirectoryId')
        .get(auth.isMongoId, serviceDirectoryCtrl.show)
        .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, serviceDirectoryCtrl.update)
        .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, serviceDirectoryCtrl.destroy);

    //Finish with setting up the serviceDirectory Id param
    app.param('serviceDirectoryId', serviceDirectoryCtrl.serviceDirectory);


    //Define  the mobile api service directory
    app.route ('/public/servicedirectory')
        .post (serviceDirectoryCtrl.allNewServices);    

};
