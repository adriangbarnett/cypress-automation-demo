// -----------------------------------------------------------------
// USER SCHEME
// -----------------------------------------------------------------
const mongoose = require("mongoose")
const { Schema } = mongoose
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')

const thisNewSchema = new Schema({
    username: String,
    email: String,
    password: String,
    createdOn: Date,
    updatedOn: Date,
    createdBy: String,
    roles: [],
    status: String,
    failedLoginAttempts: Number,
    lastLogin: Date,
    token: String,
    tokenExpire: Date,

});

// passport-local-mongoose
thisNewSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", thisNewSchema);

