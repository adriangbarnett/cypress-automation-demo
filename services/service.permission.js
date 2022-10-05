
// Check Authencticate Permissions
// TODO: clean up the code, do some security checking to see if we can spoof the role

const { PERMISSION } = require("../config/config.permissions.js") ;
const { ROLE } = require("../config/config.roles.js") ;
const User = require("../models/model.user.js") ;


// authenticate permission
function authPerm(arrPerms) { 
    return (req, res, next) => {

        // set the user
        const USER = req.user;

        // store matchs found
        const matchFound = [];
       
        // string
        let msgPD = "permission denied";

        // console.log("authPerm: USER.name: " + USER.username);
        // console.log("authPerm: USER.roles: " + USER.roles);

        if (arrPerms === null || arrPerms === undefined) { 
            return res.render("permissionDenied", {message: `Permission denied\r\n[arrPerms] is undefined or empty`});
        }

        if (USER === null || USER === undefined) { 
            return res.render("permissionDenied", {message: `Permission denied\r\nUSER] is undefined or empty`});
        }
        
        if (USER.roles === null || USER.roles === undefined) { 
            return res.render("permissionDenied", {message: `Permission denied\r\n[USER.roles] is undefined or empty`});
        }
    
        // status check
        if (USER.status !== "active"  || USER.status === undefined) { 
            console.log("authenticated user is no longer active");
            return res.redirect("/logout?alert=9");
        }


        // for each permission we want to find
        for(p=0; p!=arrPerms.length; p++) {
    
            // for each role assigned to the user
            for (r=0; r!=USER.roles.length; r++) {

                // if the user is system admin user then auto return
                if (USER.roles[r] === "system") {
                        return next();
                }

                // find the role, get permission
                for(fr=0; fr!=ROLE.length; fr++) {


                    // check if found role is same as user role
                    if (ROLE[fr].name === USER.roles[r]) {
    
                        // check if found role contains permission we need
                        // put match into a new array for later compare
                        if (ROLE[fr].permission.includes(arrPerms[p]) === true) {
                            matchFound.push(arrPerms[p]);
                        }
                    }
                }
            }
        }
    
        // compare the array results
        arrPerms.sort();        // i dont like this, it feels/looks insecure
        matchFound.sort();
        
        // compare the arrays - i dont like this, it feels/looks insecure
        if (JSON.stringify(arrPerms) === JSON.stringify(matchFound) == true) {
            return next();
        }
        // Fail
        return res.render("error", {
            response: {
                code: 403,
                message: `Permission denied, Your role(s): [${req.user.roles}], Required permission(s): [${arrPerms}]`,
                method: null,
                error: null,
            },
            topnavproperties: req.topnavproperties
        });

    }//

}

//
module.exports = {
    authPerm,
}