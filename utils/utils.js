const fs = require('fs');

// string to slug: https://gist.github.com/codeguy/6684588
function string_to_slug (str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}


// check email use valid syntax
function validateEmail(email) {
    
    if (email.length < 5 ) { return false; }
    if (email.includes("@") === false) { return false; }
    if (email.includes(".") === false) { return false; }
    
    const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return res.test(String(email).toLowerCase());
}

// check number is decimal format, e.g: 0.23
function isDecimal(strNumber) {
    var regex  = /^\d+(?:\.\d{0,2})$/;
    if (regex.test(strNumber)) { 
        return true;
    } else {
        return false;
    }
}

// mkdir
async function makeDir(dirPathName){
    try {

        // errro check
        if (dirPathName === null || dirPathName === undefined) {
            console.log({code: 400, message: "dirPathName is null"});
            return false;
        }

        // check if dir already exists
        if (fs.existsSync(dirPathName) === true) { 
            return true; 
        }

        // create
        await fs.mkdir(dirPathName, (err) => {
            if (err) {
                console.log({code: 500, message: `Unable to create directory [${dirPathName}]`, error: err.stack});
                return false;
            }
            console.log(`Directory created successfully [${dirPathName}]`);
            return true;
        }); 

    } catch (e) {
        console.log({code: 500, message: "makeDir exception", error: e.stack});
        return false;
    }

}

module.exports = {
    validateEmail,
    isDecimal,
    makeDir,
    string_to_slug
}