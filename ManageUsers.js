
const { writeDB, readDB, updateDB } = require("./MongoOperations");

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
                res.send(readResult[0].Allowed);
            }).catch((error) => {
                console.log("Error while updating the lastContact field of : " + Name + "error  "  + error);
                res.send(false);
            })
        }
    }).catch((error) => {
        console.log("Error while reading the database for : " + Name + " error = " + error);
    });
}

module.exports = ManageUser;