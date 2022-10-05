// User CRUD
const User = require("../models/model.user");
const passwordService = require("./service.password");
const utils = require("../utils/utils.js")
// Create One
async function createUser(user) {

    try {

        // sanity checks
        if (user.username == null || user.username.length == 0) {
            return {
                code: 400, 
                message: "Username required",
                method: "createUser"
            }; 
        }

        if (user.email == null || user.email.length == 0) {
            return {
                code: 400, 
                message: "Email required",
                method: "createUser"
            }; 
        }

        if (user.password == null || user.password.length == 0) {
            return {
                code: 400,
                message: "Password required",
                method: "createUser"
            }; 
        }

        if (await getUserByUsername(user.username) != null) {
            return {
                code: 400, 
                message: "Username taken",
                method: "createUser",
            }; 
        }


        // TODO: REFATCOR THE VALIDATION
        // validate password syntax and get list of errors
        // const passwordErrList = await passwordService.validatePasswordInput(user.password);
        // if (passwordErrList != null) {
        //     return {
        //         code: 400,
        //         message: "Password does not meet requiements",
        //         method: "createUser",
        //         error: passwordErrList
        //     };
        // }

         // salt then hash the password 
         const hashPwd = await passwordService.hashPassword(user.password);
         if (hashPwd.code != 200) {
             return hashPwd; // error
         }

        // create invalid token
        const newTokenData = await setNewToken("CREATEINVALID","CREATEINVALID");

         // Override some values
        var newData = user;
        const createDateTime = Date.now();
        newData.password = hashPwd.hashedPassword;
        newData.createdOn = createDateTime;
        newData.updatedOn = createDateTime;
        newData.token = newTokenData.token;
        newData.tokenExpire = createDateTime;

        // Update db
        var newUser = new User(newData);
        const ret = await newUser.save();

        if (ret) {
            return {
                code: 200, 
                message: "User created",
                method: "createUser",
                user: ret
            };
        }
        return {
            code: 400, 
            message: "Failed to create user",
            method: "createUser",
            user: ret
        };

    } catch (e) {
        console.log(e.stack);
        return {
            code: 500,
            message: "exception",
            method: "createUser",
            error: e.stack
        };
    }


}

// Creae a new token that will expire in 15 minutes
async function setNewToken(prefix, suffix) {

    
    if (!prefix) { prefix = ""; }
    if (!suffix) { suffix = ""; }

    // Cacluylate date/time 15 minutes in future
    var currentDateTime = new Date();
    var expireDateTime = new Date(currentDateTime.getTime()+parseInt(process.env.TOKEN_EXPIRE_MS)); 
    expireDateTime.toLocaleDateString();

    // set expiration of the token
    const newtoken = {
        token: prefix + await passwordService.generateUUID() + suffix,
        tokenExpire: expireDateTime
    }

    return newtoken;
}

// Find one user by id
async function getUserById(id){
    try {

        if(id === null) {
            return {
                code: 400, 
                message: "Missing id",
                method: "getUserById", 
            };
        }

        const ret = await User.findById({_id: id}).select("-password -__v");
        return ret;

    } catch (e) {
        console.log(e.stack);
        return {
            code: 500,
            message: "exception",
            method: "getUserById",
            error: e.stack
        };
    }
}

// Find one user by username
async function getUserByUsername(username) {
    try {

        if(username === null) {
            return {
                code: 400, 
                message: "Missing username",
                method: "getUserByUsername",
            };
        }

        const ret = await User.findOne({username: username}).select("-password -__v");
        return ret;

    } catch (e) {
        console.log(e.stack);
        return {
            code: 500,
            message: "exception",
            method: "getUserByUsername",
            error: e.stack
        };
    }
}

// Find one user by email
async function getUserByEmail(email){
    try {

        if(email === null) {
            return {
                code: 400, 
                message: "Missing email",
                method: "getUserByEmail",
            };
        }

        const ret = await User.findOne({email: email}).select("-password -__v");
        return ret;

    } catch (e) {
        console.log(e);
        return {
            code: 500,
            message: "exception",
            method: "getUserByEmail",
            error: e.stack
        };
    }
}

// fin duser by token
async function getUserByToken(token){
    try {

        if(!token) {
            return {
                code: 400, 
                message: "Missing token",
                method: "getUserByToken",
            };
        }

        const ret = await User.findOne({token: token}).select("-password -__v");
        return ret;

    } catch (e) {
        console.log(e.stack);
        return {
            code: 500,
            message: "exception",
            method: "getUserByToken",
            error: e.stack
        };
    }
}

// Find all users
async function getAllUsers(){
    try {

        const ret = await User.find().select("-password -__v");
        return ret;

    } catch (e) {
        console.log(e.stack);
        return {
            code: 500,
            message: "exception",
            method: "getAllUsers",
            error: e.stack
        };
    }
}

// Delete one user by id
async function deleteUserById(id) {

    try {

        if(id === null) {
            return {
                code: 400, 
                message: "Missing id",
                method: "deleteUserById", 
            };
        }

        const ret = await User.deleteOne({_id: id});
        return ret;

    } catch (e) {
        console.log(e.stack);
        return {
            code: 500,
            message: "exception",
            method: "deleteUserById",
            error: e.stack
        };
    }
}

// Delete all users
async function deleteAllUsers() {

    try {

        const ret = await User.deleteMany();
        return  ret;

    } catch (e) {
        console.log(e.stack);
        return {
            code: 500,
            message: "exception",
            method: "deleteAllUsers",
            error: e.stack
        };
    } 
}

// Update one user by id
async function updateUserById(id, newUser) { 

    try {

        // validation checks
        if (!id) { 
            return {
                code: 400, 
                message: "id required",
                method: "updateUserById",
            }; 
        }

        const thisUser = await User.findOne({_id: id});

        if (!thisUser){
            return {
                code: 400, 
                message: "User not found by id",
                method: "updateUserById",
            };
        }

        //if password was provided then hash it
        if(newUser.password) {

            console.log({newUser: newUser});

            // TODO: REFATCOR THE VALIDATION
            // validate password syntax
            // const passwordErrList = await passwordService.validatePasswordInput(newUser.password);
            // if (passwordErrList != null) {
            //     return {
            //         code: 400,
            //         message: "Password not meet requirments",
            //         method: "updateUserById",
            //         error: passwordErrList
            //     }
            // }

            // do password hashing
            const hash = await passwordService.hashPassword(newUser.password);
            if (hash.code != 200) {
                return {
                    code: 500,
                    message: "Error generating password hash: ",
                    method: "updateUserById",
                    error: hash // error stack
                }
            }

            // replace plain text password with hash
            newUser.password = hash.hashedPassword;
        }

        // check new user name not already in by someone else
        if(newUser.username) {
            if (thisUser.username !== newUser.username) {
                if (await User.findOne({username: newUser.username}) !== null) {
                    return {
                        code: 400, 
                        message: "Username taken",
                        method: "updateUserById",
                    };
                }
             }
        }

        // set date
        newUser.updatedOn = Date.now();

        // send update to db
        const response = await User.findOneAndUpdate({_id: id}, 
            { 
                $set: newUser 
            },
            {
                new: true
            }).select('-password -__v');

        if (response ==  null ){
            return {
                code: 400, 
                message: "User not found by id",
                method: "updateUserById",
            };   
        }

        // success
        return {
            code: 200, 
            message: "User updated", 
            method: "updateUserById",
            user: response
        }; 

    } catch (e) {
        console.log(e.stack);
        return {
            code: 500,
            message: "exception",
            method: "updateUserById",
            error: e.stack
        };
    }

}

// invalidate the reset password token and set failed Login Attempts to zero
// we will just generate a new ID and wrap junk around it so user can not guess it.
async function clearResetPwdTokenByUsrId(id) {

    try {

        if (!id) { 
            return {
                code: 400, 
                message: "Missing id",
                method: "clearResetPwdTokenByUsrId"
            };
        }

        // create invalid token
        const newTokenData = await setNewToken("CLEARTOKEN","CLEARTOKEN");

        const userData = {
            tokenExpire: new Date(), 
            token: newTokenData.token
            //token: await "CLEARTOKEN" + passwordService.generateUUID() + "CLEARTOKEN"
        }

        // update user in db (no errrohandling here)
        const ret = await updateUserById(id, userData);
        return ret;

    }   catch (e) {
        console.log(e.stack);
        return {
            code: 500,
            message: "exception",
            method: "clearResetPwdTokenByUsrId",
            error: e.stack
        };
    }

 }

 // create reset password token with epxiration date time.
 async function generateResetPasswordLink(username) {

    try {

        // error check
        if (!username) {
            return {
                code: 400,
                message: "Username required",
                method: "generateResetPasswordLink"
            }
        }

        // find user in db
        const user = await getUserByUsername(username);
        if (user === null) {
            return {
                code: 400,
                message: "Username not found",
                method: "generateResetPasswordLink"
            }
        }

        // found user, check email syntax
        if (utils.validateEmail(user.email) !== true) {
            return {
                code: 400, 
                message: `invalid email syntax: [${user.email}]`,
                method: "generateResetPasswordLink"
            };
        }

        // create expirtation date, 
        const currentDateTime = new Date();
        const expireDateTime = new Date(currentDateTime.getTime()+parseInt(process.env.TOKEN_EXPIRE_MS));
        expireDateTime.toLocaleDateString();

        // set token id and expiration
        const newTokenData = await setNewToken();

        const newData = {
            token: newTokenData.token,
            tokenExpire: newTokenData.tokenExpire
        }

        // update  db with token UUID and expiration date/time
        const updateResponse = await updateUserById(user._id, newData);
    
        if (updateResponse.code != 200) {
             return {
                code: 400, 
                message: "failed to set token in db",
                method: "generateResetPasswordLink",
                error: updateResponse.message
            }
        }
    
        // return token data and user id
        return {
            code: 200,
            message: "token created",
            method: "generateResetPasswordLink",
            token: newData.token,
            expires: newData.tokenExpire,
            id: user._id
        } 

    } catch (e) {
        console.log(e.stack);
        return {
            code: 500,
            message: "exception",
            method: "generateResetPasswordLink",
            error: e.stack
        };
    }

 }

module.exports = {
    // user helper functions
    clearResetPwdTokenByUsrId,
    generateResetPasswordLink,
    // User CRUD
    createUser,
    updateUserById,
    getUserByUsername,
    getAllUsers,
    getUserById,
    deleteUserById,
    deleteAllUsers,
    getUserByEmail,
    getUserByToken,
    setNewToken,

 }