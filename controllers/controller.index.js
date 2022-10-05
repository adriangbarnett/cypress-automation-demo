const userService = require("../services/service.user.js");



// logout
function logout(req, res) {
    req.logout(function(err) {
      if (err) { return next(err); }
  
      if (req.query.alert) {
        return res.redirect(`/login?alert=${req.query.alert}`);
      }
      return res.redirect('/');
    })
}

// dev testing, show errro page
function error_get(req, res) {

    return res.render("error", {
        response: {
            code: 999,
            heading: "headingText1",
            message: "messageText",
            method: "error_get",
            error: "errorStackTrackText",
            alert: req.query.alert
        },
        topnavproperties: req.topnavproperties 
    });

}


// show about page
function about_get(req, res) {
    try {

        return res.render("about", {
            response: {
                code: 200,
                message: null,
                method: "about_get",
                error: null,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties
        });

    } catch (e) {
        
        return res.render("error", {
            response:{
                code: 500,
                heading: "Error",
                message: "exception",
                method: "about_get",
                error: e.stack,
                alert: req.query.alert 
            },
            topnavproperties: req.topnavproperties
        });
    }
}

// show index (home) page
function index_get(req, res) {
    try {

        return res.render("index", {
            response: {
                code: 200,
                message: null,
                method: "index_get",
                error: null,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties
        });

    } catch (e) {
        return res.render("error", {
            response: {
                code: 500,
                heading: "Error",
                message: "exception",
                method: "index_get",
                error: e.stack,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties
        });
    }
}

// shopw login page
function login_get(req, res) {
    try {

        return res.render("user/login", {
            response: {
                code: 200,
                message: null,
                method: "login_get",
                error: null,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
            // loginfail: req.query.loginfail,
            // resetpwdsuccess: req.query.resetpwdsuccess, 
            // passwordchangesuccess: req.query.passwordchangesuccess,
            // registersuccess: req.query.registersuccess,
            // style: req.query.style
        });

    } catch (e) {
        return res.render("error", {
            response: {
                code: 500,
                heading: "Error",
                message: "exception",
                method: "login_get",
                error: e.stack,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
        });
    }
}


module.exports = {
    logout,
    error_get,
    index_get,
    login_get,
    about_get,
}