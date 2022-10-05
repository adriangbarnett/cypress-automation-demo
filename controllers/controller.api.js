// API
const userService = require("../services/service.user.js");


// -------------------------------------------------------
//  USER API
// -------------------------------------------------------

// add user
async function createUser_post(req, res) {
    try {

        const ret = await userService.createUser(req.body);
        return res.send(ret);

    } catch(e) {
        return res.status(500).json({
            code: 500,
            message: "exception",
            method: "createUser_post",
            error: e.stack
        });
    }

}

// update
async function updateUser_patch(req, res) {
    try {

        if (!req.query.id) {
            return res.send({
                code: 400, 
                message: "missing id in url",
                method: "updateUser_patch"
            })
        }

        const ret = await userService.updateUserById(req.query.id, req.body);
        return res.send(ret);

    } catch(e) {
        return res.status(500).json({
            code: 500, 
            message: "exception", 
            method: "updateUser_patch", 
            error: e.stack
        });
    }
}

// get one
async function getUser_get(req, res) { 
    try {

        if (!req.query.id) {

            return res.send({
                code: 400, 
                message: "missing id in url",
                method: "updateUser_patch"
            })
        }

        const ret = await userService.getUserById(req.query.id);

        if (ret === null) { return res.send({}); }
        return res.send(ret);

    } catch(e) {
        return res.status(500).json({
            code: 500, 
            message: "exception", 
            method: "getUser_get", 
            error: e.stack
        });
    }
}

// get all
async function getUsers_get(req, res) { 
    try {

        const ret = await userService.getAllUsers();
        if (ret === null) { return []; }
        return res.send(ret);

    } catch(e) {
        return res.status(500).json({
            code: 500, 
            message: "exception", 
            method: "getUsers_get", 
            error: e.stack
        }); 
    }
    
}

// delete one
async function deleteUser_delete(req, res) { 
    try {

        if (!req.query.id) {
            return res.send({
                code: 400, 
                message: "missing id in url",
                method: "updateUser_patch"
            })
        }
        const ret = await userService.deleteUserById(req.query.id);
        return res.send(ret);

    } catch(e) {
        return res.status(500).json({
            code: 500, 
            message: "exception", 
            method: "deleteUser_delete", 
            error: e.stack
        }); 
    }
}

// delete all
async function deleteUsers_delete(req, res) { 
    try {

        const ret = await userService.deleteAllUsers();
        return res.send(ret);

    } catch(e) {
        return res.status(500).json({
            code: 500, 
            message: "exception", 
            method: "deleteUsers_delete", 
            error: e.stack
        }); 
    }

}



module.exports = {
    // User
    createUser_post,
    updateUser_patch,
    getUser_get,
    getUsers_get,
    deleteUser_delete,
    deleteUsers_delete,
}