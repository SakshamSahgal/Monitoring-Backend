
const { writeDB, readDB, updateDB } = require("./MongoOperations");

//function that takes the name of the target and checks if it exists in the database
//if it does not exist then it creates a new entry for it
//the entry contains name, lastContact, firstContact, EarliestActivityStored and allowed
//if it does exist then it updates the lastContact field of the entry to the current time
//this function doesnt return anything but it does print the result of the operation to the console

function ManageUser(Name) {
    let FindQuery = { "Name": Name };
    readDB("Main", "Users", FindQuery, (err, result) => {
        if (err)
            throw err;
        if (result.length == 0) {
            data = {
                Name: Name,
                LastContact: new Date(),
                FirstContact: new Date(),
                EarliestActivityStored : new Date(),
                Allowed: true,
            }
            writeDB("Main", "Users", data, (err, result) => {
                if (err) throw err;
                console.log("User " + Name + " created");
            }).catch((error) => {
                console.log("Error while writing the database  for : " + Name + " error = " + error);
            });
        } else {
            console.log("User " + Name + " already exists");
            let UpdateQuery = { $set: { LastContact: new Date() } };
            //if the clientName exists in the database then update the entry's lastContact field to the current time
            updateDB("Main", "Users", FindQuery, UpdateQuery).then((result) => {
                console.log("Last Contact of " + readResult[0].Name + " Updated!");
                // res.send(readResult[0].Allowed);
            }).catch((error) => {
                console.log("Error while updating the lastContact field of : " + Name + "error  "  + error);
                // res.send(false);
            })
        }
    }).catch((error) => {
        console.log("Error while reading the database for : " + Name + " error = " + error);
    });
}

module.exports = ManageUser;