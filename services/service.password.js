const bcrypt = require('bcryptjs');
const uuid = require('uuid');


// Unique user id
async function generateUUID(){

    return await uuid.v1(); // uuid.v4();
}

// --------------------------------------------------
// encode password
async function hashPassword(plainTextPassword) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(plainTextPassword, salt);
        return {
            code: 200, 
            message: "OK",
            message: "Hash generated", 
            method: "hashPassword",
            hashedPassword: hash
        };
    }
    catch (e) {
        return {
            code: 400, 
            message: "Bad request", 
            method: "hashPassword",
            error: e
        };
    }
}

// compare password
async function comparePassword(plaintextPassword, hashedPassword) {
    try {
        const ret = await bcrypt.compare(plaintextPassword,hashedPassword)
        return {
            code: 200, 
            message: "OK", 
            method: "comparePassword",
            status: ret
        };
    }
    catch (e) {
        return {
            code: 400, 
            message: "Bad request", 
            method: "comparePassword",
            error: e
        };
    }
}

// TODO: refactor and improve this validation code.
// check user fields
const validateUserInput = async (user) => { 

    const errorList = [];

    if (user.username.length < app.locals.minUsernameLen) { errorList.push(`"Min username length is ${app.locals.minLminUsernameLenen} chars, Max username length is ${app.locals.maxUsernameLen} chars`); }
    if (user.username.length  > app.locals.maxUsernameLen) { errorList.push(`"Min username length is ${app.locals.minUsernameLen} chars, Max username length is ${app.locals.maxUsernameLen} chars`); }
    if (user.email.length  < app.locals.minUsernameLen) { errorList.push(`"Min email length is ${app.locals.minEmailLen} chars, Max email length is ${app.locals.maxEmailLen} chars`); }
    if (user.email.length  > app.locals.maxUsernameLen) { errorList.push(`"Min email length is ${app.locals.minEmailLen} chars, Max email length is ${app.locals.maxEmailLen} chars`); }
    

    if (errorList.length > 0) {
        return errorList;
    }
    return null;
}

// password input validation, TODO: put this into a config
const validatePasswordInput = async (plainTextPassword) => {

    const errorList = [];

    if (plainTextPassword == null) { errorList.push("Password must not be empty"); }
    if (plainTextPassword.length  == 0) { errorList.push("Password must not be empty"); }
    if (plainTextPassword.length < app.locals.minPasswordLen) { errorList.push(`Min length: ${app.locals.minPasswordLen}, Max length: ${app.locals.maxPasswordLen}`); }
    if (plainTextPassword.length > app.locals.maxPasswordLen) { errorList.push(`Min length: ${app.locals.minPasswordLen}, Max length: ${app.locals.maxPasswordLen}`); }
    
    if (app.locals.special === true) {
        if (await assertStringContains_specialchar(plainTextPassword) == false) { errorList.push("Password must contain special char"); }
    }

    if (app.locals.lower === true) {
        if (await assertStringContains_lowercase(plainTextPassword) == false) { errorList.push("Password must contains lowecase char"); }
    }

    if (app.locals.upper === true) { 
        if (await assertStringContains_uppercase(plainTextPassword) == false) { errorList.push("Password must contain uppercase char"); }
    }

    if (app.locals.number === true) { 
        if (await assertStringContains_number(plainTextPassword) == false) { errorList.push("Password must contain number"); }
    }
    if (errorList.length > 0) {
        return errorList;
    }
    return null;
}

// check if string contains chars
const assertStringContains = async (text, chars) => {
    for (let index = 0; index < chars.length; ++index) {
        const c = chars[index];
        if (text.includes(c)) return true;
    }
    return false;
}

// check if string contains special chars
const assertStringContains_specialchar = async (text) =>
{
    return await assertStringContains(text, app.locals.specialChars)
}

// check if string contains at leist 1 upper case char
const assertStringContains_uppercase = async (text) => {
    return await assertStringContains(text, app.locals.upperChars)
}

// check if string contains at leist 1 upper case char
const assertStringContains_lowercase = async (text) => {
    return await assertStringContains(text, app.locals.lowerChars)
}

// check if string contains at leist 1 upper case char
const assertStringContains_number = async (text) => {
    return await assertStringContains(text, app.locals.numberChars)
}

module.exports =  {
    hashPassword,
    comparePassword,
    validatePasswordInput,
    generateUUID,
    validateUserInput
}