// VERSION 2
/*
    When we render web page we want to send data that will help us detemined
    what buttons controls to enable, hide, disabled, and which topnav button
    to display as "active".
    We also want to show some shopping car data.
*/

const { PERMISSION } = require("../config/config.permissions.js") ;
const { ROLE } = require("../config/config.roles.js") ;

// Middleware from router(s)
// prepare data and properties to send to the top nav bar when we next render it.
function setNav(pageName, admin) {

    return (req, res, next)  => {
      
        try {
            
            let properties = {
                // admin page tabs
                dashboard: null, 
                users: null, 
                items: null, 
                files: null, 
                reports: null, 
                bugs: null, 
                profile: null,
                // non-admin page tabs
                home: null, 
                store: null, 
                register: null, 
                contact: null, 
                about: null, 
                login: null, 
                cart: null,
                setpassword: null, // this is page not using topnav
                // Shopping cart
                myCookie: [],
                myCookieLength: 0,
                // Other
                page: pageName,       
                admin: admin,
                // user info
                roles: null,
                username: "anonymouse", //  not authenticated
                email: null,
                permissions: [],
            }
    
            // Get cart cookie
            if (req.cookies.mydevtestcookie != null)  {
                properties.myCookie = req.cookies.mydevtestcookie;
                properties.myCookieLength = req.cookies.mydevtestcookie.length;
            }


            // get authenticated user we may need
            if(req.user) {
                properties.username = req.user.username
                // get list of permissions
                if (req.user.roles) {
                    properties.roles = req.user.roles;
                    properties.permissions =  getPermissionList (req.user.roles);
                }
            }
    
    
            // Set one once of top nav bar tabs as ACTIVE
            switch (pageName) {
                // user
                case "home": properties.home = "active"; break; 
                case "store": properties.store = "active"; break; 
                case "register": properties.register = "active"; break; 
                case "contact": properties.contact = "active"; break; 
                case "about": properties.about = "active"; break; 
                case "login": properties.login = "active"; break; 
                case "cart": properties.cart = "active"; break;
                case "dashboard": properties.dashboard = "active"; break; 
                case "users": properties.users = "active"; break; 
                case "items": properties.items = "active"; break 
                case "files": properties.files = "active"; break; 
                case "bugs": properties.bugs = "active"; break; 
                case "profile": properties.profile = "active"; break; 
                default: break;
            }
    
            // each time we render something with ejs we will send: req.topnavproperties
            req.topnavproperties = properties;
            return next();

        } catch (e) {
            console.log(e.stack);
            return next();
        }

    }

}

// get list of permissions from all the assigned roles
// then return the list of permisisons an an array
// todo: i think we can improve this code.
function getPermissionList(roles) {

    let permissionList = [];

    if (!roles) { return permissionList; }


   // console.log({roles: roles});

    // for each role assigned to current user
    for (r = 0; r != roles.length; r++) {

        // if contain system just return
        if (roles[r] === "system") { 
            permissionList.push("system");
            return permissionList;
        }

        // find the role within the role config
        for (fr = 0; fr != ROLE.length; fr++) {

            // see if config role is a match with our role
            if (ROLE[fr].name === roles[r]) {

                // match found, get list of permission from this role 
                // then put into the return array
                for(p=0; p != ROLE[fr].permission.length; p++) {
                    //console.log({p: ROLE[fr].permission[p]});
                    permissionList.push(ROLE[fr].permission[p]);
                }
            }
        }
    }

    //console.log({permissionList: permissionList});
    return permissionList;

}

module.exports = {
    setNav
}