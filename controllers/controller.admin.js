

// show dashboard
function dashboard_get(req, res) {
    try {

        return res.render("dashboard", {
            response: {
                code: 200,
                message: `Welcome ${req.user.username}`,
                method: "resetpwd_post",
                error: null,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties
        })

    } catch (e) {
        return res.render("error", {
            response: {
                code: 500,
                heading: "Error",
                message: "exception",
                method: "dashboard_get",
                error: e.stack,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
        });
    }
}


module.exports = {
    dashboard_get
}