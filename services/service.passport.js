const { authenticate } = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs');
const User = require("../models/model.user.js");
const { STATUS } = require("../config/config.status.js");
const userService = require("../services/service.user.js");

// local strategy, code based of WDS.
async function initialize(passport) {

    console.log("Initialize passport");

    // login
    passport.use(new localStrategy(function (username, password, done) {
        
        
        // check if user exist
        User.findOne({ username: username }, function (err, user) {
            
            if (err) return done(err);
            
            if (!user) { 
                console.log(`username: [${username}] failed, username not found`);
                return done(null, false, { message: 'Passport: username not found' });
            }

            // check if the user is active
            if (user.status !== "active") {
                console.log(`username: [${username}] failed, account not active`);
                return done(null, false, { message: 'User account not active' });
            }

            // compare password
            bcrypt.compare(password, user.password, function (err, res) {
                if (err) return done(err);

                if (res === false) {
                    console.log(`username: [${username}] failed, incorrect password`);
                    //TODO: add failed login attemot counter, node that in prev attempt
                    // the DB didnt get updated with counter, find a new method.
                    // if could be because we are INSIDE User.findOne, we need to be
                    // OUTSIDE User.findOne to make the DB change!
                    return done(null, false, { message: 'Passport: incorrect password' });
                } 

                //success, reset failed login attempt to zero and clear reset password token
                console.log(`username: [${username}] login success`);
                userService.clearResetPwdTokenByUsrId(user._id);
                return done(null, user);

            });
        });
    }));

    // post login event
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    
    // post login event
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

}


// Is Autenticated
function isAuth(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/login");

}

// Not Autenticated
function isNotAuth(req, res, next) {

    if (req.isAuthenticated()) {
        return res.redirect("/dashboard");
    }
    // not
    return next();
    
}


// Check if API AUTH key is valid
function isApiKeyValid(req, res, next) {
    if (req.query.auth !== process.env.APIAUTHKEY ) {
        return res.status(401).json({code: 401, message: "Invalid api authentication key"});
    }
    return next();
}



module.exports =  {
    initialize,
    isAuth,
    isNotAuth,
    isApiKeyValid
}