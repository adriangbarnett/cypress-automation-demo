const userService = require("../services/service.user.js");
const validateEmail = require("../utils/utils.js").validateEmail;


// show signup page
function signup_get(req, res) {
    try {

        return res.render("user/signup", {
            response: {
                code: 200,
                message: null,
                method: "signup_get",
                error: null,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
        });

    } catch (e) {
        return res.render("error", {
            response: {
                code: 500,
                heading: "Error",
                message: "exception",
                method: "signup_get",
                error: e.stack,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
        });
    }
}

//
async function signup_post(req, res) {

    try {

        let user = req.body;

        // input validation
        if (!user.username) {
            return res.render("user/signup", {
                response: {
                    code: 400,
                    message: "Missing username",
                    method: "signup_post",
                    error: null,
                    alert: "danger"
                },
                topnavproperties: req.topnavproperties,
            });
        }

        if (!user.email) {
            return res.render("user/signup", {
                response: {
                    code: 400,
                    message: "Missing email",
                    method: "signup_post",
                    error: null,
                    alert: "danger"
                },
                topnavproperties: req.topnavproperties,
            });
        }

        if (!user.password || !user.confirmpassword) {
            return res.render("user/signup", {
                response: {
                    code: 400,
                    message: "Missing password",
                    method: "signup_post",
                    error: null,
                    alert: "danger"
                },
                topnavproperties: req.topnavproperties,
            });
        }

        if (user.password !== user.confirmpassword) {
            return res.render("user/signup", {
                response: {
                    code: 400,
                    message: "Passwords do not match",
                    method: "signup_post",
                    error: null,
                    alert: "danger"
                },
                topnavproperties: req.topnavproperties,
            });
        }

        // check user nbot already exist
        const findUser = await userService.getUserByUsername(user.username);
        if (findUser) {
            return res.render("user/signup", {
                response: {
                    code: 400,
                    message: "Username taken",
                    method: "signup_post",
                    error: null,
                    alert: "danger"
                },
                topnavproperties: req.topnavproperties,
            });
        }

        // set some values
        user.roles = ["user"];
        user.status =  "active";

        // add user to db
        const ret = await userService.createUser(user);

        // Update form with response
        if (ret.code != 200) {
            return res.render("user/signup", {
                response: {
                    code: 400,
                    message: ret.message,
                    method: "signup_post",
                    error: ret.error,
                    alert: "danger"
                },
                topnavproperties: req.topnavproperties,
            });
        }

        // success
        return res.redirect("/login?alert=4")

    } catch (e) {
       
        return res.render("error", {
            response: {
                code: 500,
                heading: "Error",
                message: "exception",
                method: "signup_post",
                error: e.stack,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
        });
    }
}

// show reset password page
function resetpwd_get(req, res) {
    try {

        return res.render("user/resetpwd", {
            response: {
                code: 200,
                message: null,
                method: "resetpwd_get",
                error: null,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
        });

    } catch (e) {
       
        return res.render("error", {
            response: {
                code: 500,
                heading: "Error",
                message: "exception",
                method: "resetpwd_get",
                error: e.stack,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
            
        });
    }
}

// reset password submit button clicked, 
// search for user, if exist generate a token
// then show token on page (simulate email sent token)
async function resetpwd_post(req, res) {
    try {

        const username = req.body.username;

        if (!username) {
            return res.render("user/resetpwd", {
                response: {
                    code: 400,
                    message: "Username required",
                    method: "resetpwd_post",
                    error: null,
                    alert: req.query.alert
                },
                topnavproperties: req.topnavproperties,
            });
        }

        // Generate reset password link and send by email
        // for dev testing we show link on this page.
        const tokenResponse = await userService.generateResetPasswordLink(username);
        if (tokenResponse.code !== 200) {

            return res.render("user/resetpwd", {
                response: {
                    code: tokenResponse.code,
                    message: tokenResponse.message,
                    method: "resetpwd_post",
                    error: tokenResponse.error,
                    alert: req.query.alert
                },
                topnavproperties: req.topnavproperties,
            });
        }

        // success: show reset password link
        return res.render("user/resetpwd", {
            response: {
                code: 200,
                message: `http://${process.env.HOSTID}/setpwd?token=${tokenResponse.token}`,
                method: "resetpwd_post",
                error: null,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
        });


    } catch (e) {
        return res.render("error", {
            response: {
                code: 500,
                heading: "Error",
                message: "exception",
                method: "resetpwd_post",
                error: e.stack,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
        });
    }
}


// user click reset password link, check url data when show set new password page
// we dont expose the database ID in the URL, we seearch for user by the generated token
async function useToken_get(req, res) { //setpwd_get

    try {

        // url checks
        if (!req.query.token) {
            return res.render("error", {
                response: {
                    code: 400,
                    heading: "Error",
                    message: "Missing token in url",
                    method: "setpwd_get",
                    error: e.stack,
                    alert: req.query.alert
                },
                topnavproperties: req.topnavproperties,
            });
        }


        // get user from DB by TOKEN
        const user = await userService.getUserByToken(req.query.token);

        if (!user) {
            return res.render("error", {
                response: {
                    code: 400,
                    heading: null,
                    message: "token not found",
                    method: "setpwd_get",
                    error: null,
                    alert: "danger"
                },
                topnavproperties: req.topnavproperties,
            });
        }

        // check not expired
        const currentDateTime = new Date();

        if (currentDateTime > user.tokenExpire) {
            return res.render("error", {
                response: {
                    code: 400,
                    heading: "Error",
                    message: "token expired",
                    method: "setpwd_get",
                    error: null,
                    alert: "danger"
                },
                topnavproperties: req.topnavproperties,
            });
        }

        // show input password page.
        return res.render("user/setpwd", {
            response: {
                code: 200,
                heading: null,
                message: "Input a new password",
                method: "setpwd_get",
                error: null,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
            token: req.query.token
        });


    } catch (e) {
        return res.render("error", {
            response: {
                code: 500,
                heading: "Error",
                message: "exception",
                method: "setnewpwd_get",
                error: e.stack,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
        });
    }
}

// user inputed password, update user id
async function useToken_post(req, res) { //setpwd_post

    try {

        const newData = req.body;

        // url checks
        if (!newData.token) {
            return res.render("error", {
                response: {
                    code: 400,
                    heading: "Error",
                    message: "Missing token",
                    method: "setpwd_post",
                    error: e.stack,
                    alert: req.query.alert
                },
                topnavproperties: req.topnavproperties,
            });
        }


        // check password1 and password2
        if (!newData.password1 || !newData.password2) {
            return res.render("user/setpwd", {
                response: {
                    code: 400,
                    heading: null,
                    message: "Misisng 'password 1' or/and 'confirm password' value",
                    method: "setpwd_post",
                    error: null,
                    alert: req.query.alert
                },
                topnavproperties: req.topnavproperties,
                token: newData.token
            });
        }

        if (newData.password1 !== newData.password2) {
            return res.render("user/setpwd", {
                response: {
                    code: 400,
                    heading: null,
                    message: "Passwords do not match",
                    method: "setpwd_post",
                    error: null,
                    alert: req.query.alert
                },
                topnavproperties: req.topnavproperties,
                token: newData.token
            });
        }

        // get user from DB by TOKEN
        const user = await userService.getUserByToken(newData.token);

        if (!user) {
            return res.render("user/setpwd", {
                response: {
                    code: 400,
                    heading: null,
                    message: "token not found" + newData.token,
                    method: "setpwd_post",
                    error: null,
                    alert: req.query.alert
                },
                topnavproperties: req.topnavproperties,
                token: newData.token
            });
        }

        // check not expired
        const currentDateTime = new Date();

        if (currentDateTime > user.tokenExpire) {
            return res.render("error", {
                response: {
                    code: 400,
                    heading: null,
                    message: "token expired",
                    method: "setpwd_post",
                    error: null,
                    alert: req.query.alert
                },
                topnavproperties: req.topnavproperties,
            });
        }

        // all checks passed, prepare new data and clear token so cant be resuxed
        const resetTokenData = await userService.setNewToken("INVALID","INVALID");

        const userData = {
            password: req.body.password,
            token: resetTokenData.token,
            tokenExpire: resetTokenData.tokenExpire,
            failedLoginAttempts: 0
        }

        // send update
        const ret = await userService.updateUserById(user._id, userData);

        // check for update error
        if (ret.code !== 200) {

            return res.render("user/setpwd", {
                response: {
                    code: 400,
                    heading: ret.code,
                    message: ret.message,
                    method: "setpwd_post",
                    error: ret.error,       //todo check ejs and Fix the dupplicate
                    errList: ret.error,      //todo check ejs and Fix the dupplicate
                    alert: req.query.alert
                },
                topnavproperties: req.topnavproperties,
            });
        }
         
        // success
        return res.redirect("/login?passwordchangesuccess=true")


    } catch (e) {
        return res.render("error", {
            response: {
                code: 500,
                heading: "Error",
                message: "exception",
                method: "setnewpwd_get",
                error: e.stack,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
        });
    }

}

// Get all users
async function users_get(req, res) {
    try {

        const users = await userService.getAllUsers();

        return res.render("user_admin/users", {
            response: {
                code: 200,
                message: null,
                method: "users_get",
                error: null,
                alert: req.query.alert
            },
            users: users,
            topnavproperties: req.topnavproperties,
        });

    } catch (e) {
        
        return res.render("error", {
            response:{
                code: 500,
                heading: "Error",
                message: "exception",
                method: "users_get",
                error: e.stack, 
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
        });
    }
}

// Get one user
async function user_get(req, res) { 
    try {

        const id = req.query.id;

        if(!id) {
            return res.redirect("/user");
        }

        const user = await userService.getUserById(id);
        if (!user) {
            return res.redirect("/user");
        }

        return res.render("user_admin/user", {
            response: {
                code: 200,
                message: null,
                method: "user_get",
                error: null,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
            user: user,
        });

    } catch (e) {
        
        return res.render("error", {
            response:{
                code: 500,
                heading: "Error",
                message: "exception",
                method: "user_get",
                error: e.stack, 
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
        });
    }
}


// update user
async function user_post(req, res) { 
    try {

        const id = req.query.id;
        const user = req.body;

        if(!id) {
            return res.redirect("/user");
        }

        if (!user.username) { 
            return res.render("user_admin/user", {
                response: {
                    code: 400,
                    message: "Missing username",
                    method: "user_post",
                    error: null,
                    alert: "danger"
                },
                topnavproperties: req.topnavproperties,
                user: user,
            });
        }

        if (!user.email) { 
            return res.render("user_admin/user", {
                response: {
                    code: 400,
                    message: "Missing email",
                    method: "user_post",
                    error: null,
                    alert: "danger"
                },
                topnavproperties: req.topnavproperties,
                user: user,
            });
        }

        // convert roles from checkbox value to proper array
        let fixedRoles = [];
        const strReqBody = JSON.stringify(req.body);

        
        // check current user not trying to hack, and apply a system admin role
        if (strReqBody.includes(`"role.system":"on"`) === true && req.user.roles.includes("system") !== true) {
            
            return res.render("user_admin/user", {
                response:{
                    code: 403,
                    heading: "Error",
                    message: "You do not have permission to save [system] role",
                    method: "user_post",
                    error: null, 
                    alert: "danger"
                },
                topnavproperties: req.topnavproperties,
                user: user,
            });
        }   

        // Add only assigned roles to the array
        for(r=0; r!=ROLE.length; r++) {
            if (strReqBody.includes(`"role.${ROLE[r].name}":"on"`) === true) {
                fixedRoles.push(ROLE[r].name);
            }
        }
        user.roles = fixedRoles;

        // Update
        const ret = await userService.updateUserById(user.id, user);

             // fail
             if (ret.code !== 200) {
                return res.render("user_admin/user", {
                    response: {
                        code: ret.code,
                        message: ret.message + " | invalid ID or user not found",
                        method: "user_post",
                        error: ret.error,
                        alert: "danger"
                    },
                    topnavproperties: req.topnavproperties,
                    user: user,
                });
            }

            // success
             // manualy set "message" because "ret" does not send back a message
             return res.render("user_admin/user", {
                response: {
                    code: 200,
                    message: "User updated",
                    method: "user_post",
                    error: null,
                    alert: "success"
                },
                topnavproperties: req.topnavproperties,
                user: user,
            });

    } catch (e) {
        
        return res.render("error", {
            response:{
                code: 500,
                heading: "Error",
                message: "exception",
                method: "user_post",
                error: e.stack, 
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
        });
    }
}

// delete one user
async function user_delete(req, res) {

    try {

        const id = req.query.id;

        if(!id) {
            return res.redirect("/users");
        }

        // check if target user us system user AND if current user not system user
        const targetUser = await userService.getUserById(id);
        if (!targetUser) {
             // not found
             return res.redirect("/admin/users?alert=6");
        }
        if (targetUser.roles.includes("system") && req.user.roles.includes("system") !== true) {
            // permission denied
            return res.redirect("/admin/users?alert=5");
        }
  
        // find user and delete it
        const resp = await userService.deleteUserById(id);
        if (resp.deletedCount !== 1) {
            // delete count was 0, user not found ?
            return res.redirect("/admin/users?alert=6");
        }

        // success
        return res.redirect("/admin/users?alert=7");

    } catch (e) {
        
        return res.render("error", {
            response:{
                code: 500,
                heading: "Error",
                message: "exception",
                method: "user_delete",
                error: e.stack,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties 
        });
    }
}

// show select user change password page
async function user_chgpwd_get(req, res) {

    try {

        //
        const id = req.query.id;
        if (!id) {
            // missing id
            return res.redirect("/admin/users?alert=11");
        }

        // get user from db and check if non-sustem user try to touch system user
        const targetUser = await userService.getUserById(id);
        if(!targetUser) { 
            // not found
            return res.redirect(`/admin/user/edit?id=${id}&alert=6`);
        }
        if (targetUser.roles.includes("system") === true && req.user.roles.includes("system") === false) {
            // permision denied
            return res.redirect(`/admin/user/edit?id=${id}&alert=10`); 
        }

        // show change pwd page
        return res.render("user_admin/chgpwd", {
            response: {
                code: 200,
                message: null,
                method: "user_chgpwd_get",
                error: null,
                alert: null,
                id: id,
            },
            topnavproperties: req.topnavproperties,
        });


    } catch (e) {
        return res.render("error", {
            response:{
                code: 500,
                heading: "Error",
                message: "exception",
                method: "user_chgpwd_get",
                error: e.stack,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties 
        });
    }

}

// submit new password for select user
async function user_chgpwd_post(req, res) {

    try {
       
        const id = req.query.id;
        const user = req.body;

        if (!id) {
            // missing id
            res.redirect("/admin/users?alert=11");
        }

        // Were doing this check AGAIN, incase we user somehow by-passed the get step.
        // get user from db and check if non-sustem user try to touch system user
        const targetUser = await userService.getUserById(id);
        if(!targetUser) { 
            // not found
            return res.redirect(`/admin/user/edit?id=${id}&alert=6`);
         }
        if (targetUser.roles.includes("system") === true && req.user.roles.includes("system") === false) {
            // permision denied
            return res.redirect(`/admin/user/edit?id=${id}&alert=10`); 
        }

               

        // error checks
        if (!user.password || !user.confirmpassword) {
            return res.render("user_admin/chgpwd", {
                response: {
                    code: 400,
                    message: "Missing password",
                    method: "user_chgpwd_post",
                    error: null,
                    alert: "danger",
                    id: id,
                },
                topnavproperties: req.topnavproperties,
            });
        }
        if (user.password !== user.confirmpassword) {
            return res.render("user_admin/chgpwd", {
                response: {
                    code: 400,
                    message: "Passwords do not match",
                    method: "user_chgpwd_post",
                    error: null,
                    alert: "danger",
                    id: id,
                },
                topnavproperties: req.topnavproperties,
            });
        }

        // update db
        const userData = {
            password: req.body.password,
        }
        const ret = await userService.updateUserById(req.user._id, userData);

        if (ret.code !== 200) {
            return res.render("user_admin/chgpwd", {
                response: {
                    code: ret.code,
                    message: ret.message,
                    method: "user_chgpwd_post",
                    error: ret.error,
                    alert: "danger",
                    id: id,
                },
                topnavproperties: req.topnavproperties,
            });
        }

        // succes: user updated
        return res.redirect(`/admin/user/edit?id=${id}&alert=8`)


    } catch (e) {
        return res.render("error", {
            response:{
                code: 500,
                heading: "Error",
                message: "exception",
                method: "user_chgpwd_post",
                error: e.stack,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties 
        });
    }
}

// show profile page for current user
async function profile_get(req, res) {

    try {

        return res.render("user/profile", {
            response:{
                code: 200,
                heading: null,
                message: null,
                method: "profile_get",
                error: null,
                alert: req.query.alert,
                user: getReqUserData(req)
            },
            topnavproperties: req.topnavproperties,
        });

    } catch (e) {
        return res.render("error", {
            response:{
                code: 500,
                heading: "Error",
                message: "exception",
                method: "profile_get",
                error: e.stack,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
        });
    }

}

// only send actual vales we allow user to touch
// dont send entire "req.user", to profile page 
function getReqUserData(req){
    const user = {
        username: req.user.username,
        email: req.user.email,
    }
    return user;
}

// show profile change password page
async function profile_chgpwd_get(req, res) {
    try {

        return res.render("user/profile_chgpwd", {
            response:{
                code: 200,
                heading: null,
                message: null,
                method: "profile_chgpwd_get",
                error: null,
                alert: req.query.alert,
                user: getReqUserData(req)
            },
            topnavproperties: req.topnavproperties,
        });

        
    }  catch (e) {
        return res.render("error", {
            response:{
                code: 500,
                heading: "Error",
                message: "exception",
                method: "profile_chgpwd_get",
                error: e.stack,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
        });
    }
}

// profile submit new password
async function profile_chgpwd_post(req, res) {
    try {

        // checks
        const data = req.body;
        if (!data.password || !data.confirmpassword) {
            return res.redirect("/profile/chgpwd?alert=12")
        }

        if (data.password !== data.confirmpassword) {
            return res.redirect("/profile/chgpwd?alert=13")
        }
        
        // only set the values we allow user to touch
        // do not allow user to touch status, roles etc
        let newData = {
            password: data.password,
        }

        // update current user only
        const ret = await userService.updateUserById(req.user._id, newData);

        if (ret.error) {
            return res.render("user/profile_chgpwd", {
                response:{
                    code: 400,
                    heading: null,
                    message: ret.message,
                    method: "profile_chgpwd_get",
                    error: ret.error, //errList
                    alert: "danger",
                    user: getReqUserData(req)
                },
                topnavproperties: req.topnavproperties,
            });
        }

        return res.redirect("/profile?alert=3")

        
    }  catch (e) {
        return res.render("error", {
            response:{
                code: 500,
                heading: "Error",
                message: "exception",
                method: "profile_chgpwd_post",
                error: e.stack,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
        });
    }
}

// save changes to profile
async function profile_post(req, res) {

    try {
    
        // checks
        const data = req.body;
        if (!data.username) {
            return res.redirect("/profile?alert=14")
        }
        if (!data.email) {
            return res.redirect("/profile?alert=13")
        }

        // only set the values we allow user to touch
        // do not allow user to touch status, roles etc
        let newData = {
            username: req.body.username,
            email: req.body.email,
        }

        // update current user only
        const ret = await userService.updateUserById(req.user._id, newData);

        if (ret.error) {
            return res.render("user/profile_chgpwd", {
                response:{
                    code: 400,
                    heading: null,
                    message: ret.message,
                    method: "profile_post",
                    error: ret.error, //errList
                    alert: "danger",
                    user: getReqUserData(req)
                },
                topnavproperties: req.topnavproperties,
            });
        }

        // fix current user session data
        setReqUseData(req, newData);

        // success
        return res.redirect("/profile?alert=16")


    }   catch (e) {
        return res.render("error", {
            response:{
                code: 500,
                heading: "Error",
                message: "exception",
                method: "profile_post",
                error: e.stack,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
        });
    }

}

// Update session with changed profile data
function setReqUseData(req, newData){
    req.user.username = newData.username
    req.user.email = newData.email
}

// show add user page
async function user_add_get(req, res) {

    try {

        return res.render("user_admin/add_user", {
            response:{
                code: 400,
                heading: null,
                message: null,
                method: "user_add_get",
                error: null,
                alert: req.query.alert,
                user: {username: null, email: null}
            },
            topnavproperties: req.topnavproperties,
        });


    } catch (e) {
        return res.render("error", {
            response:{
                code: 500,
                heading: "Error",
                message: "exception",
                method: "user_add_get",
                error: e.stack,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
        });
    }
}

// submit new  user details
async function user_add_post(req, res) {

    try {

        const newData = req.body;

        // checks
        if (!newData.username) {
            return res.redirect("/admin/adduser?alert=14");
        }
        if (!newData.email) {
            return res.render("user_admin/add_user", {
                response:{
                    code: 400,
                    heading: null,
                    message: "Missing email",
                    method: "user_add_post",
                    error: null,
                    alert: "danger",
                    user: {username: newData.username, email: newData.email }
                },
                topnavproperties: req.topnavproperties,
            });
        }
        if (!newData.password || !newData.confirmpassword) {
            return res.render("user_admin/add_user", {
                response:{
                    code: 400,
                    heading: null,
                    message: "Missing password",
                    method: "user_add_post",
                    error: null,
                    alert: "danger",
                    user: {username: newData.username, email: newData.email }
                },
                topnavproperties: req.topnavproperties,
            });
        }
        if (newData.password !== newData.confirmpassword) {
            return res.render("user_admin/add_user", {
                response:{
                    code: 400,
                    heading: null,
                    message: "Passwords do not match",
                    method: "user_add_post",
                    error: null,
                    alert: "danger",
                    user: {username: newData.username, email: newData.email }
                },
                topnavproperties: req.topnavproperties,
            });
        }

        // set some default values
        newData.roles =["user"];
        newData.status = "active"

        // add
        const ret = await userService.createUser(newData);

        // response
        if (ret.code !== 200) {

            return res.render("user_admin/add_user", {
                response:{
                    code: 400,
                    heading: null,
                    message: ret.message,
                    method: "user_add_post",
                    error: ret.error,
                    alert: "danger",
                    user: {username: newData.username, email: newData.email }
                },
                topnavproperties: req.topnavproperties,
            });
        }

        // success, get the user id we just added then navigfate to the edi tuser page
        return res.redirect(`/admin/user/edit?id=${ret.user._id}`);
        


    } catch (e) {
        return res.render("error", {
            response:{
                code: 500,
                heading: "Error",
                message: "exception",
                method: "user_add_post",
                error: e.stack,
                alert: req.query.alert
            },
            topnavproperties: req.topnavproperties,
        });
    }
}


// Get all users by filter


module.exports =  {
    //
    signup_get,
    resetpwd_get,
    resetpwd_post,
    useToken_get,
    useToken_post,
    signup_post,
    //
    users_get,
    user_get,
    user_post,
    user_delete,
    user_chgpwd_get,
    user_chgpwd_post,
    user_add_get,
    user_add_post,
    //
    profile_get,
    profile_post,
    profile_chgpwd_get,
    profile_chgpwd_post,
    //
    

}