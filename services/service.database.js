/*
    Database connection to mongo db
*/

const mongoose = require("mongoose");
const database = mongoose.connection;

// events
database.on("error", () => console.log("Error connecting to Database "));
database.once("connected", () => console.log("Database connection open"));
database.on("close", () => console.log("Database connection closed" ));

// connect to cloud database
module.exports.connect = connect;
function connect(){

    console.log("Database connecting to: " + process.env.MONGODB_URL);

    mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
        if(err) {
            console.log("Error connecting to database : " + err.stack);
        }
    });

}

//
module.exports.disconnect = disconnect;
function disconnect() {
    database.close();
}


// delete entire database
module.exports.doDropDatabase = (res, databaseName) => {

    database.dropDatabase( () => {

        if(err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
        else {
            console.log(databaseName + " dropped"); 
            res.status(200).send("OK");
        }
    });

}

// delete dcollection in current database
module.exports.doDropCollection = (res, collectionName) => {
    
    database.dropCollection(collectionName, (err) => {
        if(err) {
            console.log(err);
            errorHandler.internalServerError(res,err)
        }
        else {
            console.log(collectionName + " dropped"); 
            res.status(200).send("OK");
        }

    });

}