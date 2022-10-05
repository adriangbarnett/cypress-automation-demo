// Set globals
// Set locals
const { ROLE  } = require("./config.roles.js");
const { PERMISSION } = require("./config.permissions.js");
const { STATUS } = require("./config.status.js");

async function init() {

    console.log("Initialize app.locals");

        app.locals.STATUS = STATUS;
        app.locals.ROLE = ROLE;
        app.locals.PERMISSION = PERMISSION;

}

 
module.exports =  {
    init
}