/*
    npm i express ejs dotenv path bcryptjs express-session passport passport-local passport-local-mongoose uuid cookie-parser https request express-flash aws-sdk express-fileupload method-override fs
*/

const express = require("express");
app = express();

const path = require('path');
require('dotenv').config({ path: '.env' });

const fs = require('fs');
const https = require("https");
const http = require("http");
const request = require("request");
const methodOverride = require("method-override");
const upload = require("express-fileupload");
const session = require("express-session");
const passport = require("passport");
const flash = require("express-flash");
const ip = require('ip');
const cookieParser = require("cookie-parser");

// Services
const database = require ("./services/service.database");
const passportService= require("./services/service.passport.js")
const cookieController = require ("./controllers/controller.cookie.js");
const appLocals = require("./config/config.locals.js")


//
app.use(cookieParser());
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use("/", express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(methodOverride("_method")); // so we can use "delete" request on logout form
app.use(upload())

// session, TODO: make this more secure?
app.use(session(
    {
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: true //was false
    }
))

// Passport
passportService.initialize(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())




// logging
const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: './logs/combined.log' }),
    ],
});


// on EVERY request
// app.get("*", cookieController.makeCookieIfNotExist);
// app.post("*",cookieController.makeCookieIfNotExist);
// app.patch("*", cookieController.makeCookieIfNotExist);
// app.delete("*", cookieController.makeCookieIfNotExist);

// Routes
const indexRouter = require ("./routes/route.index.js")
const adminRouter = require ("./routes/route.admin.js")
const apiRouter = require ("./routes/route.api.js")
const autoRouter = require ("./routes/route.auto.js")

//
app.use("/", indexRouter);
app.use("/admin", adminRouter);
app.use("/api", apiRouter);
app.use("/auto", autoRouter);


// LOGIN
app.post("/login", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login?alert=1",
    failureFlash: true,
}))

app.get("/setuser", setuser, passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login?alert=1", //req.query.redirect;
    failureFlash: true,
}))

// login via url: http://localhost:3000/setuser?username=xx&password=yy
function setuser(req, res, next) {
    console.log("setuser")
    req.body.username = req.query.username;
    req.body.password = req.query.password;
    req.body.redirect = req.query.redirect;
    next();
}

app.get("/makedev", async (req, res) => { 
    await createDevAdmin();
    return res.redirect("/login?alert=1000")
})

//
app.get("/ping", (req, res) => { return res.send({code: 200, message: "alive", host: req.host}); })
app.get("*", (req, res) => { return res.send({code: 404, message: "page not found", url: req.url}); })

// Start
app.listen(process.env.PORT || process.env.LOCALHOST_PORT, async function(req, res) { 
    database.connect();
    await appLocals.init();
//    await createDevAdmin();
    console.log(`Server started, version: ${process.env.VERSION}`);
    
});


// DEV testing create admin
async function createDevAdmin(){
    try {
       const userService = require("./services/service.user")

       const s = await userService.getUserByUsername("s");
       const a = await userService.getUserByUsername("a");
       const u = await userService.getUserByUsername("u");
       const ro = await userService.getUserByUsername("ro");
       if (s) { await userService.deleteUserById(s._id); }
       if (a) { await userService.deleteUserById(a._id); }
       if (u) { await userService.deleteUserById(u._id); }
       if (ro) { await userService.deleteUserById(ro._id); }
       await userService.createUser({username: "s", password: "s", email: "s@mail.com", status: "active", roles: ["system"]});
       await userService.createUser({username: "a", password: "a", email: "a@mail.com", status: "active", roles: ["user_admin"]});
       await userService.createUser({username: "u", password: "u", email: "u@mail.com", status: "active", roles: ["user"]});
       await userService.createUser({username: "ro", password: "ro", email: "u@mail.com", status: "active", roles: ["user", "read_only"]});
       console.log("created user: s a u")
    } catch (e) {
        console.log(e);
    }
}