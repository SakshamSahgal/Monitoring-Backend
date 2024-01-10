
const { writeDB, readDB, updateDB } = require("./MongoOperations");
const path = require("path");
const fs = require("fs");

//function that takes the name of the target and checks if it exists in the database
//if it does not exist then it creates a new entry for it
//the entry contains name, lastContact, firstContact, EarliestActivityStored and allowed
//if it does exist then it updates the lastContact field of the entry to the current time
//if the oldest file in the uploads/targetName folder is older than 1 day then it deletes the file and updates the EarliestActivityStored field of the entry to the date of the next file
//this function doesnt return anything but it does print the result of the operation to the console

function ManageUser(Name) {
    console.log("ManageUser called for " + Name);
    let FindQuery = { "Name": Name };
    readDB("Main", "Users", FindQuery).then( (result) => {
        console.log("Read result = " + result);
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
            
            //read the first file stored in folder uploads/Name , using fs
            //if the file is older than 1 day (which we will find out by comparing date.now with the name of the file,(which has the date in it as timestamp) ) then we will delete the file
            //then we will update the EarliestActivityStored field of the user to the date of the next file
            //if there are no files left then we will update the EarliestActivityStored field to the current time

            let readResult = result;
            let dir = path.join(__dirname, 'uploads', Name);
            let files = fs.readdirSync(dir);
            let oldestFile = files[0];
            let oldestFileDate = oldestFile.split("_")[1].split(".")[0];
            let currentDate = Date.now().toString();
            let timeDifference = currentDate - oldestFileDate;
            console.log("Time difference = " + timeDifference);

            if (timeDifference > parseInt(process.env.MAXIMUM_FILE_AGE)) {
                console.log("Deleting file " + oldestFile);
                fs.unlinkSync(path.join(dir, oldestFile));
                console.log("File deleted");
                files = fs.readdirSync(dir);
                if(files.length == 0){
                    console.log("No files left");
                    UpdateQuery.$set.EarliestActivityStored = new Date();
                }
                else{
                    oldestFile = files[0];
                    oldestFileDate = oldestFile.split("_")[1].split(".")[0];
                    UpdateQuery.$set.EarliestActivityStored = new Date(parseInt(oldestFileDate));
                }
            }
            else{
                console.log("No need to delete file " + oldestFile);
            }
            
            updateDB("Main", "Users", FindQuery, UpdateQuery).then((result) => {
                console.log(`Last Contact of ${readResult[0].Name} Updated while  uploaded an Image!`);
            }).catch((error) => {
                console.log("Error while updating the lastContact field of : " + Name + "error  "  + error);
            })
        }
    }).catch((error) => {
        console.log("Error while reading the database for : " + Name + " error = " + error);
    });
}

module.exports = ManageUser;